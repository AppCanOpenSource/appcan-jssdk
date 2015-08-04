/*
    author:chenxue
    email:xue.chen@3g2win.com
    description:扩展control 到appcan对象上
    created:2014,08.29
    update:


*/
/*global appcan,uexWindow,document,window,event*/
;appcan && appcan.extend(function(ac,exports,module){
    /*
    下拉列表控件
    @param String id 下拉列表select标签的id

    */
    var $ = appcan.requre('dom');
    var select = function(id){
        var sl = $('#'+id)[0];
        if (sl) {
            var sp = sl.parentElement; //<span>
            if (sp) {
                var ch = sp.getElementsByTagName('div')[0];
                var t = sl.options[sl.selectedIndex].text;
                if (ch) {
                    $(ch).html(t);
                }
            }
        }
    };

    /*
    更改单选和多选的状态插件
    @param Object e event对象
    @param Function callback 回调方法

    */
    var forInput = function(e, callback){
        var ch;
        if(e.currentTarget){
            ch = e.currentTarget.previousElementSibling;
        }else{
            ch = e.previousElementSibling;
        }
        if (ch.nodeName == 'INPUT') {
            if (ch.type == 'checkbox'){
                ch.checked = !ch.checked;
            }
            if (ch.type == 'radio' && !ch.checked){
                ch.checked = 'checked';
            }
        }
        if (callback){
            callback(e, ch.checked);
        }
    };

    /*
    字符组去除后面空格
    @param Object e event对象
    @param Boolean col 布尔值
    */
    var fold = function(e, col){
        var a = e.currentTarget.nextElementSibling;
        if (a.nodeName == 'DIV'){
            if (col){
                a.className = a.className.replace('col-c', '');
            }else{
               a.className += ' col-c';
            }
        }
    };
    /*
    解析当前网页URL中的参数部分，返回参数数组。

    */
    var parse = function(){
        var params = {};
        var loc = String(document.location);
        if (loc.indexOf('?') > 0){
            loc = loc.substr(loc.indexOf('?') + 1);
        }else{
            loc = uexWindow.getUrlQuery();
        }
        var pieces = loc.split('&');
        params.keys = [];
        for (var i = 0; i < pieces.length; i += 1) {
            var keyVal = pieces[i].split('=');
            params[keyVal[0]] = decodeURIComponent(keyVal[1]);
            params.keys.push(keyVal[0]);
        }
        return params;
    };
    /*
    parseInt
    @param String s 字符串
    */
    var Int = function(s){
        return parseInt(s);
    };
    /*
    根据一个DOM元素的高宽创建一个浮动窗口
    @param String DOM元素的id 
    @param String url 浮动窗口的url
    @param String x 浮动窗口x轴坐标
    @param String y 浮动窗口y轴坐标
    @param String name 浮动窗口的窗口名称
    */
    var con = function(id,url,x,y,name){
        var s = $('#'+id);
        uexWindow.openPopover(name?name:id,'0',url,'',Int(x),Int(y),Int(s.width()),Int(s.height()),Int(s.css('font-size')),'0');
    };
    /*
    根据一个DOM元素的高宽调整一个浮动窗口的位置及区域
    @param String DOM元素的id 
    @param String x 浮动窗口x轴坐标
    @param String y 浮动窗口y轴坐标
    @param String name 浮动窗口的窗口名称
    */
    var resize = function(id,x,y,name){
        var s = $('#'+id);
        uexWindow.setPopoverFrame(name?name:id,Int(x),Int(y),Int(s.width()),Int(s.height()));   
    };

    /*
    模拟器初始化字体大小。

    */
    var init = function(){
        if(window.navigator.platform == 'Win32')
            document.body.style.fontSize = window.localStorage.getItem('defaultfontsize');
    };
    /*
    停止事件的传播
    @param Object t 
    */
    var cc = function(t){
        if (!t.cancelClick) {
            t.cancelClick = true;
            t.addEventListener('click', function(){
                event.stopPropagation();
            }, true);
        }
    };
    //扩展到对象上去
    ac.select = select;
    ac.forInput = forInput;
    ac.fold = fold;
    ac.parse = parse;
    ac.Int = Int;
    ac.con = con;
    ac.resize = resize;
    ac.init = init;
    ac.cc = cc;

});
