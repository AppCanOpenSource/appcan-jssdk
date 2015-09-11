/*

    author:jiaobingqian
    email:bingqian.jiao@3g2win.com
    description:封装ajax方法的offline离线缓存
    create:2015.08.03
    update:______/___author___

*/
;(function() {
    var requestAjax = appcan.request.ajax;
    //默认缓存文件路径
    var baseFilePath ='wgt://offlinedata/';
    //默认缓存到LocalStorage数据信息的key
    var offlineKey = 'offlinedata';

    var readFile = appcan.file.read;
    var readSecureFile = appcan.file.readSecure;
    var writeFile = appcan.file.write;
    var writeSecureFile = appcan.file.writeSecure;

    /*
        offline缓存数据主函数
        @param Object opts 离线缓存的ajax请求的参数对象
    */
    function ajax(opts) {
        if (arguments.length === 1 && appcan.isPlainObject(opts)) {
            var url;
            var expires;
            if(opts.data){
                var paramsInfo = JSON.stringify(opts.data);
                var fullUrl = opts.url + paramsInfo;
                url = appcan.crypto.md5(fullUrl);
            }else{
                url = appcan.crypto.md5(opts.url);
            }
            if(opts.expires && typeof(opts.expires) == 'number'){
                expires = parseInt(opts.expires) + parseInt(new Date().getTime());
            }else if(opts.expires && typeof(opts.expires) == 'string'){
                var result = setISO8601(opts.expires);
                expires = result;
            }else{
                expires = 0;
            }
            if (opts.offlineDataPath != undefined && typeof(opts.offlineDataPath) == 'string'){
                baseFilePath = opts.offlineDataPath;
            }
            //如果设置加密，未设置password,给默认password
            if(opts.crypto && !opts.password){
                opts.password = '123qwe';
            }
            if (opts.offline != undefined) {
                var isOffline = opts.offline;

                if (isOffline === true) {
                    var offlinedata = appcan.locStorage.val(offlineKey);
                    var dataObj = null;
                    if (offlinedata != null) {
                        dataObj = JSON.parse(offlinedata);
                        if (dataObj[url]) {
                            var urlData = dataObj[url];
                            var localFilePath = urlData.data?urlData.data:'';
                            var readFileParams ={
                                filePath:localFilePath,
                                length:-1,
                                callback:function(err,data,dataType,optId){
                                    if(err == null){
                                        var tempSucc = opts.success;
                                        if (typeof(tempSucc) == 'function') {
                                            if(typeof(data)=='string'&&opts.dataType.toLowerCase()=='json'){
                                                data=JSON.parse(data);
                                            }
                                            opts.success(data,"success",200,null,null);
                                        }
                                    }else{
                                        var tempSucc = opts.success;
                                        var tempError = opts.error;
                                        opts.success = function(res) {
                                            tempSucc.apply(this, arguments);
                                            setLocalStorage(url, res, expires, opts);
                                        };
                                        opts.error = function(res) {
                                            tempError.apply(this, arguments);
                                        };

                                        requestAjax(opts);
                                    }
                                }
                            };
                            if (urlData.timeout && urlData.now && urlData.data) {
                                var timeout = parseInt(urlData.now) + parseInt(urlData.timeout);
                                var now = new Date();
                                if(urlData.expires && (urlData.expires > now.getTime())){
                                   if(opts.crypto){
                                        readFileParams.key = opts.password;
                                        readSecureFile(readFileParams); 
                                   }else{
                                        readFile(readFileParams); 
                                   }
                                }
                                else if (timeout > now.getTime()) {
                                    if(opts.crypto){
                                        readFileParams.key = opts.password;
                                        readSecureFile(readFileParams); 
                                    }else{
                                        readFile(readFileParams); 
                                    }      
                                } else {
                                    var tempSucc = opts.success;
                                    var tempError = opts.error;
                                    opts.success = function(res) {
                                        tempSucc.apply(this, arguments);
                                        setLocalStorage(url, res, expires, opts);
                                    };
                                    opts.error = function(res) {
                                        tempError.apply(this, arguments);
                                    };
                                    requestAjax(opts);
                                }
                            } else if (urlData.data) {
                                if(urlData.expires){
                                    var now = new Date();
                                    if(urlData.expires > now.getTime()){
                                        if(opts.crypto){
                                            readFileParams.key = opts.password;
                                            readSecureFile(readFileParams); 
                                        }else{
                                            readFile(readFileParams); 
                                        }
                                    }else{
                                        var tempSucc = opts.success;
                                        var tempError = opts.error;
                                        opts.success = function(res) {
                                            tempSucc.apply(this, arguments);
                                            setLocalStorage(url, res, expires, opts);
                                        };
                                        opts.error = function(res) {
                                            tempError.apply(this, arguments);
                                        };
                                        requestAjax(opts);
                                    }
                                }else{
                                    if(opts.crypto){
                                        readFileParams.key = opts.password;
                                        readSecureFile(readFileParams); 
                                    }else{
                                        readFile(readFileParams); 
                                    } 
                                } 
                            } else {
                                var tempSucc = opts.success;
                                var tempError = opts.error;
                                opts.success = function(res) {
                                    tempSucc.apply(this, arguments);
                                    setLocalStorage(url, res, expires, opts);
                                };
                                opts.error = function(res) {
                                    tempError.apply(this, arguments);
                                };

                                requestAjax(opts);
                            }
                        } else {
                            var tempSucc = opts.success;
                            var tempError = opts.error;
                            opts.success = function(res) {
                                tempSucc.apply(this, arguments);
                                setLocalStorage(url, res, expires, opts);
                            };
                            opts.error = function(res) {
                                tempError.apply(this, arguments);
                            };
                            requestAjax(opts);
                        }
                    } else {
                        var tempSucc = opts.success;
                        var tempError = opts.error;
                        opts.success = function(res) {
                            tempSucc.apply(this, arguments);
                            setLocalStorage(url, res, expires, opts);
                        };
                        opts.error = function(res) {
                            tempError.apply(this, arguments);
                        };
                        requestAjax(opts);
                    }
                } else {
                    var tempSucc = opts.success;
                    var tempError = opts.error;
                    opts.success = function(res) {
                        tempSucc.apply(this, arguments);
                        setLocalStorage(url, res, expires, opts);
                    };
                    opts.error = function(res) {
                        tempError.apply(this, arguments);
                    };
                    requestAjax(opts);
                }
            } else {
                var tempSucc = opts.success;
                var tempError = opts.error;
                opts.success = function(res) {
                    tempSucc.apply(this, arguments);
                };
                opts.error = function(res) {
                    tempError.apply(this, arguments);
                };
                requestAjax(opts);
            }
        }
    }
    /*
        缓存ajax请求到的数据并写入文件
        @param String fileUrl 缓存的文件名
        @param String fileData 缓存的JSON格式字符串数据
        @param Number exp 缓存过期时间
        @param Object  opts 缓存ajax请求的参数对象
    */

    function setLocalStorage(fileUrl, fileData, exp, opts) {
        try {
            var filename = fileUrl;
            var localFilePath = baseFilePath + filename + '.txt';
            var saveData = {};
            if((typeof(fileData)=="object")&&(Object.prototype.toString.call(fileData).toLowerCase()=="[object object]")&&!fileData.length){
                fileData=JSON.stringify(fileData);    
            }
            var now = new Date().getTime();
            var data=fileData;
            writeFileParams ={
                filePath:localFilePath,
                content:fileData,
                callback:function(err){
                    if(err == null){
                        saveData['now'] = now;
                        saveData['data'] = localFilePath;
                        if (data.timeout) {
                            saveData.timeout= data.timeout;
                        }else if(typeof data == "string"){
                            try{
                               var parseData = JSON.parse(data);
                               if(parseData.timeout){
                                   saveData.timeout = parseData.timeout;
                               }
                            }catch(e){
                                //console.log(e);
                            }
                        }
                        if(exp > 0){
                            saveData['expires'] = exp;
                        }
                        var offdata = appcan.locStorage.val(offlineKey) || '{}';
                        var offdataObj = JSON.parse(offdata);
                        offdataObj[filename] = saveData;
                        appcan.locStorage.val(offlineKey, JSON.stringify(offdataObj)); 
                    }  
                }
            }
            if(opts.crypto){
                writeFileParams.key = opts.password;
                writeSecureFile(writeFileParams);
            }else{
                writeFile(writeFileParams);
            }
            
        } catch(e) {
            throw e;
        }
    }
    /*
    将符合IOS8601标准的日期格式转成对应毫秒
    @param String string 需要转换成对应毫秒的IOS8601格式的字符串
    */
    function setISO8601(string) {
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        if (string) {
            try{
                var d = string.match(new RegExp(regexp));
                var offset = 0;
                var date = new Date(d[1], 0, 1);

                if (d[3]) {
                    date.setMonth(d[3] - 1);
                }
                if (d[5]) {
                    date.setDate(d[5]);
                }
                if (d[7]) {
                    date.setHours(d[7]);
                }
                if (d[8]) {
                    date.setMinutes(d[8]);
                }
                if (d[10]) {
                    date.setSeconds(d[10]);
                }
                if (d[12]) {
                    date.setMilliseconds(Number("0." + d[12]) * 1000);
                }
                if (d[14]) {
                    offset = (Number(d[16]) * 60) + Number(d[17]);
                    offset *= ((d[15] == '-') ? 1 : -1);
                }
                offset -= date.getTimezoneOffset();
                time = (Number(date) + (offset * 60 * 1000));
                return Number(time);
            }catch(e){
                return 0;
            }
            //this.setTime(Number(time));
        } else {
            return 0;
        }
    }
    /**
    *将日期转换成ISO8601格式字符串
    *@param Date d 需要被转换成IOS8601格式字符串的日期参数
    */
    function ISODateString(d) {
        function pad(n) {
            return n < 10 ? '0' + n : n
        }
        return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z'
    }

    appcan.extend(appcan.request, {
        ajax : ajax
    });
})();

appcan.define('ajax', function($, exports, module){
    module.exports = appcan.request.ajax;
});
