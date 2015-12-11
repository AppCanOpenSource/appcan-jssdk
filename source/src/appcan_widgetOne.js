/*
    author:zhujinwang
    email:jinwang.zhu@zymobi.com
    description:构建appcan widget模块
    create:2015.12.07
    update:2015.12.08/jiaobingqian

*/
/*global window,appcan,uexWidgetOne*/
appcan.define('widgetOne', function($, exports, module) {
    /*
    获取平台信息,回调中返回获取结果
    @ param Function callback(err,data,dataType,opId)回调方法
        err：当出现错误的时候error，否则为空
        data：返回当前手机平台的类型，0：IOS；1：Android；2：Chrome
        dataType: 返回数据类型，此方法未2，Number类型
        opId:操作ID，在此函数中不起作用，可忽略
     */
    function getPlatform(callback) {
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = callback['callback'];
        }
        if (!appcan.isFunction(callback)) return;

        try {
            uexWidgetOne.cbGetPlatform = function(opId, dataType, data) {
                callback(null, data, dataType, opId);
            }
            uexWidgetOne.getPlatform();
        } catch (e) {
            callback(e);
        }
    }

    /*
        获取系统名称
    */
    function getPlatformName() {
        return uexWidgetOne.platformName;
    }
    /*
        获取系统版本
    */
    function getPlatformVersion() {
        return uexWidgetOne.platformVersion;
    }

    /*
        获取是否为ios7风格
    */
    function isIOS7Style() {
        return uexWidgetOne.iOS7Style || 0;
    }

    /*
        判断是否全屏
    */
    function isFullScreen() {
        return uexWidgetOne.isFullScreen;
    }

    /*
        退出,0不弹否则弹提示框
        @param Number flag：Number类型, 是否弹出关闭提示框，0-不弹，否则弹提示框;如果flag不是number类型则默认flag为0
    */
    function exit(flag) {
        if (arguments.length === 1 && appcan.isPlainObject(flag)) {
            flag = flag['flag'];
        }
        //flag是number类型
        flag = isNaN(flag) ? 0 : flag;
        uexWidgetOne.exit(flag);
    }


    /*
    获取当前widget的信息
    @param Function callback(err,data,dataType,opId) 回调方法
        err：当出现错误的时候error，否则为空
        data:返回当前widget相关信息，json数据字符串格式
        dataType:返回数据类型，此方法中正常为1：JSON字符串类型
        opId:操作ID，在此函数中不起作用，可忽略
     */

    function getCurrentWidgetInfo(callback) {
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = callback['callback'];
        }
        if (!appcan.isFunction(callback)) return;
        try {
            uexWidgetOne.cbGetCurrentWidgetInfo = function(opId, dataType, data) {
                callback(null, data, dataType, opId);
            }
            uexWidgetOne.getCurrentWidgetInfo();
        } catch (e) {
            callback(e);
        }
    }

    /*
    清除当前应用的缓存，仅主widget调用此接口有效。
    @param Function callback(err,data,dataType,opId) 回调方法
        err:当出现错误的时候error，否则为空
        data:返回清除缓存结果；0：成功；1：失败
        dataType:回调返回数据类型，此处为2：Number
        opId:操作ID，在此函数中不起作用，可忽略
     */
    function cleanCache(callback) {
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = callback['callback'];
        }
        if (!appcan.isFunction(callback)) return;
        try {
            uexWidgetOne.cbCleanCache = function(opId, dataType, data) {
                callback(null, data, dataType, opId);
            }
            uexWidgetOne.cleanCache();
        } catch (e) {
            callback(e);
        }
    }

    /*
    获取主widget的appId
    @param function(err,data,dataType,opId) callback回调方法
        err：当出现错误的时候error，否则为空
        data：返回主widget的appId
        dataType:返回数据的格式，此处为0:text文本格式
        opId: 操作ID，在此函数中不起作用，可忽略
     */
    function getMainWidgetId(callback) {
        if (arguments.length === 1 && appcan.isPlainObject(callback)) {
            callback = callback['callback'];
        }
        if (!appcan.isFunction(callback)) return;
        try {
            uexWidgetOne.cbGetMainWidgetId = function(opId, dataType, data) {
                callback(null, data, dataType, opId);
            }
            uexWidgetOne.getMainWidgetId();
        }catch(e){
            callback(e);
        }
    }

    var appcanWidgetOne = module.exports = {
        getPlatform: getPlatform,
        getPlatformName: getPlatformName,
        getPlatformVersion: getPlatformVersion,
        isIOS7Style: isIOS7Style,
        isFullScreen: isFullScreen,
        exit: exit,
        getCurrentWidgetInfo: getCurrentWidgetInfo,
        cleanCache: cleanCache,
        getMainWidgetId: getMainWidgetId
    };

    //appcan.extend(appcanWidgetOne, appcan.eventEmitter);
});