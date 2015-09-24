/*

    author:dushaobin
    email:shaobin.du@3g2win.com
    description:构建appcan window模块
    create:2014.08.18
    update:______/___author___


*/
/*global window,appcan,uexWindow*/

window.appcan && appcan.define('window',function($,exports,module){
    
    var subscribeGlobslQueue = [];//订阅队列
    var bounceCallQueue = [];//
    var multiPopoverQueue = {};
    var currentOS = '';
    var keyFuncMapper = {};//映射
    
    /*
        捕获android实体键
        @param String id 实体键的id
        @param Function callback 当点击时出发的回调函数
    
    
    */
    function monitorKey(id,callback){
        keyFuncMapper[id] = callback;
        uexWindow.setReportKey(id);
        uexWindow.onKeyPressed = function(keyCode){
            keyFuncMapper[keyCode] && keyFuncMapper[keyCode](keyCode);    
        }
    }
    
    /*
    打开一个新窗口
    @param String name 新窗口的名字 如果该window已经存在则直接打开
    @param String dataType 数据类型：0：url 1：html 数据 2：html and url
    @param String data 载入的数据
    @param Int aniId 动画id：
        0：无动画
        1:从左向右推入
        2:从右向左推入
        3:从上向下推入
        4:从下向上推入
        5:淡入淡出
        6:左翻页
        7:右翻页
        8:水波纹
        9:由左向右切入
        10:由右向左切入
        11:由上先下切入
        12:由下向上切入

        13:由左向右切出
        14:由右向左切出
        15:由上向下切出
        16:由下向上切出
    @param int width 窗口宽度
    @param int height 窗口的高度
    @param int tpye 窗口的类型
        0:普通窗口
        1:OAuth 窗口
        2:加密页面窗口
        4:强制刷新
        8:url用系统浏览器打开
        16:view不透明
        32:隐藏的winwdow
        64:等待popOver加载完毕后显示
        128:支持手势
        256:标记opn的window上一个window不隐藏
        512:标记呗open的浮动窗口用友打开wabapp
    @param animDuration 动画时长


    */
    function open(name,data,aniId,type,dataType,width,height,animDuration,extraInfo){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            argObj = name;
            name = argObj['name'];
            dataType = argObj['dataType'] || 0;
            aniId = argObj['aniId'] || 0;
            width = argObj['width'];
            height = argObj['height'];
            type = argObj['type'] || 0;
            animDuration = argObj['animDuration'];
			extraInfo = argObj['extraInfo'];
            data = argObj['data'];
        }
        dataType = dataType || 0;
        aniId = aniId || 0;
        type = type || 0;
        animDuration = animDuration || 300;
		
		try{
			extraInfo = appcan.isString(extraInfo) ? extraInfo : JSON.stringify(extraInfo);
			extraInfo = JSON.parse(extraInfo);
			if(!extraInfo.extraInfo){
				extraInfo = {extraInfo:extraInfo};
			}
			extraInfo = JSON.stringify(extraInfo);
		}catch(e){
			extraInfo = extraInfo || '';
		}
		
        //打开新窗口
        uexWindow.open(name,dataType,data,aniId,width,height,type,animDuration,extraInfo);
    }

    /*
    关闭窗口
    @param String animateId 窗口关闭动画
    @param Int animDuration 动画持续时间

    */
    function close(animId,animDuration){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(animId)){
            argObj = animId;
            animId = argObj['animId'];
            animDuration = argObj['animDuration'];
        }
        if(animId){
            animId = parseInt(animId,10);
            if(isNaN(animId) || animId > 16 || animId < 0){
                animId = -1;
            }
        }
        if(animDuration){
            animDuration = parseInt(animDuration,10);
            animDuration = isNaN(animDuration)?'':animDuration;
        }
        animDuration = animDuration || 300;
        uexWindow.close(animId,animDuration);
    }

    /*
    在指定的窗口执行js脚本

    @param string name 窗口的名字
    @param string type 窗口类型
    @param string inscript 窗口内容

    */
    function evaluateScript(name,scriptContent,type){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            argObj = name;
            name = argObj['name'];
            type = argObj['type'] || 0;
            scriptContent = argObj['scriptContent'];
        }
        type = type || 0;
        uexWindow.evaluateScript(name,type,scriptContent);
    }
    /*
    在指定的浮动窗口中执行脚本
    @param String name 执行的窗口名字
    @param String popName 浮动窗口名
    @param String scriptContent 脚本内容

    */
    function evaluatePopoverScript(name,popName,scriptContent){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            argObj = name;
            name = argObj['name'];
            popName = argObj['popName'] || 0;
            scriptContent = argObj['scriptContent'];
        }
        name = name || '';
        if(!appcan.isString(popName) || !popName){
            return;           
        }
        uexWindow.evaluatePopoverScript(name,popName,scriptContent);
    }

    /*
    设置窗口的上拉，下拉效果
    @param String bounceType 弹动效果类型
        0:无任何效果
        1:颜色弹动效果
        2:设置图片弹动
    @param Function downEndCall 下拉到底的回调
    @param Function upEndCall 上拉到底的回调
    @param String color 设置下拉视图的颜色
    @param String imgSettings 设置显示内容
    
    todo:该方法需要重写，

    */

    function setBounce(bounceType,startPullCall,downEndCall,upEndCall,color,imgSettings){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(bounceType)){
            argObj = bounceType;
            bounceType = argObj['bounceType'] || 1;
            startPullCall = argObj['startPullCall'];
            downEndCall = argObj['downEndCall'];
            upEndCall = argObj['upEndCall'];
            color = argObj['color'] || 'rgba(255,255,255,0)';
            imgSettings = argObj['imgSettings'] || '{"imagePath":"res://reload.png",'+
            '"textColor":"#530606","pullToReloadText":"拖动刷新",'+
            '"releaseToReloadText":"释放刷新",'+
            '"loadingText":"加载中，请稍等"}';
        
        }
        color = color || 'rgba(255,255,255,0)';
        imgSettings = imgSettings || '{"imagePath":"res://reload.png",'+
        '"textColor":"#530606","pullToReloadText":"拖动刷新",'+
        '"releaseToReloadText":"释放刷新",'+
        '"loadingText":"加载中，请稍等"}';

        // if(!bounceType){
            // return;
        // }
        var startBounce = 1;
        //绑定回弹通知函数
        uexWindow.onBounceStateChange = function (type,status){
            if(status == 0){
                startPullCall && startPullCall(type);
            }
            if(status == 1) {
                downEndCall && downEndCall(type);
            }
            if(status == 2) {
                upEndCall && upEndCall(type);
            }
        };
        uexWindow.setBounce(startBounce);
        //设置颜色
        /*if(bounceType == 1){
            uexWindow.showBounceView('0',color,'1');
        }
        if(bounceType == 2){
            uexWindow.setBounceParams('0',imgSettings);
            uexWindow.showBounceView('0',color,1);
        }*/
        //绑定下拉回调
        if(startPullCall || downEndCall || upEndCall){
            if(!appcan.isArray(bounceType)){
                bounceType=[bounceType];
            }
            for(var i=0;i<bounceType.length;i++){
                uexWindow.notifyBounceEvent(bounceType[i],'1');

                setBounceParams(bounceType[i],imgSettings);
                uexWindow.showBounceView(bounceType[i],color,'1'); 
                
                
            }
            
        }
    }
	
	
	var bounceStateQueue =[];
            /*
        处理回调获取弹动状态
        @param string msg 传递过来的消息
    
    */
    function processGetBounceStateQueue(data,dataType,opId){
        if(bounceStateQueue.length > 0){
            $.each(bounceStateQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    if(dataType == 2){
                        v(data,dataType,opId);
                    }
                    
                }
            });
        }
        bounceStateQueue=[];
        return;
    }

    /*
        获取当前的弹动状态
        
        
    */
    function getBounceStatus(callback){
        if(arguments.length === 1 && appcan.isPlainObject(callback)){
            callback = callback['callback'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }
        bounceStateQueue.push(callback);
        uexWindow.cbBounceState = function(opId, dataType, data){
            processGetBounceStateQueue(data,dataType,opId);
        };

        uexWindow.getBounce();
    }
    
    /*
        开启上下滑动回弹
        
        
    */
    function enableBounce(){
        //1:开启回弹效果
        uexWindow.setBounce(1);
    }
    
    /*
        关闭回弹效果
    
    */
    function disableBounce(){
        //0:禁用回弹效果
        uexWindow.setBounce(0);
    }
    
    /*
        设置回弹类
        @param String type 设置回弹的类型 
        @param String color 设置回弹显示的颜色 
        @param Int flag 设置是否添加回弹回调 
        @param Function callback 回弹的回调函数 
        
    
    */
    function setBounceType(type,color,flag,callback){
        if(arguments.length ===1 && appcan.isPlainObject(type)){
            flag = type.flag;
            color = type.color;
            callback = type.callback;
            type = type.type;
        }
        flag = (flag === void 0 ? 1 : flag);
        flag = parseInt(flag,10);
        color = color || 'rgba(0,0,0,0)';
        type = (type === void 0 ? 0 : type);
        callback = callback || function(){};
        //强制开启页面弹动效果
        enableBounce();
        
        uexWindow.showBounceView(type,color,flag);
        if(flag){
            bounceCallQueue.push({type:type,callback:callback});
            uexWindow.onBounceStateChange || (uexWindow.onBounceStateChange = function(backType,status){
                var currCallObj = null;
                for(var i=0,len=bounceCallQueue.length;i<len;i++){
                    currCallObj = bounceCallQueue[i];
                    if(currCallObj){
                        if(backType === currCallObj.type){
                            if(appcan.isFunction(currCallObj.callback)){
                                currCallObj.callback(status,type);
                            }
                        }
                    }
                }
            });
            //1:接收回调函数
            uexWindow.notifyBounceEvent(type,1);
        }
    }
    
    /*
        给上下回弹添加参数
        @param String position 设置回弹的类型
        @param Object data 要设置回弹显示出来内容的json参数
        {
            imagePath:'回弹显示的图片路径',
            textColor:'设置回弹内容的字体颜色',
            levelText:'设置文字的级别',
            pullToReloadText:'下拉超过边界显示出的内容',
            releaseToReloadText:'拖动超过刷新边界后显示的内容',
            loadingText:'拖动超过刷新临界线并且释放，并且拖动'
        }
    
    */
    function setBounceParams(position,data){
        if(arguments.length ===1 && appcan.isPlainObject(position)){
            data = position.data;
            position = position.position;
        }
        if(appcan.isPlainObject(data)){
            data = JSON.stringify(data);
        }
        uexWindow.setBounceParams(position,data);
    }
    

    /*
    展示弹动结束后显示的网页
    @param String position 0为顶端恢复弹动，1为底部恢复弹动

    */

    function resetBounceView(position){
        if(appcan.isPlainObject(position)){
            position = position['position'];
        }
        position = parseInt(position,10);
        if(isNaN(position)){
            position = 0;
        }else{
            position = position;
        }
        position = position || 0;
        uexWindow.resetBounceView(position);
    }

    /*
    弹出一个非模态的提示框
    @param String type 消息提示框显示的模式
        0:没有进度条
        1:有进度条
    @param String position 提示在手机上的位置
        1:left_top
        2:top
        3:right_top
        4:left
        5:middle
        6:right
        7:bottom_left
        8:bottom
        9:right_bottom
    @param String msg 提示内容
    @param String duration 提示框存在时间，小于0不会自动关闭


    */
    

    function openToast(msg,duration,position,type){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(msg)){
            argObj = msg;
            msg = argObj['msg'];
            duration = argObj['duration'];
            position = argObj['position'] || 5;
            type = argObj['type'];
        }
        type = type || (duration?0:1);
        duration = duration || 0;
        position = position || 5;
        //执行跳转
        uexWindow.toast(type,position,msg,duration);
    }

    /*
    关闭提示框

    */
    function closeToast(){
        uexWindow.closeToast();
    }

    /*
    移动浮动窗口位置动画
    @param String left 距离左边界的位置
    @param String top 距离上边界的位置
    @param Function callback 动画完成的回调函数
    @param Int duration 动画的移动时间

    */

    function moveAnim(left,top,callback,duration){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(left)){
            argObj = left;
            left = argObj['left'] || 0;
            top = argObj['top'] || 0;
            callback = argObj['callback'];
            duration = argObj['duration'] || 250;
        }
        left = left || 0;
        top = top || 0;
        duration = duration || 250;
        uexWindow.beginAnimition();
        uexWindow.setAnimitionDuration(duration);
        uexWindow.setAnimitionRepeatCount('0');
        uexWindow.setAnimitionAutoReverse('0');
        uexWindow.makeTranslation(left,top,'0');
        uexWindow.commitAnimition();
        if(appcan.isFunction(callback)) {
            uexWindow.onAnimationFinish = callback;
        }
    }
    
    /*
        
    
    */
        
    function setWindowFrame(dx,dy,duration,callback){
        if(arguments.length === 1 && appcan.isPlainObject(dx)){
            argObj = dx;
            dx = argObj['dx'] || 0;
            dy = argObj['dy'] || 0;
            duration = argObj['duration'] || 250;
            callback = argObj['callback'] || function(){};
        }
        uexWindow.onSetWindowFrameFinish = callback;
        uexWindow.setWindowFrame(dx,dy,duration);
    }
    
    
    /*
    依指定的样式弹出一个提示框
    @param String selector css选择器
    @param String url 加载的数据内容
    @param String left 居左距离
    @param String top 居上距离
    @param String name 弹窗名称

    */

    function popoverElement(id,url,left,top,name,extraInfo){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(id)){
            argObj = id;
            id = argObj['id'] || 0;
            url = argObj['url'];
            top = argObj['top'];
            left = argObj['left'];
			extraInfo = argObj['extraInfo'];
            name = argObj['name'];
        }
        top = top || 0;
        left = left || 0;
        var ele = $('#'+id);
        var width = ele.width();
        var height = ele.height();
        var fontSize = ele.css('font-size');
        top = parseInt(top,10);
        top = isNaN(top)?ele.offset().top:top;//默认使用元素本身的top
        left = parseInt(left,10);
        left = isNaN(left)?ele.offset().left:left;//默认使用元素本身的left
        name = name?name:id;
        
		extraInfo = extraInfo || '';
		
        //fixed xiaomi 2s bug
        fontSize = parseInt(fontSize,10);
        fontSize = isNaN(fontSize)? 0 : fontSize;
        
        openPopover(name,0,url,'',left,top,width,height,fontSize,0,0,extraInfo);
    }

    /*
    打开一个浮动窗口
    @param String name 浮动窗口名
    @param String dataType 数据类型0:url 1:html 2:url html
    @param String url  url地址
    @param String data 数据
    @param Int left 居左距离
    @param Int top 居上距离
    @param Int width 宽
    @param Int height 高
    @param Int fontSize 默认字体
    @param Int tpye 窗口的类型
        0:普通窗口
        1:OAuth 窗口
        2:加密页面窗口
        4:强制刷新
        8:url用系统浏览器打开
        16:view不透明
        32:隐藏的winwdow
        64:等待popOver加载完毕后显示
        128:支持手势
        256:标记opn的window上一个window不隐藏
        512:标记呗open的浮动窗口用友打开wabapp
    
    @param Int bottomMargin 浮动窗口相对父窗口底部的距离。为空或0时，默认为0。当值不等于0时，inHeight参数无效


    */
    function openPopover(name,dataType,url,data,left,top,width,height,fontSize,type,bottomMargin,extraInfo){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            argObj = name;
            name = argObj['name'];
            dataType = argObj['dataType'];
            url = argObj['url'];
            data = argObj['data'];
            left = argObj['left'];
            top = argObj['top'];
            width = argObj['width'];
            height = argObj['height'];
            fontSize = argObj['fontSize'];
            type = argObj['type'];
            bottomMargin = argObj['bottomMargin'];
			extraInfo = argObj['extraInfo'];
        }
        dataType = dataType || 0;
        left = left || 0;
        top = top || 0;
        height = height || 0;
        width = width || 0;
        type = type || 0;
        bottomMargin = bottomMargin || 0;
        fontSize = fontSize || 0;
        data = data || '';
        //fixed xiaomi 2s bug
        fontSize = parseInt(fontSize,10);
        fontSize = isNaN(fontSize)?0:fontSize;
		
		try{
			extraInfo = appcan.isString(extraInfo) ? extraInfo : JSON.stringify(extraInfo);
			extraInfo = JSON.parse(extraInfo);
			if(!extraInfo.extraInfo){
				extraInfo = {extraInfo:extraInfo};
			}
			extraInfo = JSON.stringify(extraInfo);
		}catch(e){
			extraInfo = extraInfo || '';
		}
		
        //fixed ios bug
        if(uexWidgetOne.platformName && uexWidgetOne.platformName.toLowerCase().indexOf('ios') > -1){
            var args = ['"'+name+'"',dataType,'"'+url+'"','"'+data+'"',left,top,width,height,fontSize,type,bottomMargin,"'"+extraInfo+"'"];
            var scriptContent = 'uexWindow.openPopover(' + args.join(',') +')';
            evaluateScript('',scriptContent);
            return;
        }
        uexWindow.openPopover(name,dataType,url,data,left,top,width,height,fontSize,type,bottomMargin,extraInfo);
    }

    /*
    关闭浮动按钮
    @param String name 浮动窗口的名字

    */

    function closePopover(name){
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            name = name['name'];
        }
        uexWindow.closePopover(name);
    }
    

    /*
    根据制定元素重置提示框的位置大小
    @param String id 元素id
    @param String left 距左边距离
    @param String top 距上边的距离
    @param String name 名称，默认为id
    */

    function resizePopoverByEle(id,left,top,name){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(id)){
            argObj = id;
            id = argObj['id'];
            left = argObj['left'];
            top = argObj['top'];
            name = argObj['name'];
        }
        left = left || 0;
        top = top || 0;
        var ele = $('#'+id);
        var width = ele.width();
        var height = ele.height();
        left = parseInt(left,10);
        left = isNaN(left)?0:left;
        top = parseInt(top,10);
        top = isNaN(top)?0:top;
        name = name?name:id;
        uexWindow.setPopoverFrame(name,left,top,width,height);
    }

    /*
    重置提示框的位置大小
    @param String name popover名
    @param String left 距左边距离
    @param String top 距上边的距离
    @param String width 窗口的宽
    @param String height 窗口的高


    */

    function resizePopover(name,left,top,width,height){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            argObj = name;
            name = argObj['name'];
            left = argObj['left'];
            top = argObj['top'];
            width = argObj['width'];
            height = argObj['height'];
        }
        left = left || 0;
        top = top || 0;
        width = width || 0;
        height = height || 0;

        left = parseInt(left,10);
        left = isNaN(left)?0:left;

        top = parseInt(top,10);
        top = isNaN(top)?0:top;

        width = parseInt(width,10);
        width = isNaN(width)?0:width;

        height = parseInt(height,10);
        height = isNaN(height)?0:height;

        uexWindow.setPopoverFrame(name,left,top,width,height);
    }


    /*
    弹出一个确认框
    @param String title 对话框的标题
    @param String content 对话框的内容
    @param Array buttons 按钮文字


    */
    function windowConfirm(title,content,buttons,callback){
        if(arguments.length === 1 && appcan.isPlainObject(title)){
            callback = title['callback'];
            buttons = title['buttons'];
            content = title['content'];
            title = title['title'];
        }
        title = title || '提示';
        buttons = buttons || ['确定'];
        buttons = appcan.isArray(buttons)?buttons:[buttons];
        popConfirm(title,content,buttons,callback);
    }
    
    /*
    弹出一个警告框
    @param String title 对话框的标题
    @param String content 对话框的内容
    @param Array buttons 按钮文字


    */
    function popAlert(title,content,buttons){
        if(arguments.length === 1 && appcan.isPlainObject(title)){
            buttons = title['buttons'];
            content = title['content'];
            title = title['title'];
        }
        buttons = appcan.isArray(buttons)?buttons:[buttons];
        uexWindow.alert(title,content,buttons[0]);
    }
    
    /*
        弹出一个提示框
        @param String title 对话框的标题
        @param String content 对话框的内容
        @param Array buttons 按钮文字
        
        
        
    */
    function popConfirm(title,content,buttons,callback){
        if(arguments.length === 1 && appcan.isPlainObject(title)){
            callback = title['callback'];
            buttons = title['buttons'];
            content = title['content'];
            title = title['title'];
        }
        buttons = appcan.isArray(buttons)?buttons:[buttons];
        if(appcan.isFunction(callback)){
            uexWindow.cbConfirm = function(optId,dataType,data){
                if(dataType != 2){
                    return callback(new Error('confirm error'));
                }
                callback(null,data,dataType,optId);
            };
        }
        
        uexWindow.confirm(title,content,buttons);
    }
    
    /*
        弹出一个可提示用户输入的对话框
        @param String title 对话框的标题
        @param String content 对话框显示的内容
        @param String defaultValue 输入框默认文字
        @param Array  buttons 显示在按钮上的文字集合
        @param Function callback  对话框关闭的回调 
        
        
    */
    function popPrompt(title, content, defaultValue, buttons,callback){
        if(arguments.length === 1 && appcan.isPlainObject(title)){
            callback = title['callback'];
            buttons = title['buttons'];
            content = title['content'];
            defaultValue = title['defaultValue'];
            title = title['title'];
        }
        buttons = appcan.isArray(buttons)?buttons:[buttons];
        if(appcan.isFunction(callback)){
            uexWindow.cbPrompt = function(optId,dataType,data){
                try{
                    var data=JSON.parse(data);
                    callback(null,data,dataType,optId);
                }
                catch(e){
                    callback(e);
                }
            };
        }
        
        uexWindow.prompt(title,content,defaultValue,buttons);
    }
    
    /*
    把指定的浮动窗口排在所有浮动窗口最上面
    @param String name 浮动窗口的名字

    */

    function bringPopoverToFront(name){
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            name = name['name'];
        }
        uexWindow.bringPopoverToFront(name);
    }
    
    /*
    把指定的浮动窗口排在所有浮动窗口最下面
    @param String name 浮动窗口的名字

    */
    
    function sendPopoverToBack(name){
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            name = name['name'];
        }
        uexWindow.sendPopoverToBack(name);
    }
    
    /*
        订阅一个频道消息,当有消息发布的时候该该回调将会调用该回调
        @param Int channelId 频道id
        @param Function callback回调函数
        
    */
    function subscribe(channelId,callback){
        if(arguments.length === 1 && appcan.isPlainObject(channelId)){
            callback = channelId['callback'];
            channelId = channelId['channelId'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }
        var funName = 'notify_callback_' + appcan.getUID();
        uexWindow[funName] = callback;
        uexWindow.subscribeChannelNotification(channelId,funName);
    }
    
    /*
        发布一个消息
        @param Int channelId :频道id
        @param String msg : 要发布的消息
    
    */
    function publish(channelId,msg){
        if(arguments.length === 1 && appcan.isPlainObject(channelId)){
            msg = channelId['msg'];
            channelId = channelId['channelId'];
        }
        if(appcan.isPlainObject(msg)){
            msg = JSON.stringify(msg);
        }
        uexWindow.publishChannelNotification(channelId,msg);
    }
    
    /*
        向全局的公共频道发送消息
        @param String msg 向全局频道发送消息
    
    */
    
    function publishGlobal(msg){
        if(arguments.length === 1 && appcan.isPlainObject(msg)){
            msg = msg['msg'];
        }
        uexWindow.postGlobalNotification(msg);
    }
    
    /*
        处理全局回调订阅消息
        @param string msg 传递过来的消息
    
    */
    function processSubscribeGolbalQueue(msg){
        if(subscribeGlobslQueue.length > 0){
            $.each(subscribeGlobslQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    v(msg);
                }
            });
        }
        return
    }
    
    /*
        订阅全局的频道
        @param Function callback 订阅的回调
    
    */
    function subscribeGlobal(callback){
        if(arguments.length === 1 && appcan.isPlainObject(callback)){
            callback = callback['callback'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }
        subscribeGlobslQueue.push(callback);
        uexWindow.onGlobalNotification = function(msg){
            processSubscribeGolbalQueue(msg);
        };
    }
    
    /*
        移除全局订阅事件
        @param Function callback：要移除的回调的引用
    
    */
    function removeGlobalSubscribe(callback){
        if(arguments.length === 1 && appcan.isPlainObject(callback)){
            callback = callback['callback'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }
        for(var i=0,len=subscribeGlobslQueue.length;i<len;i++){
            if(subscribeGlobslQueue[i] === callback){
                subscribeGlobslQueue.splice(i,1);
                return;
            }
        }
    }
    
    /*
        处理多窗口滑动回调事件
        
    */
    function processMultiPopover(err,res){
        if(err){
            //todo call error
        }else{
            if(appcan.isString(res)){
                res = JSON.parse(res);
            }
            if(!res.multiPopName){
                return;
            }
            var multiCalls = multiPopoverQueue[res.multiPopName];
            $.each(multiCalls,function(i,fun){
                if(appcan.isFunction(fun)){
                    fun(null,res);
                }
            });
        }
    }
    
    /*
        弹出多页面浮动窗口
        @param String popName:弹出窗口的名称 
        @param String content:传入的数据 
        @param String dataType:传入数据的类型 0：url方式载入；1：html内容 方式载入；2：既有url方式，又有html内容方式 
        @param Int left:距离左边的距离 
        @param Int top:距离上边界的距离 
        @param Int width:弹出窗口的宽
        @param Int height:弹出窗口的高 
        @param Int fontSize:字体大小 
        @param Int flag:弹出类型的标识
        @param Int indexSelected:默认选中的窗口 
        
    
    */
    function openMultiPopover(popName,content,dataType, left, top, width, height,change, fontSize, flag, indexSelected,extraInfo){
        if(arguments.length === 1 && appcan.isPlainObject(popName)){
            indexSelected = popName['indexSelected'];
            flag = popName['flag'];
            fontSize = popName['fontSize'];
            change = popName['change'];
            height = popName['height'];
            width = popName['width'];
            top = popName['top'];
            left = popName['left'];
            dataType = popName['dataType'];
            content = popName['content'];
			extraInfo = popName['extraInfo']
            popName = popName['popName'];
        }
        dataType = dataType || 0;
        flag = flag || 0;
        indexSelected = parseInt(indexSelected,10);
        indexSelected = isNaN(indexSelected)? 0 : indexSelected;
        width = width || 0;
        height = height || 0;
        change = change || function(){};
		
		try{
			extraInfo = appcan.isString(extraInfo) ? extraInfo : JSON.stringify(extraInfo);
			extraInfo = JSON.parse(extraInfo);
			if(!extraInfo.extraInfo){
				extraInfo = {extraInfo:extraInfo};
			}
			extraInfo = JSON.stringify(extraInfo);
		}catch(e){
			extraInfo = extraInfo || '';
		}
        
        //fixed android 如果少任何一个key就会crash bug
        if(!appcan.isString(content)){
            if(!content.content){
                content={
                    content:content
                };
            }
        }else{
            content = JSON.parse(content);
            if(!content.content){
                content={
                    content:content
                };
            }
        }
        //check all key
        var mustKey = ['inPageName','inUrl','inData'];
        var realContent = content.content;
        $.each(realContent,function(i,v){
            $.each(mustKey,function(i1,v1){
                if(!(v1 in v)){
                    v[v1] = '';
                }
            });
        });
        //content
        content = JSON.stringify(content);
        if(multiPopoverQueue[popName]){
            multiPopoverQueue[popName].push(change);
        }else{
            multiPopoverQueue[popName] = [change];
        }
        uexWindow.openMultiPopover(content,popName,dataType, left, top, width, height, fontSize, flag, indexSelected,extraInfo);
        uexWindow.cbOpenMultiPopover = function(optId,dataType,res){
            if(optId == 0){
                if(dataType != 1){
                    processMultiPopover(new Error('multi popover error'));
                }else{
                    processMultiPopover(null,res);
                }
            }
        };
        //fixed ios indexed bug
        setSelectedPopOverInMultiWindow(popName, indexSelected);
    }
    
    /*
        关闭多页面浮动窗口
        @param String popName:多页面弹出窗口
        
    
    */
    function closeMultiPopover(popName){
        if(arguments.length === 1 && appcan.isPlainObject(popName)){
            popName = popName['popName'];
        }
        if(!popName){
            return;
        }
        
        uexWindow.closeMultiPopover(popName)
        
    }
    
    /*
        设置多页面浮动窗口跳转到的子页面窗口的索引
        @param String popName:多窗口弹出框的名称
        @param String index:页面的索引 
        
        
    */
    function setSelectedPopOverInMultiWindow(popName,index){
        if(arguments.length === 1 && appcan.isPlainObject(popName)){
            index = popName['index'];
            popName = popName['popName'];
        }
        if(!popName){
            return;
        }
        index = parseInt(index,10);
        index = isNaN(index)? 0 : index;
        //fixed 模拟器不支持MultiPopOver bug
        uexWindow.setSelectedPopOverInMultiWindow && uexWindow.setSelectedPopOverInMultiWindow(popName,index);
        
    }
    
    
    
    var windowStatusCallList = [];
    
    /*
        
        处理窗口回调事件
        @param Function state:当前的状态
        
        
    */
    function processWindowStateChange(state){
        $.each(windowStatusCallList,function(i,v){
            if(appcan.isFunction(v)){
                v(state);
            }
        })
    }
    
    
    /*
        当前窗口的状态改变
        @param Function callback:窗口事件改变后的回调函数
        
    
    */
    function onStateChange(callback){
        if(!appcan.isFunction(callback)){
            return;
        }
        //兼容老用法
        
        windowStatusCallList.push(callback);
        
        uexWindow.onStateChange = processWindowStateChange;
    }
    
    /*
        默认状态改变事件
        
    
    */
    
    function defaultStatusChange(state){
        var tmpResumeCall = null;
        var tmpPauseCall = null;
        if(appcan.window.onResume){
            tmpResumeCall = appcan.window.onResume;
        }
        if(appcan.window.onPause){
            tmpPauseCall = appcan.window.onPause;
        }
        
        if(state === 0){
            appcanWindow.emit('resume');
            tmpResumeCall && tmpResumeCall();
        }
        
        if(state === 1){
            appcanWindow.emit('pause');
            tmpPauseCall && tmpPauseCall();
        }
        
    }
    
    
    /*
    
        swipe回调列表
        
        
    */
    var swipeCallbackList = {
        left:[],
        right:[] 
    };
    
    function processSwipeLeft(){
        
        $.each(swipeCallbackList.left,function(i,v){
            if(appcan.isFunction(v)){
                v();
            }
        })
        
    }
    
    function processSwipeRight(){
        
        $.each(swipeCallbackList.right,function(i,v){
            if(appcan.isFunction(v)){
                v();
            }
        })
    }
    
    /*
        当页面滑动的时候，执行的回调方法
        
    
    */
    function onSwipe(direction,callback){
        
        if(direction === 'left'){
            swipeCallbackList[direction].push(callback);
            
            uexWindow.onSwipeLeft = processSwipeLeft;
            return;
        }
        if(direction === 'right'){
            swipeCallbackList[direction].push(callback);
            
            uexWindow.onSwipeRight = processSwipeRight;
            return;
        }
    }
    
    function onSwipeLeft(callback){
        if(!appcan.isFunction(callback)){
            return;
        }
        onSwipe('left',callback);
    }
    
    function onSwipeRight(callback){
        if(!appcan.isFunction(callback)){
            return;
        }
        onSwipe('right',callback);
    }
    
    /*
        
        兼容原始appcan.frame.onSwipeLeft 和 appcan.window.onSwipeLeft 方法
        
    
    */
    function defaultSwipeLeft(){
        var tmpSwipeLeftCall = null;
        var tmpFrameSLCall = null;
        
        if(appcan.window.onSwipeLeft){
            tmpSwipeLeftCall = appcan.window.onSwipeLeft;
        }
        
        if(appcan.frame.onSwipeLeft){
            tmpFrameSLCall = appcan.frame.onSwipeLeft;
        }
        
        appcanWindow.emit('swipeLeft');
        appcan.frame && appcan.frame.emit && appcan.frame.emit('swipeLeft');
        tmpSwipeLeftCall && tmpSwipeLeftCall();
        tmpFrameSLCall && tmpFrameSLCall();
        
    }
    
    
     /*
        
        兼容原始appcan.frame.onSwipeRight 和 appcan.window.onSwipeRight 方法
        
    
    */
    function defaultSwipeRight(){
        var tmpSwipeRightCall = null;
        var tmpFrameSRCall = null;
        
        if(appcan.window.onSwipeRight){
            tmpSwipeRightCall = appcan.window.onSwipeRight;
        }
        
        if(appcan.frame.onSwipeRight){
            tmpFrameSRCall = appcan.frame.onSwipeRight;
        }
        
        appcanWindow.emit('swipeRight');
        appcan.frame && appcan.frame.emit && appcan.frame.emit('swipeRight');
        tmpSwipeRightCall && tmpSwipeRightCall();
        tmpFrameSRCall && tmpFrameSRCall();
    }
    /*
        
        控制父组件是否拦截子组件的事件 
        @param Int enable 设置父组件是否拦截子组件的事件,参数不为1时设置默认拦截；0:可以拦截，子组件不可以正常响应事件 ；1:不拦截，子组件可以正常响应事件 
    */
    function setMultilPopoverFlippingEnbaled(enable){
        var enable = parseInt(enable,10);
        enable = isNaN(enable)?0:enable;
        enable = enable!=1?0:enable;
        uexWindow.setMultilPopoverFlippingEnbaled(enable);
    }
    
    
    //默认绑定状态
    appcan.ready(function(){
        //绑定默认状态改变事件
        onStateChange(defaultStatusChange);
        //绑定默认swipe事件
        onSwipeLeft(defaultSwipeLeft);
        //绑定默认swipe事件
        onSwipeRight(defaultSwipeRight);
    });
    
    //导出接口
    var appcanWindow = module.exports = {
        open:open,
        close:close,
        evaluateScript:evaluateScript,
        evaluatePopoverScript:evaluatePopoverScript,
        setBounce:setBounce,
        setBounceParams:setBounceParams,
        enableBounce:enableBounce,
        disableBounce:disableBounce,
        setBounceType:setBounceType,
        resetBounceView:resetBounceView,
        openToast:openToast,
        closeToast:closeToast,
        moveAnim:moveAnim,
        popoverElement:popoverElement,
        openPopover:openPopover,
        closePopover:closePopover,
        resizePopover:resizePopover,
        resizePopoverByEle:resizePopoverByEle,
        alert:windowConfirm,
        //popAlert:popAlert, 隐藏该接口，因为confirm
        confirm:popConfirm,
        prompt:popPrompt,
        bringPopoverToFront:bringPopoverToFront,
        sendPopoverToBack:sendPopoverToBack,
        publish:publish,
        subscribe:subscribe,
        //publishGlobal:publishGlobal,
        //subscribeGlobal:subscribeGlobal,
        selectMultiPopover:setSelectedPopOverInMultiWindow,
        openMultiPopover:openMultiPopover,
        closeMultiPopover:closeMultiPopover,
        setWindowFrame:setWindowFrame,
        monitorKey:monitorKey,
        stateChange:onStateChange,
        swipeLeft:onSwipeLeft,
        swipeRight:onSwipeRight,
		getBounceStatus:getBounceStatus,
        setMultilPopoverFlippingEnbaled:setMultilPopoverFlippingEnbaled
        
    };
    
    appcan.extend(appcanWindow,appcan.eventEmitter);

});

