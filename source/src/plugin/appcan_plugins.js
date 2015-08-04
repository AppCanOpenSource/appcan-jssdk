
appcan.extend(function(app,exports,module){
        var $ = appcan.require('dom');
        var appWin = appcan.require('window');
        var locStorage = appcan.require('locStorage');
        var view = appcan.require('view');
        /*
         * 兼容pc，移动设备的封装
         * @param String className 要更改的class
         * @param Functon fun 执行结束后的回调
         * 
         * 
         */
        function touch(className,fun){
                var ele = event.currentTarget || event.srcElement;
                var eventType = event.type;
                var hasTouch = ('ontouchstart' in window);
                var $ele = $(ele);
                var ed = $ele.data('inline_event_data');
                if(ed){
                        return;
                }
                ed = {};
                ed.clickFun = $ele.attr('onclick');
                ed.startFun = $ele.attr('ontouchstart') || $ele.attr('onmousedown');
                ed.endFun = $ele.attr('ontouchend') || $ele.attr('onmouseup');
                ed.startClassName =className;
                ed.startCallFun = fun;
                ed.endClassName =ed.startClassName;
                ed.endCallFun = ed.startCallFun;
                $ele.data('inline_event_data',ed);
                $ele.attr('onclick','');
                $ele.attr('ontouchstart','');
                $ele.attr('onmousedown','');
                $ele.attr('ontouchend','');
                $ele.attr('onmouseup','');
                if(hasTouch){
                        //set click and change css
                        $ele.on('touchstart',function(){
                                if(!ed.startClassName){
                                    return;    
                                }
                                $(this).addClass(ed.startClassName);
                        });
                        $ele.on('touchend',function(){
                                if(!ed.endClassName){
                                    return;    
                                }
                                $(this).removeClass(ed.endClassName);
                        });
                        $ele.on('tap',function(evt){
                                if (appcan.isFunction(ed.startCallFun)) {
                                        ed.startCallFun.apply(this, [].slice.call(arguments));
                                }
                                var f = new Function(ed.clickFun);
                                f();
                        });
                }else{
                        //just change css
                        $ele.on('mousedown',function(){
                                if(!ed.startClassName){
                                    return;    
                                }
                                $(this).addClass(ed.startClassName);
                        });
                        $ele.on('mouseup',function(){
                                if(!ed.endClassName){
                                    return;    
                                }
                                $(this).removeClass(ed.endClassName);
                        });
                        $ele.on('click',function(){
                                 if (appcan.isFunction(ed.startCallFun)) {
                                        ed.startCallFun.apply(this, [].slice.call(arguments));
                                }
                                var f = new Function(ed.clickFun);
                                f();
                        });
                }
                //bind webkitTransitionEnd event
                $ele.addClass(ed.startClassName);
                $ele.on('webkitTransitionEnd',function(){
                        
                });
        }
        
        /*
         * 设置相关check元素选中
         * @param Event e 点击该元素的事件
         * @param Function callback 执行结束后事件回调 todo:同步执行函数没有必要用回调
         * 
         * 
         */
        
        function elementFor(e,callback){
                 var forEle;
                 e = e || event;
                 if(e.currentTarget){
                         forEle = e.currentTarget.previousElementSibling;
                 }
                 else{
                        forEle = e.previousElementSibling;
                 }
                 var $forEle = $(forEle);
                 if ($forEle.prop("tagName") == "INPUT") {
                         if ($forEle.attr("type") == "checkbox") {
                                 forEle.checked = !forEle.checked;
                         }
                         if ($forEle.attr("type") == "radio" && !forEle.checked) {
                                forEle.checked = "checked";
                         }
                 }
                if (appcan.isFunction(callback)) {
                        callback(e, forEle.checked);
                }
        }
        
        /*
         * 如果是win平太设置body 默认字体
         * 
         * 
         */
        
        function initFontsize(){
                var platform = navigator.platform;
                if (platform.toLowerCase().indexOf('win') > -1 || platform.toLowerCase().indexOf('wow') > -1) {
                        var fs = locStorage.getVal('defaultfontsize');
                        if(fs){
                                $('body').css('font-size',fs);
                        }
                }
        }
        
        /*
         * 用指定元素的样式打开一个弹框
         * @param String eleId 指定元素的id
         * @param String url 要打开的连接地址
         * @param Int left 距左边的距离
         * @param Int top 距上边的距离
         * 
         * 
         */
        function openPopoverByEle(eleId,url,top,left){
                if(!eleId){
                    return;    
                }
                var ele = $('#'+eleId);
                appWin.openPopover({
                        name:eleId,
                        url:url,
                        left:left,
                        top:top,
                        width:ele.width(),
                        height:ele.height()
                });
        }
        
        /*
         * 简单的模版插件
         * 
         * 
         */
        
        var tmpl = function(){
                var config = {
                        evaluate    : /<%([\s\S]+?)%>/g,
                        interpolate : /<%=([\s\S]+?)%>/g,
                        escape      : /\${([\s\S]+?)}/g
                };
                var args = [].slice.call(arguments);
                args.push(config);
                return view.render.apply(this,args);
        };
        
        /*
         * 打开一个新窗口
         * @param String name 窗口的名字
         * @param String url 要加载的地址
         * @param Int aniId 动画效果
         * 
         * 
         */
        
        function openWinWithUrl(name,url,aniId){
                if(!name){
                        return;
                }
                appcan.window.open({
                        name:name,
                        data:url,
                        aniId:(aniId || 10)
                });
        }
        /*
         * 关闭窗口
         * 
         * 
         */
        function closeWin(aniId){
                aniId = aniId || -1;
                appWin.close(aniId);
        }
        /*
         * 设置localstorage的值
         * 
         * 
         */
        function setLocalVal(key,val){
                return locStorage.setVal(key,val);
        }
         /*
         * 获取localstorage的值
         * 
         * 
         */
        function getLocalVal(key){
                return locStorage.getVal(key);
        }
        /*
         * 
         * 在窗口中执行脚本
         * 
         * 
         * 
         */
    
        function execScriptInWin(name,scriptContent){
                if(!name || !scriptContent){
                        return;
                }
                appWin.evaluateScript({
                        name:name,
                        scriptContent:scriptContent
                });
        }
        
        module.exports = {
                elementFor:elementFor,
                touch:touch,
                initFontsize:initFontsize,
                openPopoverByEle:openPopoverByEle,
                resizePopoverByEle:appWin.resizePopoverByEle,
                tmpl:tmpl,
                openWinWithUrl:openWinWithUrl,
                closeWin:closeWin,
                setLocVal:setLocalVal,
                getLocVal:getLocalVal,
                execScriptInWin:execScriptInWin
        };
});

