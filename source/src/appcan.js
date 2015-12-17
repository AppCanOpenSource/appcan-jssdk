/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:appcan 基础对象
    created:2014,08.18
    update:2013.08.22 by dushaobin


*/
/* global window */
;(function(global){
    var appcan = {};
    var isUexReady = false;
    var readyQueue = [];
    var isAppcan =false;
    //appcan 相关模块
    appcan.modules = {};
    
    //获取唯一id
    var getUID = function(){
        var maxId = 65536;
        var uid = 0;
        return function(){
            uid = (uid+1)%maxId;
            return uid;
        };
    }();
    
    //获取随机的唯一id，随机不重复，长度固定
    var getUUID = function(len){
        len = len || 6;
        len = parseInt(len,10);
        len = isNaN(len)?6:len;
        var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ';
        var seedLen = seed.length - 1;
        var uuid = '';
        while(len--){
            uuid += seed[Math.round(Math.random()*seedLen)]
        }
        return uuid;
    }
    
    //是否是函数
    var isFunction = function(obj){
        return Object.prototype.toString.call(obj) === '[object Function]';
    };
    //是否是字符串
    var isString = function(obj){
        return Object.prototype.toString.call(obj) === '[object String]';
    };
    //是否是object对象
    var isObject = function(obj){
        return Object.prototype.toString.call(obj) === '[object Object]';
    };
    //是否是数组
    var isArray = function(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    //是否是window对象
    var isWindow = function(obj){
        return obj != null && obj == obj.window;
    };
    //是否是纯对象
    var isPlainObject = function (obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    };
    //扩展对象
    var extend = function(target, source, deep) {
        var key = null;
        for (key in source){
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])){
                    target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])){
                    target[key] = [];
                }
                extend(target[key], source[key], deep);
            }
            else if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
        return target;
    };
    
    //添加appcan 版本
    appcan.version = '1.0.0 Beta';
    
    var errorInfo = {
        moduleName:'模块的名字必须为字符串并且不能为空！',
        moduleFactory:'模块构造对象必须是函数！'
    };

    //定义一个模块，或者插件
    appcan.define = function(name,factory){
        if(isFunction(name)){
            name = '';
            factory = name;
        }
        if(!name || !isString(name)){
            throw new Error(errorInfo.moduleName);
        }
        if(!isFunction(factory)){
            throw new Error(errorInfo.moduleFactory);
        }
        var mod = {exports:{}};
        var res = factory.call(this,appcan.require('dom'),mod.exports,mod);
        var exports = mod.exports || res;
        //模块已经存在
        if(name in appcan){
            appcan[name] = [appcan.name];
            appcan[name].push(exports);
        }else{
            appcan[name] = exports;
        }
        return exports;
    };

    /*
    对模块进行扩展
    @param String name 要扩展的对象
    @param Function factory 扩展函数


    */
    appcan.extend = function(name,factory){
        if(arguments.length > 1 && isPlainObject(name)){
            return extend.apply(appcan,arguments);
        }
        if(isFunction(name) || isPlainObject(name)){
            factory = name;
            name = '';
        }
        name = name ? name : this;
        var extendTo = appcan.require(name);
        extendTo = extendTo ? extendTo : this;
        var mod = {exports:{}};
        var res = null;
        var exports = mod.exports;
        if(isFunction(factory)){
            res = factory.call(this,extendTo,exports,mod);
            res = res || mod.exports;
            extend(extendTo,res);
        }
        if(isPlainObject(factory)){
            extend(extendTo,factory);
        }
        return extendTo;
    };

    //加载依赖的文件
    appcan.require = function(name){
        if(!name){
            throw new Error(errorInfo.moduleName);
        }
        if(!isString(name)){
            return name;
        }
        var res = appcan[name];
        if(isArray(res) && res.length < 2){
            return res[0];
        }
        return res || null;
    };

    //代码入口
    appcan.use = function(modules,factory){
        if(isFunction(modules)){
            factory = modules;
            modules = [];
        }
        if(isString(modules)){
            modules = [modules];
            factory = factory;
        }
        if(!isArray(modules)){
            throw new Error('以来模块参数不正确！');
        }
        var args = [];
        args.push(appcan.require('dom'));
        for(var i=0,len=modules.length; i<len; i++){
            args.push(appcan.require(modules[i]));
        }
        return factory.apply(appcan,args);
    };

    /*
    是否在appcan内运行
    */

    appcan.extend({
        isPlainObject:isPlainObject,
        isFunction:isFunction,
        isString:isString,
        isArray:isArray,
        isAppcan:isAppcan,
        getOptionId:getUID,
        getUID:getUUID
    });

    /*
        继承类

    */
    appcan.inherit = function(parent,protoProps, staticProps) {
        if(!isFunction(parent)){
            staticProps = protoProps;
            protoProps = parent;
            parent = function(){};
        }else{
            parent = parent;
        }
        var child;
        if (protoProps && (protoProps.hasOwnProperty('constructor'))) {
            child = protoProps.constructor;
        } else {
            child = function(){
                parent.apply(this, arguments);
                this.initated && (this.initated.apply(this,arguments));
                return this;
            };
        }
        extend(child,parent);
        extend(child,staticProps);
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        if (protoProps) {
            extend(child.prototype, protoProps);
        }
        child.__super__ = parent.prototype;
        return child;
    };

    /*
    执行添加到ready中的方法

    */
    function execReadyQueue(){
        for(var i=0,len=readyQueue.length;i<len;i++){
            readyQueue[i].call(appcan);
        }
        readyQueue.length = 0;
    }

    /*
    检查是ready
    @param Function callback 回调函数

    */
    function ready(callback){
        callback = isFunction(callback)?callback:function(){};
        readyQueue.push(callback);
        if(isUexReady){
            execReadyQueue();
            return;
        }
        if('uexWindow' in window){
            isUexReady = true;
            execReadyQueue();
            return;
        }else{
            //判断uex插件是否ready
            if(readyQueue.length > 1){
                return;
            }
            if(isFunction(window.uexOnload)){
                readyQueue.unshift(window.uexOnload);
            }
            window.uexOnload = function(type){
                isAppcan = true;
                appcan.isAppcan = true;
                if(!type){
                    isUexReady = true;
                    execReadyQueue();
                }
            };
        }
    }

    //设置uexReady
    appcan.ready = ready;
    global.appcan = appcan;
})(this);
