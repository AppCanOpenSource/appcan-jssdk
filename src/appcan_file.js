
/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    descript:构建appcan file 模块
    created:2014.08.19
    update:____/____

*/
/*global appcan,uexFileMgr*/

appcan && appcan.define('file',function($,exports,module){

    //var uexFileMgr = window.uexFileMgr;
    /*
    获取操作 id

    */
    var getOptionId = appcan.getOptionId;

    /*
    文件是否存在
    @param String filePath 文件路径
    @param Function callback 又返回结果时的回调

    */
    
    var existQueue = {};//出来是否存在的队列
    
    function processExistCall(optId,dataType,data){
        var callback = existQueue['exist_call_'+optId];
        if(appcan.isFunction(callback)){
            if(dataType == 2){
                callback(null,data,dataType,optId);
            }else{
                callback(new Error('exist file error'),data,
                    dataType,optId);
            }
        }
        //当调用一次后释放掉
        delete existQueue['exist_call_'+optId];
    }
    
    function exists(filePath,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            callback = argObj.callback;
        }
        var optId = getOptionId();
        if(appcan.isFunction(callback)){
            existQueue['exist_call_' + optId] = callback;
            uexFileMgr.cbIsFileExistByPath = function(optId,dataType,data){
                processExistCall.apply(null,arguments);
            };
        }
        uexFileMgr.isFileExistByPath(optId,filePath);
        close(optId);
    }

    /*
    返回文件的相关信息
    @param String filePath
    @param Function callback


    */
    
    function stat(filePath,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            callback = argObj.callback;
        }
        if(appcan.isFunction(callback)){
            uexFileMgr.cbGetFileTypeByPath = function(optId,dataType,data){
                if(dataType != 2){
                    callback(new Error('get file type error'),null,
                        dataType,optId);
                    return;
                }
                var res = {};
                if(data == 0){
                    res.isFile = true;
                }
                if(data == 1){
                    res.isDirectory = true;
                }
                callback(null,res,dataType,optId);
            };
        }
        uexFileMgr.getFileTypeByPath(filePath);
    }



    /*
    读取文件内容
    @param String filePath 文件路径
    @param String callback 结果回调



    */
    function read(filePath,length,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            length = argObj.length;
            callback = argObj.callback;
        }
        if(!filePath){
            return callback(new Error('file name is empty'));
        }
        if(appcan.isFunction(length)){
            callback = length;
            length = -1;
        }
        callback = appcan.isFunction(callback)?callback:function(){};
        length = length || -1;
        exists(filePath,function(err,res){
            if(err){
                return callback(err);
            }
            if(!res){
                return callback(new Error('文件不存在'));
            }
            stat(filePath,function(err,fileInfo){
                if(err){
                    return callback(err);
                }
                if(!fileInfo.isFile){
                    return callback(new Error('该路径不是文件'));
                }
                uexFileMgr.cbReadFile = function(optId,dataType,data){
                    if(dataType != 0){
                        callback(new Error('read file error'),data,
                            dataType,optId);
                    }
                    callback(null,data,dataType,optId);
                };
                open(filePath,1,function(err,data,dataType,optId){
                    uexFileMgr.readFile(optId,length);
                    close(optId);
                });
            });
        });
    }
    
    
    /*
    读加密的文件内容
    
    
    */
    
    function readSecure(filePath,length,key,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            length = argObj.length;
            key = argObj.key;
            callback = argObj.callback;
        }
        if(!filePath){
            return callback(new Error('file name is empty'));
        }
        callback = appcan.isFunction(callback)?callback:function(){};
        length = length || -1;
        exists(filePath,function(err,res){
            if(err){
                return callback(err);
            }
            if(!res){
                return callback(new Error('文件不存在'));
            }
            stat(filePath,function(err,fileInfo){
                if(err){
                    return callback(err);
                }
                if(!fileInfo.isFile){
                    return callback(new Error('该路径不是文件'));
                }
                uexFileMgr.cbReadFile = function(optId,dataType,data){
                    if(dataType != 0){
                        callback(new Error('read file error'),data,
                            dataType,optId);
                    }
                    callback(null,data,dataType,optId);
                };
                openSecure(filePath,1,key,function(err,data,dataType,optId){
                    uexFileMgr.readFile(optId,length);
                    close(optId);
                });
            });
        });
    }

    /*
    获取文件的json形式
    @param String filePath 文件的路径
    @param Function callback 文件读取完成之后的回调

    */
    function readJSON(filePath,callback){
        read({
            filePath:filePath,
            callback:function(err,data){
                var res = null;
                if(err){
                    return callback(err);
                }
                try{
                    if(!data){
                        res = {};
                    }else{
                        res = JSON.parse(data);
                    }
                    callback(null,res);
                }catch(e){
                    return callback(e);
                }
            }
        });
    }



    /*
    写文件
    @param String filePath 文件路径
    @param String mode  写入方式
    @param String content 写入内容

    */
    function write(filePath,content,callback,mode){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            content = argObj.content;
            mode = argObj.mode;
            callback = argObj.callback;
        }
        mode = mode || 0;
        if(appcan.isFunction(content)){
            callback = content;
            content = '';
        }
        open(filePath,2,function(err,data,dataType,optId){
            if(err){
                return callback(err);
            }
            uexFileMgr.writeFile(optId,mode,content);
            close(optId);
            callback(null);
        });
    }
    
    /*
    以安全的方式写入文件内容
    @param String filePath 文件路径
    @param String mode  写入方式
    @param String content 写入内容
    @param String key 要写入文件的密码

    */
    function writeSecure(filePath,content,callback,mode,key){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            content = argObj.content;
            mode = argObj.mode;
            key = argObj.key;
            callback = argObj.callback;
        }
        mode = mode || 0;
        if(appcan.isFunction(content)){
            key = mode;
            mode = callback;
            callback = content;
            content = '';
        }
        openSecure(filePath,2,key,function(err,data,dataType,optId){
            if(err){
                return callback(err);
            }
            uexFileMgr.writeFile(optId,mode,content);
            close(optId);
            callback(null);
        });
    }

    /*
    附近文件到文件的末尾
    @param String filePath 文件路径
    @param String content 内容
    @param Function 回调

    */

    function append(filePath,content,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            content = argObj.content;
            callback = argObj.callback;
        }
        return write(filePath,content,callback,1);
    }
    
    /*
    附近文件到文件的末尾
    @param String filePath 文件路径
    @param String content 内容
    @param String key 加密key
    @param Function 回调

    */

    function appendSecure(filePath,content,key,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            content = argObj.content;
            key = argObj.key;
            callback = argObj.callback;
        }
        return writeSecure(filePath,content,callback,1,key);
    }


    /*
    打开流
    @param String filePath 文件路径
    @param String mode 打开方式

    */
    function open(filePath,mode,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            mode = argObj.mode;
            callback = argObj.callback;
        }
        if(appcan.isFunction(mode)){
            callback = mode;
            mode = 3;
        }
        mode = mode || 3;
        if(!appcan.isString(filePath)){
            return callback(new Error('文件路径不正确'));
        }
        //var optId = getOptionId();
        if(appcan.isFunction(callback)){
            uexFileMgr.cbOpenFile = function(optId,dataType,data){
                if(dataType != 2){
                    callback(new Error('open file error'),data,dataType,optId);
                    return;
                }
                callback(null,data,dataType,optId);
            };
        }
        uexFileMgr.openFile(getOptionId(),filePath,mode);
        //close(optId);
    }
    
    /*
    打开加密文件
    @param String filePath 文件路径
    @param String mode 模式
    @param String key 加密字符串
    @param Function callback 打开加密文件成功后的回调
    
    */
    
    function openSecure(filePath,mode,key,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            mode = argObj.mode;
            key = argObj.key;
            callback = argObj.callback;
        }
        key = key? key : '';
        mode = mode || 3;
        if(!appcan.isFunction(callback)){
            callback = null;
        }
        if(!appcan.isString(filePath)){
            return callback(new Error('文件路径不正确'));
        }
        //var optId = getOptionId();
        if(appcan.isFunction(callback)){
            uexFileMgr.cbOpenSecure = function(optId,dataType,data){
                if(dataType != 2){
                    callback(new Error('open secure file error'),data,dataType,optId);
                    return;
                }
                callback(null,data,dataType,optId);
            };
        }
        uexFileMgr.openSecure(getOptionId(),filePath,mode,key);
        //close(optId);
    }
    
    

    /*
    删除文件
    @param String filePath 文件路径
    @param Function callback 删除结果回调函数

    */

    function deleteFile(filePath,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            callback = argObj.callback;
        }
        var optId = getOptionId();
        if(appcan.isFunction(callback)){
            uexFileMgr.cbDeleteFileByPath = function(optId,dataType,data){
                if(dataType != 2){
                    return callback(new Error('delete file error'));
                }
                callback(null,data,dataType,optId);
            };
        }
        uexFileMgr.deleteFileByPath(filePath);
        close(optId);
    }

    /*
    关闭文件流
    @param String optId 操作id

    */
    function close(optId){
        if(arguments.length === 1 && appcan.isPlainObject(optId)){
            optId = optId.optId;
        }
        if(!optId){
            return;
        }
        uexFileMgr.closeFile(optId);
    }
    
    

    /*
    创建文件
    @param String filePath 文件路径
    @param Function callback 创建结果回调函数

    */
    function create(filePath,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            callback = argObj.callback;
        }
        var optId = getOptionId();
        if(appcan.isFunction(callback)){
            uexFileMgr.cbCreateFile = function(optId,dataType,data){
                if(dataType != 2){
                    return callback(new Error('create file error'),
                    data,dataType,optId);
                }
                callback(null,data,dataType,optId);
            };
        }
        uexFileMgr.createFile(optId,filePath);
        close(optId);
    }
    
    /*
    创建文件
    @param String filePath 创建一个加密文件
    @param String key 加密的字符串 
    @param Function callback 创建结果回调函数

    */
    function createSecure(filePath,key,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            key = argObj.key;
            callback = argObj.callback;
        }
        key = key?key:'';
        var optId = getOptionId();
        if(appcan.isFunction(callback)){
            uexFileMgr.cbCreateSecure = function(optId,dataType,data){
                if(dataType != 2){
                    return callback(new Error('create secure file error'),
                    data,dataType,optId);
                }
                callback(null,data,dataType,optId);
            };
        }
        uexFileMgr.createSecure(optId,filePath,key);
        close(optId);
        
    }
    

    //本地文件
    var localPath = 'wgt://data/locFile.txt';

    /*
    删除本地文件
    @param Function callback 删除本地文件

    */

    function deleteLocalFile(callback){
        if(appcan.isPlainObject(callback)){
            callback = callback.callback;
        }
        if(!appcan.isFunction(callback)){
            callback = function(){};
        }
        deleteFile(localPath,callback);
    }

    /*
    写入本地文件
    @param String content 要写入的内容
    @param Function callback 写完后的结果

    */

    function writeLocalFile(content,callback){
        exists(localPath,function(err,data){
            if(err){
                return callback(err);
            }
            if(!data){
                create(localPath,function(err,res){
                    if(err){
                        return callback(err);
                    }
                    if(res == 0){
                        write(localPath,content,callback);
                    }
                });
            }else{
                write(localPath,content,callback);
            }
        });
    }

    /*
    读本地文件内容
    @param Function callback 结果回调


    */

    function readLocalFile(callback){
        return read(localPath,callback);
    }
    
    /*
    获取文件的真实路径
    @param String path 要获取的文件路径
    @param Function callback 获取成功后的回调    
    
    */
    function getRealPath(filePath,callback){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(filePath)){
            argObj = filePath;
            filePath = argObj.filePath;
            callback = argObj.callback;
        }
        uexFileMgr.cbGetFileRealPath = function(optId, dataType, data){
            if(dataType != 0){
                callback(new Error('get file path error'),data,dataType,optId);
                return;
            }
            callback(null,data,dataType,optId);
        };
        
        uexFileMgr.getFileRealPath(filePath);
    }
    
    
    
    
    module.exports = {
        wgtPath:'wgt://',
        resPath:'res://',
        wgtRootPath:'wgtroot://',
        open:open,
        close:close,
        read:read,
        readJSON:readJSON,
        write:write,
        create:create,
        remove:deleteFile,
        append:append,
        exists:exists,
        stat:stat,
        deleteLocalFile:deleteLocalFile,
        writeLocalFile:writeLocalFile,
        readLocalFile:readLocalFile,
        getRealPath:getRealPath,
        createSecure:createSecure,
        openSecure:openSecure,
        readSecure:readSecure,
        writeSecure:writeSecure,
        appendSecure:appendSecure
    };

});
