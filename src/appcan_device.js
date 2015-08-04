/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:扩展zepto到appcan dom 对象上
    扩展Backbone到appcan Backbone 对象上
    扩展underscore到appcan _ 对象上
    created:2014,08.18
    update:


*/
/*global window,appcan*/
window.appcan && appcan.define('device',function($,exports,module){

    var completeCount = 0;
    //var uexDevice = window.uexDevice || {};
    /*
    启动设备震动一段时间
    @param Int millisecond 震动的毫秒数

    */
    function vibrate(millisecond){
        millisecond = parseInt(millisecond,10);
        millisecond = isNaN(millisecond)?0:millisecond;
        uexDevice.vibrate(millisecond);
    }

    /*
    取消设备的震动

    */
    function cancelVibrate(){
        uexDevice.cancelVibrate();
    }

    /*
    获取设备相关的信息
    @param Int infoId 设备信息Id
    @param Function callback 获取信息成功后的回调

    */
    function getInfo(infoId,callback){
        if(arguments.length === 1 && appcan.isPlainObject(infoId)){
            callback = infoId.callback;
            infoId = infoId.infoId;
        }
        if(appcan.isFunction(callback)){
            uexDevice.cbGetInfo = function(optId,dataType,data){
                if(dataType != 1){
                    return callback(new Error('get info error'+infoId));
                }
                callback(null,data,dataType,optId);
            };
        }
        uexDevice.getInfo(infoId);
    }

    /*
    获取所有设备相关的信息
    @param Function callback 每个结果的回调
    todo: 由于只能通过for循环获取系统信息所以用for

    */
    function getDeviceInfo(callback){
        var deviceInfo = {};
        for(var i=0,len = 18;i<len;i++){
            getInfo(i,function(err,data){
                completeCount++;
                if(err){
                    return callback(err);
                }
                var singleInfo = JSON.parse(data);
                appcan.extend(deviceInfo,singleInfo);
                callback(deviceInfo,singleInfo,i,len,completeCount);
            });
        }
        return deviceInfo;
    }

    //更新设备信息
    /*appcan.ready(function(){
        updateDeviceInfo(function(completeCount){
            if(completeCount > 17){
                deviceInfo.isUpdatedAll = true;
            }else{
                deviceInfo.isUpdateAll = false;
            }
            deviceInfo.completeCount = completeCount;
            appcan.extend(deviceRes,deviceInfo);
        });
    });*/

    //相关信息扩展到对象上

    module.exports = {
        vibrate:vibrate,
        cancelVibrate:cancelVibrate,
        getInfo:getInfo,
        getDeviceInfo:getDeviceInfo
    };

});