/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:构建appcan window模块
    create:2014.08.18
    update:______/___author___

*/
window.appcan && appcan.define('frame',function($,exports,module){
    var appWin = appcan.require('window');
    
    var appcanFrame = module.exports = {
        //open:appWin.openPopover,
        close:appWin.closePopover,
        //resize:appWin.resizePopover,
        bringToFront:appWin.bringPopoverToFront,
        sendToBack:appWin.sendPopoverToBack,
        evaluateScript:appWin.evaluatePopoverScript,
        publish:appWin.publish,
        subscribe:appWin.subscribe,
        //publishGlobal:appWin.publishGlobal,
        //subscribeGlobal:appWin.subscribeGlobal,
        selectMulti:appWin.selectMultiPopover,
        openMulti:appWin.openMultiPopover,
        closeMulti:appWin.closeMultiPopover,
        setBounce:appWin.setBounce,
		getBounceStatus:appWin.getBounceStatus,
        resetBounce:appWin.resetBounceView,
        open:function(id,url,left,top,name,index,change,extraInfo){
            var argObj = null;
            if(arguments.length === 1 && appcan.isPlainObject(id)){
                argObj = id;
                id = argObj['id'] || 0;
                url = argObj['url'];
                top = argObj['top'];
                left = argObj['left'];
                name = argObj['name'];
                index = argObj['index'];
                change = argObj['change'];
            }
            if(appcan.isArray(url)){
                var ele = $('#'+id);
                var width = ele.width();
                var height = ele.height();
                var fontSize = ele.css('font-size');
                top = parseInt(top,10);
                top = isNaN(top)?ele.offset().top:top;//默认使用元素本身的top
                left = parseInt(left,10);
                left = isNaN(left)?ele.offset().left:left;//默认使用元素本身的left
                name = name?name:id;
                //fixed xiaomi 2s bug
                fontSize = parseInt(fontSize,10);
                fontSize = isNaN(fontSize)? 0 : fontSize;
                appWin.openMultiPopover(name || id,
                    url,0,left,top,width,height,change||function(){},fontSize,0,index,extraInfo);
            }
            else{
                appWin.popoverElement(id,url,left,top,name,extraInfo);
            }
        },
        resize:appWin.resizePopoverByEle,
        swipeLeft:appWin.swipeLeft,
        swipeRight:appWin.swipeRight
    };
    
    appcan.extend(appcanFrame,appcan.eventEmitter);
    
    
});