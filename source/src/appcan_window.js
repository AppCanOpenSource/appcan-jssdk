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
        @param Number id 要拦截的键值,0-返回键，1-菜单键
        @param Number enable 是否拦截,0-不拦截，1-拦截  
        @param Function callback 当点击时触发的回调函数
    
    
    */
    function monitorKey(id,enable,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(id)){
            argObj = id;
            id = argObj['id'];
            enable = argObj['enable'] ;
            callback = argObj['callback'] || function(){};
        }
        keyFuncMapper[id] = callback;
<<<<<<< HEAD
        uexWindow.setReportKey(id,enable);
=======
        uexWindow.setReportKey(id, 1);
>>>>>>> master
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
    浮动窗口透明度动画
    @param Number alpha 相对于当前alpha的值，0.0到1.0的float型数据
    @param Function callback 动画完成的回调函数
    @param Number duration 动画的时间
    */

    function alphaAnim(alpha,callback,duration){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(alpha)){
            argObj = alpha;
            alpha = argObj['alpha'] || 0.5;
            callback = argObj['callback'];
            duration = argObj['duration'] || 250;
        }
        alpha = argObj['alpha'] || 0.5;
        duration = duration || 250;
        uexWindow.beginAnimition();

        uexWindow.setAnimitionDuration(duration);
        uexWindow.setAnimitionRepeatCount('0');
        uexWindow.setAnimitionAutoReverse('0');
        
        uexWindow.makeAlpha(alpha);
        
        uexWindow.commitAnimition();
        if(appcan.isFunction(callback)) {
            uexWindow.onAnimationFinish = callback;
        }
    }
    
    /*
    浮动窗口伸缩动画
    @param Number x 相对于当前大小的x轴方向上的放大倍率，大于0的float型数据
    @param Number y 相对于当前大小的y轴方向上的放大倍率，大于0的float型数据
    @param Number z 相对于当前大小的z轴方向上的放大倍率，大于0的float型数据
    @param Number duration 动画的移动时间
    @param Function callback 动画完成的回调函数
    */

    function scaleAnim(x,y,z,callback,duration){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(x)){
            argObj = x;
            x = argObj['x'] || 1;
            y = argObj['y'] || 1;
            z = argObj['z'] || 1;
            duration = argObj['duration'] || 250;
            callback = argObj['callback'];
        }
        
        x = x || 1;
        y = y || 1;
        z = z || 1;
        duration = duration || 250;
        uexWindow.beginAnimition();

        uexWindow.setAnimitionDuration(duration);
        uexWindow.setAnimitionRepeatCount('0');
        uexWindow.setAnimitionAutoReverse('0');
        uexWindow.makeScale(x,y,z);
        uexWindow.commitAnimition();
        if(appcan.isFunction(callback)) {
            uexWindow.onAnimationFinish = callback;
        }
    }
    
    /*
                    浮动窗口旋转动画
    @param Number degrees 相对于当前角度的旋转度数
    @param Number x 是否绕X轴旋转。0为false，1为true
    @param Number y 是否绕X轴旋转。0为false，1为true
    @param Number z 是否绕X轴旋转。0为false，1为true
    @param Number duration 动画的移动时间
    @param Function callback 动画完成的回调函数
    */

    function rotateAnim(degrees,x,y,z,callback,duration){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(degrees)){
            argObj = degrees;
            degrees = argObj['degrees'];
            x = argObj['x'] || 0 ;
            y = argObj['y'] || 0  ;
            z = argObj['z'] || 0  ;
            duration = argObj['duration'] || 250;
            callback = argObj['callback'];
        }
        
        x = argObj['x'] || 0;
        y = argObj['y'] || 0;
        z = argObj['z'] || 0;
        duration = duration || 250;
        uexWindow.beginAnimition();
        uexWindow.setAnimitionDuration(duration);
        uexWindow.setAnimitionRepeatCount('0');
        uexWindow.setAnimitionAutoReverse('0');
        uexWindow.makeRotate(degrees, x, y, z);
        uexWindow.commitAnimition();
        if(appcan.isFunction(callback)) {
            uexWindow.onAnimationFinish = callback;
        }
    }
    
    /*
    浮动窗口自定义动画
    @param Number left 距离左边界的位置
    @param Number top 距离上边界的位置
    @param Number scaleX 相对于当前大小的x轴方向上的放大倍率，大于0的float型数据
    @param Number scaleY 相对于当前大小的y轴方向上的放大倍率，大于0的float型数据
    @param Number scaleZ 相对于当前大小的z轴方向上的放大倍率，大于0的float型数据
    @param Number degrees 相对于当前角度的旋转度数
    @param Number rotateX 是否绕X轴旋转。0为false，1为true
    @param Number rotateY 是否绕y轴旋转。0为false，1为true
    @param Number rotateZ 是否绕z轴旋转。0为false，1为true
    @param Number alpha 相对于当前alpha的值，0.0到1.0的float型数据
    @param Number delay 延迟执行的时间(单位：毫秒)，默认为0
    @param Number curve 动画曲线类型，默认为0，详见CONSTANT中Window AnimCurveType
    @param Number repeatCount 动画重复次数，默认为0
    @param Number isReverse 设置动画结束后自动恢复位置和状态：0-不恢复；1-恢复。默认为0
    @param Function callback 动画完成的回调函数
    @param Int duration 动画的移动时间

    */
 
    function customAnim(left,top,scaleX,scaleY,scaleZ,degrees,rotateX,rotateY,rotateZ,alpha,delay,curve,repeatCount,isReverse,callback,duration){
        
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(left)){
            argObj = left;
            
            left = argObj['left'] || 0;
            top = argObj['top'] || 0;
            
            scaleX = argObj['scaleX'] || 1;
            scaleY = argObj['scaleY'] || 1;
            scaleZ = argObj['scaleZ'] || 1;
            
            degrees = argObj['degrees'] || 0;
            rotateX = argObj['rotateX'] || 0;
            rotateY = argObj['rotateY'] || 0;
            rotateZ = argObj['rotateZ'] || 0;
            
            alpha = argObj['alpha'] || 0;
            
            delay = argObj['delay'] || 0;
            curve = argObj['curve'] || 0;
            repeatCount = argObj['repeatCount'] || 0;
            isReverse = argObj['isReverse'] || 0;
            
            callback = argObj['callback'];
            duration = argObj['duration'] || 250;
        }
        
        left = argObj['left'] || 0;
        top = argObj['top'] || 0;
        
        scaleX = argObj['scaleX'] || 1;
        scaleY = argObj['scaleY'] || 1;
        scaleZ = argObj['scaleZ'] || 1;
        
        degrees = argObj['degrees'] || 0;
        rotateX = argObj['rotateX'] || 0;
        rotateY = argObj['rotateY'] || 0;
        rotateZ = argObj['rotateZ'] || 0;
        
        alpha = argObj['alpha'] || 0;
        
        delay = argObj['delay'] || 0;
        curve = argObj['curve'] || 0;
        repeatCount = argObj['repeatCount'] || 0;
        isReverse = argObj['isReverse'] || 0;
        
        duration = duration || 250;
        
        uexWindow.beginAnimition();
        
        if(delay){
            uexWindow.setAnimitionDelay(delay);
        }
        uexWindow.setAnimitionDuration(duration);
        uexWindow.setAnimitionCurve(curve);
        uexWindow.setAnimitionRepeatCount(repeatCount);
        uexWindow.setAnimitionAutoReverse(isReverse);
        
        if(Math.abs(left) + Math.abs(top)){
            uexWindow.makeTranslation(left,top,'0');
        }
        if(!(scaleX== 1 && scaleY == 1 && scaleZ == 1)){
            uexWindow.makeScale(scaleX,scaleY,scaleZ);
        }
        if(degrees && Math.abs(degrees)>0 && (parseInt(rotateX) + parseInt(rotateY) + parseInt(rotateZ) >0)){
            uexWindow.makeRotate(degrees,rotateX,rotateY,rotateZ);
        }
        if(alpha){
            uexWindow.makeAlpha(alpha);
        }
        
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
    
    var popConfirmCallQueue =[];
    function processpopConfirmCallQueue(data,dataType,opId){
        if(popConfirmCallQueue.length > 0){
            $.each(popConfirmCallQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    if(dataType != 2){
                        return v(new Error('confirm error'));
                    }
                    v(null,data,dataType,opId);
                }
            });
        }
        popConfirmCallQueue=[];
        return;
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
            popConfirmCallQueue.push(callback);
            uexWindow.cbConfirm = function(optId,dataType,data){
                processpopConfirmCallQueue(data,dataType,optId);
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
        if(!name){
            uexWindow.bringToFront();
        }else{
            uexWindow.bringPopoverToFront(name);
        }
    }
    
    /*
    把指定的浮动窗口排在所有浮动窗口最下面
    @param String name 浮动窗口的名字

    */
    
    function sendPopoverToBack(name){
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            name = name['name'];
        }
        if(!name){
            uexWindow.sendToBack();
        }else{
            uexWindow.sendPopoverToBack(name);
        }
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
        width = width || '';
        height = height || '';
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

    var popActionSheetCallQueue =[];
    function processpopActionSheetCallQueue(data,dataType,opId){
        if(popActionSheetCallQueue.length > 0){
            $.each(popActionSheetCallQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    if(dataType != 2){
                        return v(new Error(' error'));
                    }
                    v(null,data,dataType,opId);
                }
            });
        }
        popActionSheetCallQueue=[];
        return;
    }
    /*
        弹出一个可选的菜单列表
        @param String title 菜单列表的标题
        @param String cancelText 取消按钮上显示文字内容
        @param Array  buttons 显示在菜单列表上的文字集合
        @param Function callback  菜单列表关闭的回调 
        buglly:需添加opId参数传入与回调对应
        
    */
    function popActionSheet(title, cancelText, buttons,callback){
        if(arguments.length === 1 && appcan.isPlainObject(title)){
            callback = title['callback'];
            buttons = title['buttons'];
            cancelText = title['cancelText'];
            title = title['title'];
        }
        buttons = appcan.isArray(buttons)?buttons:[buttons];
        if(appcan.isFunction(callback)){
            uexWindow.cbActionSheet  = function(optId,dataType,data){
                //callback(null,data,dataType,optId);
                popActionSheetCallQueue.push(callback);
                processpopActionSheetCallQueue(data,dataType,opId);
            };
        }
        
        uexWindow.actionSheet(title,cancelText,buttons);
    }

        /*
     * 设置侧滑窗口信息
     * @param Object leftSliding 侧滑左窗口信息 JSON对象{width:240,url:"uexWindow_left.html"}
     * @param Object rightSliding 侧滑左窗口信息 JSON对象{width:240,url:"uexWindow_right.html"}
     * 支持只设置一个对象参数，例如： {leftSliding: {width:240,url:"uexWindow_left.html"},rightSliding: {width:240,url:"uexWindow_left.html"}}
     */
    function setSlidingWindow(leftSliding,rightSliding,animationId,bg){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(leftSliding)){
            argObj = JSON.stringify(leftSliding);
        }else{
            argObj = {};
            if(appcan.isPlainObject(leftSliding)){
                argObj.leftSliding = leftSliding;
            }else{
                argObj.leftSliding = JSON.parse(leftSliding);
            }
            if(appcan.isPlainObject(rightSliding)){
                argObj.rightSliding = rightSliding;
            }else{
                argObj.rightSliding = JSON.parse(rightSliding);
            }
            argObj.animationId = animationId||'1';
            argObj.bg = bg ||'';
            argObj = JSON.stringify(argObj);
        }
        uexWindow.setSlidingWindow(argObj);
    }
    /*
        打开或关闭侧滑窗口，注：打开侧滑窗口前，需先调用setSlidingWindow设置打开的侧滑窗口信息
        @param Number mark 必选 左右侧窗口标识，0：左侧，1：右侧
        @param Number reload 可选 是否重新加载页面 ，1：重新加载
     * */
    function toggleSlidingWindow(mark,reload){
        var argObj = null;
        if(!appcan.isPlainObject(mark) && !JSON.parse(mark)){
            argObj = {};
            argObj.mark = mark;
            if(reload) argObj.reload = reload;
        }else{
            argObj = mark;
        }
        if(appcan.isPlainObject(argObj)){
            argObj = JSON.stringify(argObj);
        }
        uexWindow.toggleSlidingWindow(argObj);
    }
    
    /*
     设置侧滑窗口是否可用
     * @param Number enable 侧滑窗口是否可用，0：不可用，1：可用
     * */
    function setSlidingWindowEnabled(enable){
        var enable = parseInt(enable,10);
        enable = isNaN(enable)?0:enable;
        enable = enable!=0?1:enable;
        uexWindow.setSlidingWindowEnabled(enable);
    }

    var urlQueryQueue =[];
    /*
        处理回调获取加载页面时传入的参数
        @param Number data 传递过来的数据信息
        @param Number dataType 回调返回的数据类型
        @param Number opId 该回调的操作Id
    */
    function processGetUrlQueryQueue(data,dataType,opId){
        if(urlQueryQueue.length > 0){
            $.each(urlQueryQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    v(data,dataType,opId);
                }
            });
        }
        urlQueryQueue=[];
        return;
    }

    /*
        获取加载页面时传入的参数
    @param Function callback 获取成功后的回调函数
    */
    function getUrlQuery(callback){
        if(arguments.length === 1 && appcan.isPlainObject(callback)){
            callback = callback['callback'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }
        urlQueryQueue = urlQueryQueue || [],
        urlQueryQueue.push(callback);
        uexWindow.cbGetUrlQuery = function(opId, dataType, data){
            processGetUrlQueryQueue(data,dataType,opId);
        };

        uexWindow.getUrlQuery();
    }
    
    var slidingWindowStateQueue =[];
    /*
        处理回调返回的状态信息
        @param string state 回调返回的状态信息
    */
    function processSlidingWindowStateQueue(state){
        if(slidingWindowStateQueue.length > 0){
            $.each(slidingWindowStateQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    v(state);
                }
            });
        }
        slidingWindowStateQueue=[];
        return;
    }

    /*
        获取侧滑窗口显示情况
        @param Function callback 获取成功后的回调函数
    */
    function getSlidingWindowState(callback){
        if(arguments.length === 1 && appcan.isPlainObject(callback)){
            callback = callback['callback'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }
        slidingWindowStateQueue = slidingWindowStateQueue || [];
        slidingWindowStateQueue.push(callback);
        uexWindow.cbSlidingWindowState = function(state){
            processSlidingWindowStateQueue(state);
        };
        uexWindow.getSlidingWindowState();
    }

    /*
     设置状态条上字体的颜色
     * @param Number type 状态条上字体的颜色，0为白色(iOS7以上为透明底,iOS7以下为黑底)， 1为黑色(iOS7以上为透明底,iOS7以下为白底)
     * */
    function setStatusBarTitleColor(type){
        var type = parseInt(type,10);
        type = isNaN(type)?0:type;
        type = type!=0?1:type;
        uexWindow.setStatusBarTitleColor(type);
    }

    /*
    在多窗口机制中，前进到下一个window
    @param Number animateId 动画类型Id
        animateId:动画类型Id
            0: 无动画
            1: 从左向右推入
            2: 从右向左推入
            3: 从上向下推入
            4: 从下向上推入
            5: 淡入淡出
            6: 左翻页
            7: 右翻页
            8: 水波纹
            9: 由左向右切入
          10: 由右向左切入
          11: 由上先下切入
          12: 由下向上切入
          13: 由左向右切出
          14: 由右向左切出
          15: 由上向下切出
          16: 由下向上切出
    @param Number animDuration 动画持续时长，单位为毫秒，默认为260毫秒

    */
    function windowForward(animId,animDuration){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(animId)){
            argObj = animId;
            animId = argObj['animId'];
            animDuration = argObj['animDuration'];
        }
        if(animId){
            animId = parseInt(animId,10);
            if(isNaN(animId) || animId > 16 || animId < 0){
                animId = 0;
            }
        }
        if(animDuration){
            animDuration = parseInt(animDuration,10);
            animDuration = isNaN(animDuration)?'':animDuration;
        }
        animDuration = animDuration || 260;
        uexWindow.windowForward(animId,animDuration);
    }
    
     /*
    在多窗口机制中，返回到上一个窗口:在多窗口机制中，用于返回上一个window，比如在A window中appcan.window.open了B window，那么在Bwindow中返回Awindow就可使用此方法。
    @param Number animateId 动画类型Id
        animateId:动画类型Id
            0: 无动画
            1: 从左向右推入
            2: 从右向左推入
            3: 从上向下推入
            4: 从下向上推入
            5: 淡入淡出
            6: 左翻页
            7: 右翻页
            8: 水波纹
            9: 由左向右切入
          10: 由右向左切入
          11: 由上先下切入
          12: 由下向上切入
          13: 由左向右切出
          14: 由右向左切出
          15: 由上向下切出
          16: 由下向上切出
    @param Number animDuration 动画持续时长，单位为毫秒，默认为260毫秒

    */
    function windowBack(animId,animDuration){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(animId)){
            argObj = animId;
            animId = argObj['animId'];
            animDuration = argObj['animDuration'];
        }
        if(animId){
            animId = parseInt(animId,10);
            if(isNaN(animId) || animId > 16 || animId < 0){
                animId = 0;
            }
        }
        if(animDuration){
            animDuration = parseInt(animDuration,10);
            animDuration = isNaN(animDuration)?'':animDuration;
        }
        animDuration = animDuration || 260;
        uexWindow.windowBack(animId,animDuration);
    }
    
    /*
     调用appcan.window.open方法且其中type为64时打开的主窗口ready方法中调用：预加载浮动窗口开始
     */
    function preOpenStart(){
        uexWindow.preOpenStart();
    }
    
    /*
     调用appcan.window.open方法且其中type为64时打开的主窗口ready方法中调用：预加载浮动窗口结束
     */
    function preOpenFinish(){
        uexWindow.preOpenFinish();
    }

    var stateQueue =[];
    /*
        处理回调返回的状态信息
        @param Number data 回调返回的数据信息
        @param Number dataType 回调返回的数据类型
        @param Number opId 该回调的操作Id
    */
    function processGetStateQueue(data,dataType,opId){
        if(stateQueue.length > 0){
            $.each(stateQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    v(null,data,dataType,opId);
                }
            });
        }
        stateQueue=[];
        return;
    }

    /*
        获取当前窗口处于前台还是后台
    @param Function callback(err,data,dataType) 获取成功后的回调函数
           err:第一个参数是Error对象如果为空则表示没有错误，否则表示操作出错了，
           data:表示返回的数据，0：前台；1：后台,
           dataType:操作结果的数据类型，默认为2：Number类型
           optId:该操作id
    */
    function getState(callback){
        if(arguments.length === 1 && appcan.isPlainObject(callback)){
            callback = callback['callback'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }
        stateQueue.push(callback);
        //data:返回的数据，0：前台；1：后台
        try{
            uexWindow.cbGetState = function(opId,dataType,data){
                processGetStateQueue(data,dataType,opId);
            };
        }catch(e){
            callback(e);
        }
        
        uexWindow.getState();
    }

    /*
        发送消息到状态栏
        @param Number title 必选  标题
        @param Number msg 必选 消息
     * */
    function statusBarNotification(title,msg){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(title)){
            argObj = title;
            title = argObj['title'] || '';
            msg = argObj['msg'] || '';
        }
        title = title || '';
        msg = msg || '';
        if(msg == ''){
            return;
        }
        uexWindow.statusBarNotification(title,msg);
    }

    /*
     设置内容超过一屏滚动的时候滚动条的显示和隐藏
     * @param Number enable 滚动条的显示和隐藏，0：隐藏，1：显示
     * */
    function setWindowScrollbarVisible(enable){
        var enable = parseInt(enable,10);
        enable = isNaN(enable)?0:enable;
        enable = enable!=0?'true':'false';
        uexWindow.setWindowScrollbarVisible(enable);//android引擎只接受字符串true,false
    }
    
    /*
            隐藏弹动效果
        @param Number type 隐藏的位置，0:顶端，1：底部
     * */
    function hiddenBounceView(type){
        type = type!=1?0:type;
        uexWindow.hiddenBounceView(type);
    }
    
    /*
            显示弹动效果
        @param Number type 弹动的位置，0：顶端弹动；1：底部弹动
        @param String color 弹动显示部位的颜色值，内容不超过一屏时底部弹动内容不显示,
        @param String flag 是否显示内容，1：显示；0：不显示
     * * */
    function showBounceView(type,color,flag){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(type)){
            argObj = type;
            type = argObj["type"] || 0;
            color = argObj["color"] ;
            flag = argObj["flag"] || 1;
        }
        type = type || 0;
        flag = flag || 1;
        uexWindow.showBounceView(type,color,flag);
    }
    
    /*
     将当前浮动窗口插入到指定浮动窗口之上
     @param String name 目标浮动窗口的名称
     * */
    function insertAbove(name){
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            name = name["name"];
        }
        if(!name){
            return;
        }
        uexWindow.insertAbove(name);
    }
    
    /*
     将当前浮动窗口插入到指定浮动窗口之下
     @param String name 目标浮动窗口的名称
     * */
    function insertBelow(name){
        if(arguments.length === 1 && appcan.isPlainObject(name)){
            name = name["name"];
        }
        if(!name){
            return;
        }
        uexWindow.insertBelow(name);
    }
    
    /*
     将指定浮动窗口插入到另一浮动窗口之上,只在主窗口中有效
     @param String nameA 指定浮动窗口A的名称
     @param String nameB 指定浮动窗口B的名称
     * */
    function insertPopoverAbovePopover (nameA,nameB){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(nameA)){
            argObj = nameA;
            nameA = argObj["nameA"];
            nameB = argObj["nameB"];
        }
        if(!nameA || !nameB){
            return;
        }
        uexWindow.insertPopoverAbovePopover(nameA,nameB);
    }
    
    /*
     将指定浮动窗口插入到另一浮动窗口之下,只在主窗口中有效
     @param String nameA 指定浮动窗口A的名称
     @param String nameB 指定浮动窗口B的名称
     * */
    function insertPopoverBelowPopover (nameA,nameB){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(nameA)){
            argObj = nameA;
            nameA = argObj["nameA"];
            nameB = argObj["nameB"];
        }
        if(!nameA || !nameB){
            return;
        }
        uexWindow.insertPopoverBelowPopover(nameA,nameB);
    }
    
    /*
    设置当前窗口显示和隐藏，该接口仅对显示在屏幕上且不被隐藏的window起作用。（即open该window时，flag传入的是256）
        @param Number type 显示或隐藏，0-显示；1-隐藏
     * */
    function setWindowHidden(type){
        type = type!=1?0:type;
        uexWindow.setWindowHidden(type);
    }

    /*
     将指定窗口A插入到另一窗口B之上，该接口仅对显示在屏幕上且不被隐藏的window起作用。（即open该window时，flag传入的是256）
     @param String nameA 指定窗口A的名称
     @param String nameB 指定窗口B的名称
     * */
    function insertWindowAboveWindow (nameA,nameB){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(nameA)){
            argObj = nameA;
            nameA = argObj["nameA"];
            nameB = argObj["nameB"];
        }
        if(!nameA || !nameB){
            return;
        }
        uexWindow.insertWindowAboveWindow(nameA,nameB);
    }
    
    /*
     将指定窗口A插入到另一窗口B之下，该接口仅对显示在屏幕上且不被隐藏的window起作用。（即open该window时，flag传入的是256）
     @param String nameA 指定窗口A的名称
     @param String nameB 指定窗口B的名称
     * */
    function insertWindowBelowWindow (nameA,nameB){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(nameA)){
            argObj = nameA;
            nameA = argObj["nameA"];
            nameB = argObj["nameB"];
        }
        if(!nameA || !nameB){
            return;
        }
        uexWindow.insertWindowBelowWindow(nameA,nameB);
    }

    var popoverLoadFinishInRootWndCallList = [];
    
    /*
        处理浮动窗口加载完成回调事件
        @param String name:浮动窗口的名称
        @param String url:浮动窗口的url；当浮动窗口加载的是本地网页时，url返回网页的绝对路径（file:// 开头）当浮动窗口加载的是网络上的网页时，url返回网址（http:// 开头）
    */
    function processPopoverLoadFinishInRootWnd(name,url){
        $.each(popoverLoadFinishInRootWndCallList,function(i,v){
            if(appcan.isFunction(v)){
                v(name,url);
            }
        });
        popoverLoadFinishInRootWndCallList = [];
        return;
    }
    
    /*
        浮动窗口加载完成的监听方法
        @param Function callback(name,url):浮动窗口加载完成的回调函数
            name:浮动窗口的名称
            url:浮动窗口的url；当浮动窗口加载的是本地网页时，url返回网页的绝对路径（file:// 开头）当浮动窗口加载的是网络上的网页时，url返回网址（http:// 开头）
    */
    function onPopoverLoadFinishInRootWnd(callback){
        if(!appcan.isFunction(callback)){
            return;
        }
        popoverLoadFinishInRootWndCallList.push(callback);
        uexWindow.onPopoverLoadFinishInRootWnd = processPopoverLoadFinishInRootWnd;
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
        setMultilPopoverFlippingEnbaled:setMultilPopoverFlippingEnbaled,
        
        actionSheet:popActionSheet,
        scaleAnim:scaleAnim,
        alphaAnim:alphaAnim,
        rotateAnim:rotateAnim,
        customAnim:customAnim,
        setSlidingWindow:setSlidingWindow,
        toggleSlidingWindow:toggleSlidingWindow,
        getSlidingWindowState:getSlidingWindowState,
        setSlidingWindowEnabled:setSlidingWindowEnabled,
        getUrlQuery:getUrlQuery,
        setStatusBarTitleColor:setStatusBarTitleColor,
        windowForward:windowForward,
        windowBack:windowBack,
        preOpenStart:preOpenStart,
        preOpenFinish:preOpenFinish,
        getState:getState,
        //statusBarNotification:statusBarNotification,//android正常，IOS调用本地推送只显示了msg没显示title
        setWindowScrollbarVisible:setWindowScrollbarVisible,
        insertPopoverBelowPopover:insertPopoverBelowPopover,
        insertPopoverAbovePopover:insertPopoverAbovePopover,
        insertBelow:insertBelow,
        insertAbove:insertAbove,
        insertWindowBelowWindow:insertWindowBelowWindow,
        insertWindowAboveWindow:insertWindowAboveWindow,
        //setWindowHidden:setWindowHidden,IOS,android不同有问题
        showBounceView:showBounceView,
        hiddenBounceView:hiddenBounceView,
        onPopoverLoadFinishInRootWnd:onPopoverLoadFinishInRootWnd
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