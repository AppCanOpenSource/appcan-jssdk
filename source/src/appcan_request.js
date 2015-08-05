/*

    author:dushaobin
    email:shaobin.du@3g2win.com
    description:构建appcan request模块
    create:2014.08.18
    update:______/___author___


*/
/*global window,appcan*/
appcan && appcan.define('request',function($,exports,module){
    var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/;

    var getXmlHttpId = appcan.getOptionId;

    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
        appcan.trigger(eventName,context,data);
    }

    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) {
            return triggerAndReturn(context || appcan, eventName, data);
        }
    }

  // Number of active Ajax requests
  var active = 0;

  function ajaxStart(settings) {
      if (settings.global && active++ === 0) {
          triggerGlobal(settings, null, 'ajaxStart');
      }
  }
  function ajaxStop(settings) {
      if (settings.global && !(--active)) {
          triggerGlobal(settings, null, 'ajaxStop');
      }
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context;
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false){
          return false;
        }

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
  }
  function ajaxSuccess(data, requestCode, response, xhr, settings, deferred) {
      var context = settings.context, status = 'success';

      settings.success.call(context, data, status, requestCode, response, xhr);
      if (deferred) {
          deferred.resolveWith(context, [data, status, requestCode, response, xhr]);
      }
      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data, status, requestCode, response]);
      ajaxComplete(status, xhr, settings);
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, msg, xhr, settings, deferred) {
      var context = settings.context;
      settings.error.call(context, xhr, type, error, msg);
      if (deferred) {
          deferred.rejectWith(context, [xhr, type, error, msg]);
      }
      triggerGlobal(settings, context, 'ajaxError',
        [xhr, settings, error || type, msg]);
        ajaxComplete(type, xhr, settings);
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
      var context = settings.context;
        settings.complete.call(context, xhr, status);
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
        ajaxStop(settings);
  }
  
  // progress: 当前上传进度
  function ajaxProgress(progress, xhr, settings) {
      var context = settings.context;
        settings.progress.call(context,progress, xhr, status);
        triggerGlobal(settings, context, 'ajaxProgress', [progress,xhr, settings]);
  }
  
  // Empty function, used as default callback
  function empty() {}

  var ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    //add progress 
    progress: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    //证书信息
    certificate:null,
    //添加app认证信息
    appVerify:true,
    //模拟Http
    emulateHTTP:false,
    // Transport
    xhr: function () {
        return window.uexXmlHttpMgr || XMLHttpRequest;
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    //默认不设置content type
    contentType:false,
    // Whether data should be serialized to string
    processData: false,
    // Whether the browser should be allowed to cache GET responses
    cache: true
};

  function mimeToDataType(mime) {
      if (mime) {
          mime = mime.split(';', 2)[0];
      }
      return mime && ( mime == htmlType ? 'html' :
        mime == jsonType ? 'json' :
        scriptTypeRE.test(mime) ? 'script' :
        xmlTypeRE.test(mime) && 'xml' ) || 'text';
  }

  function appendQuery(url, query) {
    if (query == '') {
        return url;
    }
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
  }
  
  function processCompleteResult(xhr,opcode,status,result,requestCode,response,deferred){
      var settings = xhr['settings_'+opcode];
      var dataType = settings.dataType;
      if(status < 0){
          if(result == null || result == ""){
            result = response;
          }

          ajaxError(null,'request error', result, xhr, settings, deferred);
          return;
      }
      if (status == 1) {
          if(!requestCode || requestCode == 200 || (requestCode > 200 && requestCode <300) || requestCode == 304){
            //todo release 
            xhr['settings_'+opcode] = null;
            //clearTimeout(abortTimeout);
            var error = false;
            result = result || '';
            try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                if (dataType == 'script'){
                    (1,eval)(result);
                }else if (dataType == 'xml')  {
                    result = result;
                }else if (dataType == 'json') {
                    result = blankRE.test(result) ? null : $.parseJSON(result);
                }
            } catch (e) {
                error = e;
            }
            if (error) {
                ajaxError(error, 'parsererror', result, xhr, settings, deferred);
            }
            else {
                ajaxSuccess(result, requestCode, response, xhr, settings, deferred);
            }     
          }else{
            if(result == null || result == ""){
              result = response;
            }
            ajaxError(null,'request error', result, xhr, settings, deferred);
          }
          
      } else {
          ajaxError(null, 'error', result, xhr, settings, deferred);
      }
      xhr.close(opcode);
  }
  
  function processProgress(progress,xhr,optId){
      var settings = xhr['settings_'+optId];
      ajaxProgress(progress,xhr,settings);
  }
  
  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
      if (options.processData && options.data && !appcan.isString(options.data)){
          options.data = $.param(options.data, options.traditional);
      }
      if (options.data && (!options.type || options.type.toUpperCase() == 'GET')){
          options.data = $.param(options.data, options.traditional);
          options.url = appendQuery(options.url, options.data);
          options.data = undefined;
      }
  }
  

  function ajax(options){
      var httpId = getXmlHttpId();
        var settings = $.extend({}, options || {}),
            deferred = $.Deferred && $.Deferred();
        for (key in ajaxSettings) {
            if (settings[key] === undefined) {
                settings[key] = ajaxSettings[key];
            }
        }
        ajaxStart(settings);
        if (!settings.crossDomain) {
            settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
                RegExp.$2 != window.location.host;
        }

        if (!settings.url) {
            settings.url = window.location.toString();
        }
        serializeData(settings);

        var dataType = settings.dataType;
        var hasPlaceholder = /\?.+=\?/.test(settings.url);
        if (hasPlaceholder) {
            dataType = 'jsonp';
        }

        if (settings.cache === false || (
            (!options || options.cache !== true) &&
            ('script' == dataType || 'jsonp' == dataType)
        )){
            settings.url = appendQuery(settings.url, '_=' + Date.now());
        }

        if ('jsonp' == dataType) {
            if (!hasPlaceholder){
                settings.url = appendQuery(settings.url,
                settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?');
            }
            return $.ajaxJSONP(settings, deferred);
        }

        var mime = settings.accepts[dataType],
            headers = {},
            setHeader = function(name, value) {
                headers[name.toLowerCase()] = [name, value];
            },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = function(xhr,headers){
                var toHeader = {};
                var fromHeader = null;
                for(var key in headers){
                    fromHeader = headers[key];
                    toHeader[fromHeader[0]] = fromHeader[1];
                }
                xhr.setHeaders(httpId,JSON.stringify(toHeader));
            },
            addAppVerify = function(settings){
                if(settings.appVerify === true){
                    //添加app 认证头 修复模拟器不支持setAppvVerify 方法
                    xhr.setAppVerify && xhr.setAppVerify(httpId,1);
                }
                if(settings.appVerify === false){
                    //添加app 认证头 修复模拟器不支持setAppvVerify 方法
                    xhr.setAppVerify && xhr.setAppVerify(httpId,0);
                }
            },
            //更新证书信息
            updateCertificate = function(settings){
                var certi = settings.certificate;
                if(!certi){
                    return;
                }
                xhr.setCertificate && xhr.setCertificate(httpId,certi.password || '',certi.path);
            },
            abortTimeout;
        //绑定相应的配置
        xhr['settings_'+httpId] = settings;
        
        if (deferred) {
            deferred.promise(xhr);
        }
        //发出的ajax请求
        if (!settings.crossDomain) {
            setHeader('X-Requested-With', 'XMLHttpRequest');
        }
        setHeader('Accept', mime || '*/*');
        if (mime = settings.mimeType || mime) {
            if (mime.indexOf(',') > -1) {
                mime = mime.split(',', 2)[0];
            }
            xhr.overrideMimeType && xhr.overrideMimeType(mime);
        }
        
        if (settings.emulateHTTP && (settings.type === 'PUT' || settings.type === 'DELETE' || settings.type === 'PATCH')) {
            setHeader('X-HTTP-Method-Override', settings.type);
            settings.type = 'POST';
        }
        
        if (settings.contentType ||
            (settings.contentType !== false &&
            settings.data && settings.type.toUpperCase() != 'GET')){
                setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
        }

        if (settings.headers) {
            for (var name in settings.headers) {
                setHeader(name, settings.headers[name]);
            }
        }

        xhr.setRequestHeader = setHeader;
        //添加progress 回调
        xhr.onPostProgress = function(optId,progress){
            var resArg = [progress];
            resArg.push(xhr);
            resArg.push(optId);
            processProgress.apply(null,resArg);
        };
        xhr.onData = function(){
            var resArg = [xhr];
            for(var i=0,len=arguments.length;i<len;i++){
                resArg.push(arguments[i]);
            }
            resArg.push(deferred);
            processCompleteResult.apply(null,resArg);
        };

        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.close(httpId);
            ajaxError(null, 'abort', null, xhr, settings, deferred);
            return xhr;
        }
        
        if (settings.xhrFields) {
            for (name in settings.xhrFields) {
                xhr[name] = settings.xhrFields[name];
            }
        }

        var async = 'async' in settings ? settings.async : true;
        //xhr.open(settings.type, settings.url, async, settings.username, settings.password)
        xhr.open(httpId,settings.type,settings.url,settings.timeout);
        //添加http header
        nativeSetHeader(xhr, headers);
        //设置证书信息
        updateCertificate(settings);
        //添加app认证信息
        addAppVerify(settings);
        
        if(settings.data && settings.contentType === false){
            for(name in settings.data){
                //fixed Number 类型bug
                if(appcan.isPlainObject(settings.data[name])){
                    if(settings.data[name].path){
                        //上传文件数据
                        xhr.setPostData(httpId,"1",name,settings.data[name].path);
                    }else{
                        xhr.setPostData(httpId,"0",name,JSON.stringify(settings.data[name]));
                    }
                }else{
                    //添加普通数据
                    xhr.setPostData(httpId,"0",name,settings.data[name]);
                }
            }
        }else{
            if(settings.contentType === 'application/json'){
                if(appcan.isPlainObject(settings.data)){
                    settings.data = JSON.stringify(settings.data);
                }
            }
            //fixed ios bug 如果调用setBody就是当作post请求发送出来
            if(settings.data){
                xhr.setBody(httpId,settings.data ? settings.data : null);
            }
        }
        xhr.send(httpId);
        return xhr;
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if (appcan.isFunction(data)) {
        dataType = success;
        success = data;
        data = undefined;
    }
    if (!appcan.isFunction(success)) {
        dataType = success;
        success = undefined;
    }
    return {
          url: url,
          data: data,
          success: success,
          dataType: dataType
    };
  }

  function get(/* url, data, success, dataType */){
      return ajax(parseArguments.apply(null, arguments));
  }

  function post(/* url, data, success, dataType */){
      var options = parseArguments.apply(null, arguments);
      options.type = 'POST';
      return ajax(options);
  }

  function getJSON(/* url, data, success */){
      var options = parseArguments.apply(null, arguments);
      options.dataType = 'json';
      return ajax(options);
  }

  var escape = encodeURIComponent;

  function serialize(params, obj, traditional, scope){
      var type, array = $.isArray(obj), hash = $.isPlainObject(obj);
      $.each(obj, function(key, value) {
        type = $.type(value);
        if (scope) {
            key = traditional ? scope :
            scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
        }
        // handle data in serializeArray() format
        if (!scope && array) {
            params.add(value.name, value.value);
        }
        // recurse into nested objects
        else if (type == 'array' || (!traditional && type == 'object')){
            serialize(params, value, traditional, key);
        }
        else {
            params.add(key, value);
        }
        });
    }

    function param(obj, traditional){
        var params = [];
        params.add = function(k, v){
            this.push(escape(k) + '=' + escape(v));
        };
        serialize(params, obj, traditional);
        return params.join('&').replace(/%20/g, '+');
    }
  
   //添加post form提交表单 todo:属于扩展对象
   function postForm(form,success,error){
       if(!form){
           return;
       }
       form = $(form);
       var submitInputs = [];
       var inputTypes = {
           'color':1,
           'date':1,
           'datetime':1,
           'datetime-local':1,
           'email':1,
           'hidden':1,
           'month':1,
           'number':1,
           'password':1,
           'radio':1,
           'range':1,
           'search':1,
           'tel':1,
           'text':1,
           'time':1,
           'url':1,
           'week':1
       };
       var fileType = ['file'];
       var checkTypes = ['checkbox','radio'];
       var todoSupport = ['keygen'];
       var eleList = ['input','select','textarea'];
       var formData = {};
       
       success = success || function(){};
       error = error || function(){};
       
       function getFormData(){
           form.find(eleList.join(',')).each(function(i,v){
               if(v.tagName === 'INPUT'){
                   var ele = $(v);
                   var type = ele.attr('type');
                   if(type in inputTypes){
                       if(ele.attr('data-ispath')){
                           formData[ele.attr('name')] = {
                               path:ele.val()
                           }
                       }else{
                           formData[ele.attr('name')] = ele.val();
                       }
                   }
               }else{
                   
               }
           });
       }
       
       var method = form.attr('method');
       var action = form.attr('action') || location.href;
       method = (method || 'POST').toUpperCase();
       getFormData();
       ajax({
           url:action,
           type:method,
           data:formData,
           success:success,
           error:error
       });
    }

    var offlineClearQueue =[];
    /*
        处理删除离线数据文件回调
        @param string err err对象如果为空则表示 没有错误，否则表示操作出错了
        @param int data表示返回的操作结果，0：处理成功
        @param int dataType操作结果的数据类型，默认正常为2
        @param int optId该操作id
    */
    function processOfflineClearQueue(err,data,dataType,optId){
        if(offlineClearQueue.length > 0){
            $.each(offlineClearQueue,function(i,v){
                if(v && appcan.isFunction(v)){
                    v(err,data,dataType,optId);
                }
            });
            offlineClearQueue =[];
        }
        return;
    }

    /* 
      清除localStorage中url对应离线缓存数据及离线文件
        url:需要被清除离线数据的url地址
    */

    function clearOffline(url,callback,data){
        var argObj = null;
        if(arguments.length === 1 && appcan.isPlainObject(url)){
            argObj = url;
            url = argObj['url'];
            data = argObj['data'];
            callback = argObj['callback'];
        }
        if(!appcan.isFunction(callback)){
            callback = function(){};
        }
        offlineClearQueue.push(callback);
        var offlineKey ='offlinedata';
        var offlinedata = appcan.locStorage.val(offlineKey);
        var offlineUrl;
        if(data){
            var paramsInfo = JSON.stringify(data);
            var fullUrl = url + paramsInfo;
            offlineUrl= appcan.crypto.md5(fullUrl);
        }else{
            offlineUrl= appcan.crypto.md5(url);
        }
         
        if(offlinedata != null){
            dataObj = JSON.parse(offlinedata);
            if(dataObj[offlineUrl]){
                if(dataObj[offlineUrl]['data']){
                    var localFilePath = dataObj[offlineUrl]['data'];
                    appcan.file.remove({
                        filePath:localFilePath,
                        callback:function(err,data,dataType,optId){
                            delete dataObj[offlineUrl];
                            appcan.locStorage.val(offlineKey,JSON.stringify(dataObj));
                            processOfflineClearQueue(err,data,dataType,optId);
                        }
                    });
                }else{
                    delete dataObj[offlineUrl];
                    appcan.locStorage.val(offlineKey,JSON.stringify(dataObj));
                    processOfflineClearQueue(null,0,2,0);
                }
            }else{
                processOfflineClearQueue(null,0,2,0);
            }
        }else{
            offlineClearQueue =[];
        }
    }
    
  
    module.exports = {
        ajax:function(){
            if(window.uexXmlHttpMgr){
                ajax.apply(null,arguments);
            }else{
                Zepto.ajax.apply(null,arguments);
            }
        },
        get:function(){
            if(window.uexXmlHttpMgr){
                get.apply(null,arguments);
            }else{
                Zepto.get.apply(null,arguments);
            }
        },
        post:function(){
            if(window.uexXmlHttpMgr){
                post.apply(null,arguments);
            }else{
                Zepto.post.apply(null,arguments);
            }
        },
        getJSON:getJSON,
        param:param,
        postForm:postForm,
        clearOffline:clearOffline
    };
});
