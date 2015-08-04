/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:扩展 db 到appcan 对象上
    created:2014,08.22
    update:


*/
/*global appcan,window*/
appcan && appcan.define('database',function($,exports,module){

    var eventEmitter = appcan.require('eventEmitter');
    //var uexDataBaseMgr = window.uexDataBaseMgr || {};
    /*
    获取唯一操作符

    */
    var getOptId = appcan.getOptionId;

    /*
    数据库操作类
    @param String name 数据名

    */
    var DB = function(name){
        this.name = name;
    };
    var dbProto = {
        constructor:DB,
        select:function(sql,callback){
            var that = this;
            var optId = getOptId();
            if(arguments.length === 1 && appcan.isPlainObject(sql)){
                callback = sql.callback;
                sql = sql.sql;
            }
            if(appcan.isFunction(callback)){
                if(!sql){
                    return callback(new Error('sql 为空'));
                }
                uexDataBaseMgr.cbSelectSql = function(optId,dataType,data){
                    if(dataType != 1){
                        return callback(new Error('select error'));
                    }
                    callback(null,data,dataType,optId);
                    that.emit('select',null,data,dataType,optId);
                };
            }
            uexDataBaseMgr.selectSql(this.name,optId,sql);
        },
        exec:function(sql,callback){
            var that = this;
            var optId = getOptId();
            if(arguments.length === 1 && appcan.isPlainObject(sql)){
                callback = sql.callback;
                sql = sql.sql;
            }
            if(appcan.isFunction(callback)){
                if(!sql){
                    return callback(new Error('sql 为空'));
                }
                uexDataBaseMgr.cbExecuteSql = function(optId,dataType,data){
                    if(dataType != 2){
                        return callback(new Error('exec sql error'));
                    }
                    callback(null,data,dataType,optId);
                    that.emit('select',null,data,dataType,optId);
                };
            }
            uexDataBaseMgr.executeSql(this.name,optId,sql);
        },
        //执行事务
        transaction:function(sqlFun,callback){
            var that = this;
            var optId = getOptId();
            if(arguments.length === 1 && appcan.isPlainObject(sqlFun)){
                callback = sqlFun.callback;
                sqlFun = sqlFun.sqlFun;
            }
            if(appcan.isFunction(callback)){
                if(!appcan.isFunction(sqlFun)){
                    return callback(new Error('exec transaction error'));
                }
                window.uexDataBaseMgr.cbTransaction = function(optId,dataType,data){
                    if(dataType != 2){
                        return callback(new Error('exec transaction!'));
                    }
                    callback(null,data,dataType,optId);
                    that.emit('transaction',null,data,dataType,optId);
                };
            }
            uexDataBaseMgr.transaction(this.name,optId,sqlFun);
        }
    };
    //实现eventEmitter能力
    appcan.extend(dbProto,eventEmitter);
    DB.prototype = dbProto;

    var database = {
        /*
        创建一个数据库
        @param String name 数据库名字
        @param String optId 操作Id
        @param Function callback 创建完成回调


        */
        create:function(name,optId,callback){
            var argObj = null;
            if(arguments.length === 1 && appcan.isPlainObject(name)){
                argObj = name;
                name = argObj.name;
                optId = argObj.optId;
                callback = argObj.callback;
            }
            if(!name){
                callback(new Error('数据库名字不能为空！'));
                return;
            }
            if(appcan.isFunction(optId)){
                callback = optId;
                optId = '';
            }
            if(appcan.isFunction(callback)){
                uexDataBaseMgr.cbOpenDataBase = function(optId,type,data){
                    if(type != 2){
                        return callback(new Error('open database error'));
                    }
                    var db = new DB(name);
                    callback(null,data,db,type,optId);
                    this.emit('open',null,data,db,type,optId);
                };
            }
            uexDataBaseMgr.openDataBase(name,optId);
        },
        /*
        销户一个数据库
        @param String name 数据库名字
        @param String optId 操作Id
        @param Function callback 删除完成回调


        */
        destory:function(name,optId,callback){
            var argObj = null;
            if(arguments.length === 1 && appcan.isPlainObject(name)){
                argObj = name;
                name = argObj.name;
                optId = argObj.optId;
                callback = argObj.callback;
            }
            if(!name){
                return;
            }
            if(appcan.isFunction(optId)){
                callback = optId;
                optId = '';
            }
            if(appcan.isFunction(callback)){
                if(!name){
                    callback(new Error('数据库名字不能为空！'));
                    return;
                }
                uexDataBaseMgr.cbCloseDataBase = function(optId,dataType,data){
                    if(dataType != 2){
                        return callback(new Error('close database error'));
                    }
                    callback(null,data,dataType,optId);
                    this.emit('close',null,data,dataType,optId);
                };
            }

            uexDataBaseMgr.closeDataBase(name,optId);

        },
        /*
        查询数据库数据
        @param String name 数据库名
        @param String sql sql语句
        @param Function callback 查询结果回调


        */
        select:function(name,sql,callback){
            if(arguments.length === 1 && appcan.isPlainObject(name)){
                sql = name.sql;
                callback = name.callback;
                name = name.name;
            }
            if(!name || !appcan.isString(name)){
                return callback(new Error('数据库名不为空'));
            }
            var db = new DB(name);
            db.select(sql,callback);
        },
        exec:function(name,sql,callback){
            if(arguments.length === 1 && appcan.isPlainObject(name)){
                sql = name.sql;
                callback = name.callback;
                name = name.name;
            }
            if(!name || !appcan.isString(name)){
                return callback(new Error('数据库名不为空'));
            }
            var db = new DB(name);
            db.exec(sql,callback);
        },
        translaction:function(name,sqlFun,callback){
            if(arguments.length === 1 && appcan.isPlainObject(name)){
                sqlFun = name.sqlFun;
                callback = name.callback;
                name = name.name;
            }
            if(!name || !appcan.isString(name)){
                return callback(new Error('数据库名不为空'));
            }
            var db = new DB(name);
            db.transaction(sqlFun,callback);
        }
    };

    database = appcan.extend(database,eventEmitter);

    module.exports = database;

});
