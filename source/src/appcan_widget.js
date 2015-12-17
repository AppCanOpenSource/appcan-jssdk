/*
    author:jiaobingqian
    email:bingqian.jiao@zymobi.com
    description:构建appcan widget模块
    create:2015.11.26
    update:______/___author___

*/
/*global window,appcan,uexWidget*/
window.appcan && appcan.define('widget',function($,exports,module){
    
    /*
    在当前widget加载一个子widget
    @param String appId 子widget的appId
    @param String animiId 子widget载入时的动画id:
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
    @param String funName 方法名，子widget结束时将String型的任意字符回调给该方法，可为空。 注意：只在主窗口中有效，
    浮动窗口中无效
    @param String info 传给子widget的信息
    @param String animDuration 动画持续时长，单位为毫秒，默认200毫秒
    @param Function callback(err,data,dataType,opId) 回调函数
        err:Error对象，如果为空表示没有错误
        data:回调返回的数据，0-成功 1-失败
        dataType:回调返回的数据类型，默认为2：Int类型
        opId:操作ID，在此函数中不起作用，可忽略

     */
    function startWidget(appId,animId,funName,info,animDuration,callback) {
        var uexObj = null;
        if (arguments.length ===1 && appcan.isPlainObject(appId)) {
            uexObj = appId;
            appId = uexObj['appId'];
            animId = uexObj['animId']||0;
            funName = uexObj['funName'];
            info = uexObj['info'];
            animDuration = uexObj['animDuration']||'';
            callback = uexObj['callback']||function(){};
        }
        if(!appId){
            return callback(new Error('appId is empty'));
        }
        animId = animId||0;
        animDuration = animDuration||'';
        callback = callback || function(){};
        
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
        uexWidget.cbStartWidget = function(opId,dataType,data){
            callback(null,data,dataType,opId);
        }
        uexWidget.startWidget(appId,animId,funName,info,animDuration);
    }
    /*
    退出一个widget
    @param String resultInfo 此widget结束时，传递给opener的信息
    @param String appId 要结束的widget的appId，为空时退出的是当前的widget
    @param Number isWgtBG 结束此widget的方式，0表示销毁该widget，下次再调 用startWidget时，重新打开；1表示把该widget置于
    后台，下次再调用startWidget时，不重新打开，操作数据 全部保存。不传或为空时，默认为0。注意传该参数时，必须要传appId参数。
     */
    function finishWidget(resultInfo,appId,isWgtBG) {
        var uexObj = null;
        if (arguments.length ===1 && appcan.isPlainObject(resultInfo)) {
            uexObj = resultInfo;
            resultInfo = uexObj['resultInfo'];
            appId = uexObj['appId'];
            isWgtBG = uexObj['isWgtBG'];
        }
        if(resultInfo && appId && isWgtBG){
            uexWidget.finishWidget(resultInfo,appId,isWgtBG);
        }else if(resultInfo && appId){
            uexWidget.finishWidget(resultInfo,appId);
        }else{
            uexWidget.finishWidget(resultInfo);
        }

        
    }

    /*
    删除一个widget
    @param String appId  widget的appId，主widget不能被删除
    @param Function callback(err,data,dataType,opId) 回调函数
        err:Error对象，如果为空表示没有错误
        data:回调返回的数据，0-成功 1-失败
        dataType:回调返回的数据类型，默认为2：Int类型
        opId:操作ID，在此函数中不起作用，可忽略
     */
     function removeWidget(appId,callback) {
        var uexObj = null;
        if (arguments.length ===1 && appcan.isPlainObject(appId)) {
            uexObj = appId;
            appId = uexObj['appId'];
            callback = uexObj['callback']||function(){};
        }
        uexWidget.cbRemoveWidget = function(opId,dataType,data){
            callback(null,data,dataType,opId);
        }

        uexWidget.removeWidget(appId);
    }
    /*
    检查当前widget是否有更新
    @param Function callback(err,data,dataType,opId) 回调函数
        err:Error对象，如果为空表示没有错误
        data:检查结果0- 需要更新 1- 不需要更新 2- 错误
        dataType:回调返回的数据类型，默认为2：Int类型
        opId:操作ID，在此函数中不起作用，可忽略
     */
    function checkUpdate(callback) {
        var uexObj = null;
        
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = uexObj['callback']||function(){};
        }
        callback = callback || function(){};
        try{
            uexWidget.cbCheckUpdate = function(opId,dataType,data){
                var res = JSON.parse(data);
                var resData = res.result ||2;
                callback(null,resData,dataType,opId);
            }
        }catch(e){
            callback(new Error("检查失败！"));
        }
        uexWidget.checkUpdate();
    }
    /*
    根据相关信息启动一个第三方应用  IOS版
    @param String appInfo   第三方应用的URLSchemes
     */
    function loadApp(appInfo) {
        var uexObj = null;
        if (arguments.length ===1 && appcan.isPlainObject(appInfo)) {
            uexObj = appInfo;
            appInfo = uexObj['appInfo'];
        }
        uexWidget.loadApp(appInfo);
    }
    /*
    根据相关信息启动一个第三方应用  Android版
    @param String startMode 启动方式，0表示通过包名和类名启动，1表示通过Action启动
    @param String optInfo   附加参数，键值对，{key:value}格式多个用英文”,”隔开
    startMode 为0时，如下
    @param String mainInfo  包名
    @param String addInfo   类名，为空时启动应用入口类
    startMode 为1时，如下
    @param String mainInfo  action
    @param String addInfo   category或data，json格式如下
    @param Function callback(info) 启动第三方应用的回调方法，该方法在未成功调用第三方应用时回调。
        info:(String)回调信息内容
    
     */
    function startApp(startMode,mainInfo,addInfo,optInfo,callback) {
        var uexObj = null;
        if (arguments.length ===1 && appcan.isPlainObject(startMode)) {
            uexObj = startMode;
            startMode = uexObj["startMode"];
            mainInfo = uexObj['mainInfo'];
            addInfo = uexObj['addInfo'];
            optInfo = uexObj['optInfo'];
            callback = callback || function(){};
        }

        if(appcan.isFunction(callback)){
            uexWidget.cbStartApp = function(info){
                callback(info);
            }
        }

        uexWidget.startApp(startMode,mainInfo,addInfo,optInfo);

    }

    /*
    获取打开者传入此widget的相关信息。即调用startWidget时传入的info参数值。
        @param Function callback(err,data,dataType,opId) 回调函数
            err:Error对象，如果为空表示没有错误
            data:返回的数据 本widget的打开者通过startWidget函数打开本widget时传入的info参数值
            dataType:回调返回的数据类型，默认为2：Int类型
            opId:操作ID，在此函数中不起作用，可忽略
     */
    function getOpenerInfo(callback) {
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = callback['callback'];
        }
        if(!appcan.isFunction(callback)){
            return;
        }

        uexWidget.cbGetOpenerInfo = function(opId,dataType,data){
            callback(null,data,dataType,opId);
        };

        uexWidget.getOpenerInfo();
    }
    /*
    根据安装包所在路径安装一个apk(Android方法)
    @param String appPath  apk所在路径
     */
    function installApp(appPath) {
        var uexObj = null;
        if (arguments.length ===1 && appcan.isPlainObject(appPath)) {
            uexObj = appPath;
            appPath = uexObj['appPath'];
        }
        uexWidget.installApp(appPath);
    }

    /*
    获取推送消息,上报消息到管理后台
    @param Function callback(err,data,dataType,opId) 回调函数
            err:Error对象，如果为空表示没有错误
            data:返回的数据 ,json格式字符串
            dataType:回调返回的数据类型，默认为2：Int类型
            opId:操作ID，在此函数中不起作用，可忽略
     */
    function  getPushInfo(callback) {
        var uexObj = null;
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = uexObj['callback'];
        }
        if (!appcan.isFunction(callback)) {
            return;
        }
        uexWidget.cbGetPushInfo = function(opId,dataType,data){
            callback(null,data,dataType,opId);
        };
        uexWidget.getPushInfo();
    }

    /*
    如果应用开启了推送功能，那么当有消息推送进来时，平台将调用指定的cbFunction函数通知页面。
    @param String cbFunction 回调函数方法名
     */
    function setPushNotifyCallback(cbFunction) {
        if (arguments.length === 1 && appcan.isPlainObject(cbFunction)) {
            cbFunction = cbFunction['cbFunction'];
        }

        uexWidget.setPushNotifyCallback(cbFunction);
    }

    /*
    设置推送用户信息
    @param String uId 用户ID
    @param String uNickName 用户昵称
     */
    function setPushInfo(uId,uNickName) {
        var uexObj = null;
        if (arguments.length ===1 && appcan.isPlainObject(uId)) {
            uexObj = uId;
            uId = uexObj['uId'];
            uNickName = uexObj['uNickName'];
        }
        uexWidget.setPushInfo(uId,uNickName);
    }

    /*
    设置推送服务的状态
    @param Number state 推送服务状态0-关闭 1-开启
     */
     function setPushState(state) {
        var uexObj = null;
        if (arguments.length === 1 && appcan.isPlainObject(state)) {
            uexObj = state;
            state = uexObj['state'];
        }
        state = parseInt(state,10);
        state = isNaN(state)?0:state;
        state = state!=0?1:state;

        uexWidget.setPushState(state);

     }

     /*
     获取推送服务的状态
     @param Function callback(err,data,dataType,opId) 回调函数
        err:Error对象，如果为空表示没有错误
        data:0-关闭 1-开启
        dataType:参数类型，默认为2,Number类型
        opId:操作ID，在此函数中不起作用，可忽略
      */

     function getPushState(callback){
        var uexObj = null;
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = uexObj['callback'];
        }
        if (!appcan.isFunction(callback)) {
            return;
        }
        uexWidget.cbGetPushState = function (opId,dataType,data){
            callback(null,data,dataType,opId);
        }

        uexWidget.getPushState();

     }

     /*
     是否安装某第三方应用
     @param String appData 
     @param Function callback(err,data,dataType,opId) 回调函数
        err:Error对象，如果为空表示没有错误
        data:返回结果：0-已安装；1-未安装。
        dataType:参数类型，默认为2,Number类型
        opId:操作ID，在此函数中不起作用，可忽略
      */
     function isAppInstalled(appData,callback) {
        var uexObj = {};
        var res = null;
        if(arguments.length === 1 && appcan.isPlainObject(appData)){
            uexObj = appData;
            appData = uexObj["appData"];
            callback = uexObj["callback"];
        }

        if(!appcan.isFunction(callback)){
            return ;
        }

        uexWidget.cbIsAppInstalled = function(data){
            try{
                var res = JSON.parse(data);
                callback(null,res.installed,2);
            }catch(e){
                callback(new Error('error'));
            }
        };

        var param = {};
        param.appData = appData;
        param = JSON.stringify(param);

        uexWidget.isAppInstalled(param);

    }
    
    var loadByOtherAppCallQueue = [];
    function processLoadByOtherAppCallQueue(jsonData){
         $.each(loadByOtherAppCallQueue,function(i,v){
            if(appcan.isFunction(v)){
                v(jsonData);
            }
        })
        
     }
     /*
        默认被第三方应用调起事件
    */
    
    function defaultLoadByOtherApp(){
        var tmpLoadByOtherAppCall = null;
        if(appcan.widget.onLoadByOtherApp){
            tmpLoadByOtherAppCall = appcan.widget.onLoadByOtherApp;
        }
        appcanWidget.emit('loadByOtherApp');
        tmpLoadByOtherAppCall && tmpLoadByOtherAppCall();
    }
        /*
        被第三方应用调起的监听方法;所有的监听方法都得在root页面进行监听
        @param function callback回调函数
         */
     function onLoadByOtherApp(callback) {
        if (arguments.length ===1 && appcan.isPlainObject(callback)) {
            callback = callback['callback'];
        }
        
        loadByOtherAppCallQueue.push(callback);
        uexWidget.onLoadByOtherApp = function(data){
            processLoadByOtherAppCallQueue(data);
        }
        return;
     }
        
     var suspendCallQueue = [];
     function processSuspendCallQueue(){
         $.each(suspendCallQueue,function(i,v){
            if(appcan.isFunction(v)){
                v();
            }
        })
     }
     /*
        默认程序挂起事件
    */
    
    function defaultSuspend(){
        var tmpSuspendCall = null;
        if(appcan.widget.onSuspend){
            tmpSuspendCall = appcan.widget.onSuspend;
        }
        appcanWidget.emit('suspend');
        tmpSuspendCall && tmpSuspendCall();
    }
     /*
     程序挂起的监听方法
     无参数
      */
     function onSuspend(callback) {
        if(!appcan.isFunction(callback)){
            return;
        }
        suspendCallQueue.push(callback);
        uexWidget.onSuspend = processSuspendCallQueue;
        return;
     }


     var resumeCallQueue = [];
     function processResumeCallQueue(){
         $.each(resumeCallQueue,function(i,v){
            if(appcan.isFunction(v)){
                v();
            }
        })
     }
     /*
        默认状态改变事件
    */
    
    function defaultResume(){
        var tmpResumeCall = null;
        if(appcan.widget.onResume){
            tmpResumeCall = appcan.widget.onResume;
        }
        appcanWidget.emit('resume');
        tmpResumeCall && tmpResumeCall();
        
        
    }
     /*
     程序恢复的监听方法
     无参数
      */
     function onResume(callback) {
        if(!appcan.isFunction(callback)){
            return;
        }
        resumeCallQueue.push(callback);
        uexWidget.onResume = processResumeCallQueue;
        return;
     }
     //默认绑定状态
     appcan.ready(function(){
        //绑定默认状态改变事件
        //onLoadByOtherApp(defaultLoadByOtherApp);
        //绑定默认swipe事件
        onSuspend(defaultSuspend);
        //绑定默认swipe事件
        onResume(defaultResume);
     });
    //导出接口
    var appcanWidget = module.exports = {
        startWidget:startWidget,
        finishWidget:finishWidget,
        removeWidget:removeWidget,
        checkUpdate:checkUpdate,
        loadApp:loadApp,
        startApp:startApp,
        getOpenerInfo:getOpenerInfo,
        installApp:installApp,
        getPushInfo:getPushInfo,
        setPushNotifyCallback:setPushNotifyCallback,
        setPushInfo:setPushInfo,
        setPushState:setPushState,
        getPushState:getPushState,
        isAppInstalled:isAppInstalled,
        //loadByOtherApp:onLoadByOtherApp,
        suspend:onSuspend,
        resume:onResume 
    };
    
    appcan.extend(appcanWidget,appcan.eventEmitter);

});