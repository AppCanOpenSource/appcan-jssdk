# appcan_request 网络请求


    
##appcan request native异步请求
对appcan私有的异步请求进行封装    

###appcan.request.ajax(options)
发起一个ajax请求,并获取相应的内容    

`options`:发起ajax的请求的参数，这个必须是一个对象   
`options.type`:请求的类型，包括`GET`、`POST`等   
`options.url`:要请求的地址    
`options.data`:要请求的URL的参数,如果要上传文件则data数据中必须传一个对象包含一个path的key
例如：data:{file:{path:'a.jpeg'}}上传a.jpeg图片    
`options.contentType`:默认: false 要传给服务端的数据内容的'content-Type'通过header,如果设置其他content将会直接把data发送出去
`options.dataType`:服务端的响应类型，包括json, jsonp, script, xml, html, text中的一种   
`options.timeout`:请求的超时时间  
`options.headers`:要设置的请求头   
`options.xhrFields`:要重载的请求对象的字段   
`options.beforeSend(xhr, settings)`:请求发送之前的回调,返回`false`取消请求发送    
`options.success(data, status, xhr)`:请求发送成功后的回调    
`options.error(xhr, errorType, error)`:请求如果出现错误后的回调    
`options.complete(xhr, status)`:请求完成后的回调，不管是否出错
`options.progress(progress, xhr)`:上传的进度，只有包含上传文件的时候才会执行该回调
`options.certificate`:添加证书信息 {password:'',path:''}` 其中`password`是证书的密码，`path`是证书的地址

例如：
    
    //获取appcan.cn页面  
    appcan.request.ajax({
      type: 'GET',
      url: 'htt://appcan.cn',
      //添加参数
      data: { name: 'appcan' },
      //期望的返回类型
      dataType: 'html',
      timeout: 300,//超时时间
      success: function(data){
          //获取内容
          alert('data');
      },
      error: function(xhr, type){
        alert('Ajax error!')
      }
    })

    //另外一种使用方式
    var requret = appcan.require('request');
    requret.ajax({
      type: 'POST',
      url: 'http://appcan.cn/reg',
      data: { name: 'appcan' },
      contentType: 'application/json',
      success:function(){
          
          
      }
      
    })
    
    //获取appcan.cn页面  
    appcan.request.ajax({
      type: 'GET',
      url: 'htt://appcan.cn',
      //添加参数
      data: { name: 'appcan' },
      //期望的返回类型
      dataType: 'html',
      timeout: 300,//超时时间
      success: function(data){
          //获取内容
          alert('data');
      },
      error: function(xhr, type){
        alert('Ajax error!')
      }
    })

    //例如发送一个post请求,地址为模拟用
    requret.ajax({
      type: 'POST',
      url: 'http://appcan.cn/reg',
      data: { name: 'appcan' },
      contentType: 'application/json',
      success:function(){
          
          
      }
      
    })
    
###appcan.request.get(url,[data],success,[dataType])
发一个http Get请求，这是`appcan.request.ajax`的简写   
`url`:要请求的地址   
`data`:该参数不是必须的，要传递的参数   
`success`:成功后的回调函数，参考appcan.request.ajax参数中的success    
`dataType`:返回的响应结果的数据类型   

例如：
    
    //请求appcan.cn页面的内容
    appcan.request.get('http://appcan.cn',function(data, status, xhr){
        //数据内容
        console.log(data);
    });
    //另外一种使用方式
    var request = appcan.require('request');
    request.get('http://appcan.cn',function(data, status, xhr){
        //数据内容
        console.log(data);
    });
  

###appcan.request.post(url, [data], success,[dataType]) 
发起一个http Post请求   
`url`:要请求的地址  
`data`:要发出的请求的参数   
`success`:请求的成功的回调   
`dataType`:返回的响应结果的数据类型   

例如：
    
    //发送一个简单的post数据到appcan.cn
    appcan.request.post('http://appcan.cn',{name:'appcan'},function(data, status, xhr){
        //打印结果
        console.log(data);
    });
    //另外一种使用方式
    var request = appcan.require('file');
    request.post('http://appcan.cn',{name:'appcan'},function(data, status, xhr){
        //打印结果
        console.log(data);
    });


###appcan.request.getJSON(url,[data],success)
发起一个http get请求来获取json数据   
`url`:要获取的json数据的地址
`data`:要发送请求的参数   
`success`:成功后的回调  

例如：
    
    //获取一个json数据
    appcan.request.getJSON('http://appcan.cn/a.json',function(data){
        //打印json数据
        console.log(data);
    });
    //另一种使用方式
    var request = appcan.require('request');
    request.getJSON('http://appcan.cn/a.json',function(data){
        //打印json数据
        console.log(data);
    });

###appcan.request.postForm(selector,success,error)
序列化表单内容并提交表单   
`selector`:表单的css选择器，或者是form元素    
`success(data)`:表单提交成功后的回调,data服务器端的返回值    
`error(err)`:表单提交失败的时候的回调,err错误对象   

例如：
    
    //获取一个json数据
    $('form').on('submit',function(){
        var form = $('from');
        appcan.request.postForm(form);
        return false;
    });
    //另一种使用方式
    var request = appcan.require('request');
    $('form').on('submit',function(){
        var form = $('from');
        request.postForm(form);
        return false;
    });


