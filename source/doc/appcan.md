#简介

appcan javascript sdk 是appcan封装的一个开发库，对底层的接口进行更高层的封装，能让开发者更快速、
高效的开发更加稳定的项目，另外在该库的基础上提供了丰富的插件，能让开发者更高效的开发app。

#框架说明

appcan前端整体架构：
![appcan 前端框架](http://ww4.sinaimg.cn/mw690/8dd3f635jw1ek8e36xm89j20yq0omdih.jpg)

#使用说明

在项目开发中你只需引入`appcan.min.js`文件在你的项目中即可，该文件是系统自动根据源文件构建的包
含了文件的所有依赖，然后按照常用的开发流程，进行后续的开发，具体细节参考后续相关文档说明。

例如：

        <script type="text/javascript" src="appcan.min.js"></script>
        <script type="text/javascript">
            //use sdk do something
        </script>
 
#反馈问题
email:[shaobin.du@3g2win.com](shaobin.du@3g2win.com)  


##appcan核心模块

appcan基础模块提供了一套管理整个`appcan sdk`方法,这是整个sdk构建的基础

###appcan.define(name,function(){})

创建一个新模块
`appcan.define(name,defineCall)`    
`name`:要创建的模块名   
`defineCall`:创建模块的函数，执行该函数时会传人三个参数，第一个参数是zepto对象，第二个是要导出的模
块的引用的副本，第三个是要导出模块对象，其中的`exports`对象就是要导出到来的引用点。

例如：
    
    //定义一个foo模块
    appcan.define('foo',function($,exports,modules){
        //do something
        modules.exports = {foo:'foo'};
    });
    


###appcan.extend(obj,[obj])
扩展对象，如果只有一个参数则会把参数扩展到appcan自己上。例如`appcan.extend({showVersion:function(){return this.version;}})`
会给appcan增加一个`showVersion`方法，可以直接调用`appcan.showVersion()`获取当前appcan库的版本号。返回值是扩展后的对象    
`obj`：要扩展的对象   
`[obj]`:如果第二个参数不为空，会把第二个参数扩展到第一个参数上，并返回扩展后的值    


例如：

    //把foo扩展到appcan上
    appcan.extend({foo:'foo'});
    //把一个对象copy 到另一个对象上
    appcan.extend({},{foo:'foo'});

###appcan.require(name)

引用一个模块,返回当前名称对应的模块   
`name`:要获取模块的名称,返回对应的模块

例如：
    
    //引用一个foo对象
    var window = appcan.require('window');
    //当然你也可以直接使用该对象
    appcan.window.do()

###appcan.use(name,funCall)

引用对应的模块进行后续开发    
`name`:模块名   
`funCall`:回调函数，第一个参数默认传入`dom`对象即`zepto`对象，第二个参数是前面要使用的模块名对象，模块名可以是数组，如果参数是数组，回调
中会把数组格式化好按照顺序添加到回调的后续参数中

例如：

    //如果想直接写代码，又不想返回一个模块，用这个方法
    appcan.use(['window','file'],function($,win,file){
        //这样就可以使用window对象了
        win.open();
    });
    //另外可以直接使用，window对象
    appcan.window.open();

###appcan.isString(obj)

判断指定的对象是否是`String`类型，返回值如果为`true`表示是字符串，否则不是字符串   
`obj`:要判断类型的对象   

例如：
    
    //判断foo是否是字符串,
    var res = appcan.isString(foo); //如果res为true则表示foo是字符串，否则foo不是字符串

###appcan.isArray(obj)

判断指定的对象是否是`Array`（数组）类型，返回值如果为`true`表示是字符串，否则不是字符串    
`obj`:要判断类型的对象  

例如：
    
    //判断foo是否是数组
    var res = appcan.isArray(foo); //如果res为true表示foo是数组，否则foo不是数组
    

###appcan.isFunction(obj)

判断指定的对象是否是函数类型，返回值如果为`true`表示是字符串，否则不是字符串    
`obj`:要判断类型的对象

例如：
    
    //判断foo，是否是一个函数
    var res = appcan.isFunction(foo); //如果res为true则foo是函数，否则foo不是函数

###appcan.isPlainObject(obj)

判断指定的类型是否是朴素`Object`对象，返回值如果为`true`表示是字符串，否则不是字符串
`obj`:要判断类型的对象   

例如：
    
    //判断foo是否是一个朴素的对象
    var res = appcan.isPlainObject(foo); //如果foo是一个存纯粹的对象，不是window，不是Aarry，是单纯Object对象


###appcan.ready(funCall)

在appcan内部插件可用后执行内部的回调函数,如果用到appcan的插件一定要调用该方法    
`funCall`:内部插件全部准备好后执行该函数   

例如：
    
    //当所有组建准备好后执行内部回调方法
    appcan.ready(function(){
        //do something
    });

###appcan.inherit(parent,proto,staticProps)

创建一个新的类继承指定的父类     
`parent`:要继承的父类     
`proto`:子类的新方法如果要添加新的属性则需要实现`initated`方法   
`staticProps`:子类的静态属性通过这个对象实现  

例如：
    
    //定义一个父类
    var Foo = function(){
    };
    Foo.prototype = {
        constructor:Foo,
        show:function(){
            //do something
        }
    };
    //定义一个子类集成Foo
    var ChildFoo = appcan.inherit(parent,{
        init:function(){//要添加给子类的方法
            //do something
        }
    });
    
    var cf = new ChildFoo();
    //调用父类的方法
    cf.show();
    
###appcan.logs(msg)
把日志输出到控制台    
`msg`:要打印到控制台的消息

例如:
    
    //打印这段文字到控制台
    appcan.logs('这是一个打印消息');
    
    

##appcan crypto模块
包含了加密相关的模块，目前提供了`rc4`加密模块

###appcan.crypto.rc4(key,content)

根据指定的`key`，把指定的`content`进行rc4加解密，返回加解密后的结果    
`key`:要进行加解密的`key`   
`content`:要加解密的内容   

例如：
    
    //这个是直接传入key，然后直接把content加解密
    var res = appcan.crypto.rc4(key,content);//res为根据key加密content后的结果
    //另外一种使用方式
    var crypto = appcan.require('crypto');
    crypto.rc4(key,content)
    
##appcan database 模块
该模块包含了appcan对数据库的基础操作   

###appcan.database.create(name,[optId],callback)
创建一个数据库
`name`:要创建的数据库名    
`optId`:创建数据库用的操作id,可为空     
`callback(err,data,db,dataType,optId)`:数据库创建成功后的回调，如果创建过程中有错误
`err`不为空，否则`err`为空，`data`返回的执行结果，`db`是数据库创建成功后的数据库对象，可
以执行相关的操作，`dataType`返回结果的数据类型，`optId`操作Id   

> 参数还可以一对象的形式传参：

>     
    {
        name:'',
        optId:'',
        callback:function(err,data,db,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //创建一个名字为blog数据库
    appcan.database.create('blog',function(err,data,db,dataType,optId){
        if(err){
            //创建过程中出错了
            alert('create error');
            return;
        }
        //db就是数据库对象
        if(data == 0){
            //数据库创建成功可以使用了
        }else{
            //数据出创建失败了
        }
        
    });
    
    //另外一种使用方式
    var database = appcan.reuqire('database');
    database.create('blog',function(err,data,db,dataType,optId){
        if(err){
            //创建过程中出错了
            alert('create error');
            return;
        }
        //db就是数据库对象
        if(data == 0){
            //数据库创建成功可以使用了
        }else{
            //数据出创建失败了
        }
        
    });

 
`db.select(sql,callback)`:用返回的数据库对象，进行查询操作，`sql`要查询用的sql语句，`callback`查询
返回的结果回调，同样的`callback(err,data,dataType,optId)`第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id     

> 参数还可以一对象的形式传参：

>   
    {
        sql:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如:
    
    //数据库创建成功了为对象db，然后就可以直接用db执行查询操作了,查询user表中的所有用户信息
    db.select('select * from user',function(err,data,dataType,optId){
        if(err){
            //如果创建过程中出错了
            return;
        }
        //data中的值为sql返回的内容
        
    });

`db.exec(sql,callback)`:用返回的数据库对象，进行更新操作，`sql`要更新用的sql语句，`callback`是更新
返回的结果回调，同样的`callback(err,data,dataType,optId)`第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id     

> 参数还可以一对象的形式传参：

>   
    {
        sql:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如:
    
    //数据库创建成功了为对象db，然后就可以直接用db执行更新操作了,删除userId为1的用户
    db.exec('delete from user where userId = 1 ',function(err,data,dataType,optId){
        if(err){
            //如果创建过程中出错了
            return;
        }
        if(data == 0){
            //执行成功了
        }else{
            //执行失败了
        }
        
    });

`db.transaction(sqlFun,callback)`:用返回的数据库对象，进行事务操作，`sqlFun`要执行用的sql语句序列函数，
`callback`是事务返回的结果回调，同样的`callback(err,data,dataType,optId)`第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id     

> 参数还可以一对象的形式传参：

>   
    {
        sqlFun:function(){
            //do somethings    
        },
        callback:function(err,data,db,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //数据库创建成功了为对象db，然后就可以直接用db执行事务操作了,删除两个用户
    db.exec({
        sqlFun:function(){
            //删除一个用户
            db.exec({sql:'delete from user where userId = 1',callback:function(){
                //do something
            }});
            //再删除一个用户
            db.exec({sql:'delete from user where userId = 2',callback:function(){
                //do something
            }});
        },
        callback:function(err,data,dataType,optId){
            if(err){
                //如果创建过程中出错了
                return;
            }
            if(data == 0){
                //执行成功了
            }else{
                //执行失败了
            }
        }
    });



###appcan.database.select(name,sql,callback)
在指定的数据库上执行查询操作   
`name`:要查询的数据库名    
`sql`:要执行sql查询语句    
`callback(err,data,dataType,optId)`:第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以一对象的形式传参：

>   
    {
        name:'',
        sql:'',
        callback:function(err,data,db,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //你可以直接用静态方法来执行查询语句
    appcan.database.select({
        name:'blog',
        sql:'select * from user',
        callback:function(err,data,dataType,optId){
            if(err){
                //如果创建过程中出错了
                return;
            }
            //data中的值为sql返回的内容
            
        }
    });
    //另外一种使用方式
    var database = appcan.require('database');
    database.select({
        name:'blog',
        sql:'select * from user',
        callback:function(err,data,dataType,optId){
            if(err){
                //如果创建过程中出错了
                return;
            }
            //data中的值为sql返回的内容
            
        }
    });
    

###appcan.database.exec(name,sql,callback)
在指定的数据库上执行更新操作   
`name`:要更新的数据库名    
`sql`:要执行sql更新语句    
`callback(err,data,dataType,optId)`:第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以一对象的形式传参：

>   
    {
        name:'',
        sql:'',
        callback:function(err,data,db,dataType,optId){
            //do somethings
        }
    }
>


例如：
    
    //你可以直接用静态方法来执行更新语句
    appcan.database.exec({
        name:'blog',
        sql:'select * from user',
        callback:function(err,data,dataType,optId){
            if(err){
                //如果创建过程中出错了
                return;
            }
            //data中的值为sql返回的内容
            
        }
    });
    //另外一种使用方式
    var database = appcan.require('database');
    database.exec({
        name:'blog',
        sql:'select * from user',
        callback:function(err,data,dataType,optId){
            if(err){
                //如果创建过程中出错了
                return;
            }
            //data中的值为sql返回的内容
            
        }
    });

###appcan.database.transaction(name,sqlFun,callback)
在指定的数据库上执行事务操作   
`name`:要执行事务的数据库名    
`sqlFun`:要执行sql序列函数    
`callback(err,data,dataType,optId)`:第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以一对象的形式传参：

>   
    {
        name:'',
        sqlFun:function(){
            //do somethings
        },
        callback:function(err,data,db,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //数据库创建成功了为对象db，然后就可以直接用db执行事务操作了,删除两个用户
    appcan.database.exec({
        name:'blog',
        sqlFun:function(){
            //删除一个用户
            db.exec({sql:'delete from user where userId = 1',callback:function(){
                //do something
            }});
            //再删除一个用户
            db.exec({sql:'delete from user where userId = 2',callback:function(){
                //do something
            }});
        },
        callback:function(err,data,dataType,optId){
            if(err){
                //如果创建过程中出错了
                return;
            }
            if(data == 0){
                //执行成功了
            }else{
                //执行失败了
            }
        }
    });
    
    //另外一种使用方式
    var database = appcan.require('database');
    database.exec({
        name:'blog',
        sqlFun:function(){
            //删除一个用户
            db.exec({sql:'delete from user where userId = 1',callback:function(){
                //do something
            }});
            //再删除一个用户
            db.exec({sql:'delete from user where userId = 2',callback:function(){
                //do something
            }});
        },
        callback:function(err,data,dataType,optId){
            if(err){
                //如果创建过程中出错了
                return;
            }
            if(data == 0){
                //执行成功了
            }else{
                //执行失败了
            }
        }
    });



###appcan.database.destory(name,[optId],callback)
销毁已经创建的数据库    
`name`:要销毁的数据库名称    
`optId`:可选，销户数据库的操作id   
`callback(err,data,dataType,optId)`:第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以一对象的形式传参：

>   
    {
        name:'',
        optId:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //销毁blog数据库
    appcan.database.destory({
        name:'blog',
        calllback:function(err,data,dataType,optId){
            if(data == 0){
                //关闭成功
            }else{
                //关闭失败
            }
        }
    });
    
    //另外一种实现方式
    var database = appcan.require('database');
    database.destory({
        name:'blog',
        calllback:function(err,data,dataType,optId){
            if(data == 0){
                //关闭成功
            }else{
                //关闭失败
            }
        }
    });

##appcan detect模块
该模块包含了一下浏览器基础能力的监测    

###appcan.detect.browser
浏览器相关信息    
`appcan.detect.browser.version`:浏览器版本号   
`appcan.detect.browser.name`:当前浏览器名称   
`appcan.detect.browser.ie`:是否是ie   
`appcan.detect.browser.chrome`:是否是chrome   
`appcan.detect.browser.android`:是否是android   
`appcan.detect.browser.iphone`:是否是iphone   
`appcan.detect.browser.ios`:是否是ios   
`appcan.detect.browser.ipad`:是否是ipad   
`appcan.detect.browser.ipod`:是否是ipod   
`appcan.detect.browser.wp`:是否是wp   
`appcan.detect.browser.webos`:是否是webos   
`appcan.detect.browser.touchpad`:是否是touchpad   
`appcan.detect.browser.blackberry`:是否是blackberry   
`appcan.detect.browser.bb10`:是否是bb10   
`appcan.detect.browser.rimtabletos`:是否是rimtabletos   
`appcan.detect.browser.playbook`:是否是playbook   
`appcan.detect.browser.kindle`:是否是kindle   
`appcan.detect.browser.silk`:是否是silk   
`appcan.detect.browser.firefox`:是否是firefox   
`appcan.detect.browser.safari`:是否是safari   
`appcan.detect.browser.webview`:是否是webview   


###appcan.detect.os
操作系统相关信息    

`appcan.detect.os.name`:操作系统名称   
`appcan.detect.os.version`:操作系统版本号  
`appcan.detect.os.phone`:是否是手机    
`appcan.detect.os.tablet`:是否是平板    

###appcan.detect.events
关于事件的支持情况

`appcan.detect.events.supportTouch`:是否支持touch事件
   
###appcan.detect.css
关于css的支持情况    

`appcan.detect.css.support3d`:是否支持3d  

###appcan.detect.ua
当前浏览器的ua信息   


##appcan device
appcan设备相关模块

###appcan.device.vibrate(millisecond)
使设备震动    
`millisecond`:设备震动的时常 单位毫秒   

例如：
    
    //让手机振动10秒
    appcan.device.vibrate(10000);

###appcan.device.cancelVibrate()
停止设备震动    

例如：
    
    //取消手机振动
    appcan.device.cancelVibrate()
    //另外一种使用方式
    var device = appcan.require('device');
    device.cancelVibrate()
    
###appcan.device.getInfo(infoId,callback)
获取设备对应id的信息    
`infoId`:相关信息id   
> 0. `0`: 描述CPU频率的字符串，eg：“1024MHZ”。IOS平台获取不到时，返回“0”     
> 1. `1`: 描述系统版本的字符串，eg：“Android2.3.4”   
> 2. `2`:标书设备制造商的字符串eg:“htc”    
> 3. `3`:代表是否支持键盘的字符串0（不支持）或1（支持）    
> 4. `4`:代表是否支持蓝牙的字符串0（不支持）或1（支持）  
>     当设备有蓝牙功能时，即使蓝牙关闭，返回信息仍然是支持蓝牙，即值为字符串1。    
>     在IOS上的蓝牙功能只支持同一应用间使用，和普遍人们理解的不同，视为不支持。   
> 5. `5`:代表是否支持WIFI的字符串0（不支持）或1（支持）   
当设备有wifi功能时，即使wifi关闭，返回信息仍然是支持wifi，即值为字符串1。   
> 6. `6`:代表是否支持摄像头的字符串0（不支持）或1（支持)    
> 7. `7`:代表是否支持GPS的字符串0（不支持）或1（支持）   
>     当设备有gps功能时，即使gps关闭，返回信息仍然是支持gps，即值为字符串1。    
> 8. `8`:代表当前移动网络数据连接是否可用（不含WIFI）的字符串0（不可用）或1（可用）    
> 9. `9`:代表设备是否支持触屏的字符串0（不支持）或1 （支持）    
> 10. `10`:代表此设备IMEI（国际移动设备唯一标识码）号的15位字符串，eg：“356357046156042”。  
>      在IOS上，获得不到imei时可获得UUID，eg:“dea7f0e2f8c7dfd0c07555b96aff2d342587505b”    
> 11. `11`:推送服务器需要的一个代表此设备的唯一令牌的字符串。   
>      eg：“98d264a3 77689b33 6f1215e6 264ab0c5 55f45b4a ab61e6ff f667883a ef829ccb”,没有时返回空字符串。
>      Android的deviceToken是softToken。   
> 12. `12`:设备类型，用来判断当前的设备是phone	ouch或者pad(IOS专用，类型值参考常量表IOS设备类型)    
> 13. `13`:当前联网的方式(类型值参考常量表网络状态类型)     
> 14. `14`:当前设备剩余的磁盘空间大小的字符串，eg：“12345678”单位：字节	   
>15. `15`:当前移动网络运营商的名称，比如”中国联通”,如果获取不到返回空字符串    
>16. `16`:表示当前设备的WIFI mac地址 ，可作为设备的唯一标识，IMEI可能在某些不具备移动通讯的android平板或MP4上获取不到，但是android系统设备一般都会具有WIFI功能，所以mac地址作为设备唯一标识比IMEI更可靠   
>17. `17`:当前设备的型号名称，如“Galaxy Nexus”   

`callback(err,data,dataType,optId)`:第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

例如：
    
    //获取手机WIFI信息
    appcan.device.getInfo(5,function(err,data,dataType,optId){
        if(err){
            alert('get device error');
            return;
        }
        //{wifi:1}
    });
    //另外一种使用方式
    var device = appcan.require('device');
    device.getInfo(5,function(err,data,dataType,optId){
        if(err){
            alert('get device error');
            return;
        }
        //{wifi:1}
    });

###appcan.device.getDeviceInfo(callback)
获取所有相关的设备信息   
`callback(deviceInfo,singleInfo,i,len,completeCount)`:`deviceInfo`当前已经获得的设备信息
`singleInfo`正在读取的设备信息 `i`设备信息id `len`设备信息总数 `completeCount`已经获得的设备信息数

例如：
    
    //获取所有相关的信息
    appcan.device.getDeviceInfo(function(deviceInfo,singleInfo,i,len,completeCount){
        //deviceInfo 所有的信息，这是一个循环，每调用一次增加一个
        
    });
    //另外一种使用方式
    var device = appcan.require('device');
    device.getDeviceInfo(function(deviceInfo,singleInfo,i,len,completeCount){
        //deviceInfo 所有的信息，这是一个循环，每调用一次增加一个
        
    });

##appcan eventEmitter事件模块
关于事件自定义模块，如果想让你的某一个模块具有事件能力请将该对象扩展到你的目标对象上,该对象本身不能单独使用
例如：`appcan.on('error',function(){})`当appcan捕获到错误的时候就会执行该方法。

###appcan.eventEmitter.on(name,callback)
具有自定义事件能力的对象绑定一个函数到指定的名字中   
`name`:要绑定的事件名   
`callback`:当事件被调起时，会执行该回调函数，参数是触发该事件触发者传入的，具体根据情况不同   

例如：
    
    //一个对象扩展了自定义事件对象,appcan自身就扩展了自定义事件
    appcan.on('error',function(){
        //如果有错误发生就会触发这个回调
        
    });

###appcan.eventEmitter.off(name,callbakc)
移除已经绑定到对应名称的回调函数    
`name`:要移除的事件名   
`callback`:该事件名对应的函数句柄   

例如：
    
    //定义一个错误回调函数
    var appcanErrCall = function(){
        
    };
    
    //绑定这个回调函数
    appcan.on('error',appcanErrCall);
    
    //如果想移除这个回调
    appcan.off('error',appcanErrCall);

###appcan.eventEmitter.once(name,callback)
执行完绑定的事件后，自动移除对应的事件    
`name`:要移除的事件名   
`callback`:该事件名对应的函数句柄     

例如：
    
    //只会执行一次
    appcan.once('error',function(){
        //该回调只会执行一次
        
    });

###appcan.eventEmitter.addEventListener(name,callback)
具有自定义事件能力的对象绑定一个函数到指定的名字中
`name`:要绑定的事件名   
`callback`:当事件被调起时，会执行该回调函数，参数是触发该事件触发者传入的，具体根据情况不同   

例如：
    
    //一个对象扩展了自定义事件对象,appcan自身就扩展了自定义事件
    appcan.addEventListener('error',function(){
        //如果有错误发生就会触发这个回调
        
    });

###appcan.eventEmitter.removeEventListener(name,callback)
移除已经绑定到对应名称的回调函数    
`name`:要移除的事件名   
`callback`:该事件名对应的函数句柄  

例如：
    
    //定义一个错误回调函数
    var appcanErrCall = function(){
        
    };
    
    //绑定这个回调函数
    appcan.on('error',appcanErrCall);
    
    //如果想移除这个回调
    appcan.removeEventListener('error',appcanErrCall);

###appcan.eventEmitter.trigger(name,context,[args,...])
触发绑定的对应的事件    
`name`:对应的事件名称   
`context`:要执行的上下文    
`args`:要传给回调函数的参数   

例如：
    
    //触发错误事件
    appcan.trigger('error',appcan,'test error');

###appcan.eventEmitter.emit(name,context,[args,...])
触发绑定的对应的事件    
`name`:对应的事件名称   
`context`:要执行的上下文    
`args`:要传给回调函数的参数   

例如：
    
    //触发错误事件
    appcan.emit('error',appcan,'test error');


##appcan file文件模块
关于appcan文件操作的基础功能的封装     

###appcan.file.wgtPath 
当前widget的根目录   
例如：
    
    如果你安装一个demo，到存储卡上则   
    /storage   
        /widgetone   
            /apps 所有的应用位置  
                /demo 这里就是demo widget的根目录   
                    /video  
                    /myspace  
                    /audio  
                    /photo
                    
        /widgets
        

###appcan.file.resPath
当前widget/wgtRes目录（支持IOS，Android），用户可以自行预置此目录下文件    

###appcan.file.wgtRootPath
用于部署在服务器端的Appcan应用，必要时打开本地沙箱中widget根目录下的本地网页使用   

例如：当前窗口加载的是服务器上的http://www.xxx.com/xxx.html网页，
如果在xxx.html页面中open一个窗口时，传入的inData为'wgtroot://index.html'，
那么本次open执行时，引擎将会到本应用对应的widget路径下去寻找此页面，例如android上找到的路径会是：file:///android_assert/widget/index.html或者/sdcard/widgetone/widgets/widgetXXX/index.html。

###appcan.file.open(filePath,mode,callback) 
打开文件流   
`filePath`:要打开文件的路径   
`mode`:打开文件的方式    
> 1. `1` 只读方式打开    
> 2. `2` 可写方式打开   
> 3. `4` 新建方式打开   
> 4. `8`:电子书方式打开    

`callback(err,data,dataType,optId)`:打开文件结果回调函数，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        mode:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如：
        
    //打开一个文本文件
    appcan.file.open('wgt://a.txt',1,function(err,data,dataType,optId){
        if(err){
            //出错了
            alert(err);
            return;
        }
        if(data == 0){
            //打开成功了
        }else{
            //打开失败
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.open('wgt://a.txt',1,function(err,data,dataType,optId){
        if(err){
            //出错了
            alert(err);
            return;
        }
        if(data == 0){
            //打开成功了
        }else{
            //打开失败
        }
    });

###appcan.file.openSecure(filePath,mode,key,callback) 
打开加密的文件流   
`filePath`:要打开文件的路径   
`mode`:打开文件的方式    
> 1. `1` 只读方式打开    
> 2. `2` 可写方式打开   
> 3. `4` 新建方式打开   
> 4. `8`:电子书方式打开    

`key`:加密的密钥   
`callback(err,data,dataType,optId)`:打开文件结果回调函数，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        mode:'',
        key:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如：
        
    //打开一个加密的文本文件
    appcan.file.openSecure('wgt://a.txt',1,'password',function(err,data,dataType,optId){
        if(err){
            //出错了
            alert(err);
            return;
        }
        if(data == 0){
            //打开成功了
        }else{
            //打开失败
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.openSecure('wgt://a.txt',1,'password',function(err,data,dataType,optId){
        if(err){
            //出错了
            alert(err);
            return;
        }
        if(data == 0){
            //打开成功了
        }else{
            //打开失败
        }
    });
    

###appcan.file.close(optId)
关闭文件流   
`optId`:文件的操作Id   

> 参数还可以以对象的形式传参：

>   
    {
        optId:''
    }
>

例如：
    
    //关闭一个指定的文件流
    appcna.file.close(optId)
    //另外一种使用方式
    var file = appcan.require('file');
    file.close(optId)

###appcan.file.read(filePath,length,callback)
读取指定文件的内容   
`filePath`:要读取文件的路径    
`length`:要读取文件的长度，默认为-1即读取文件全部内容    
`callback(err,data,dataType,optId)`:读取文件完成后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        length:-1,
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //读取指定的文件内容
    appcan.file.read({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //出错了
                return;
            }
            //data 就是文件内的数据
            
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.read({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //出错了
                return;
            }
            //data 就是文件内的数据
            
        }
    });

###appcan.file.readSecure(filePath,length,key,callback)
读取指定加密文件的内容   
`filePath`:要读取文件的路径    
`length`:要读取文件的长度，默认为-1即读取文件全部内容    
`key`:加密的密钥   
`callback(err,data,dataType,optId)`:读取文件完成后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        length:-1,
        key:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //读取指定的文件内容
    appcan.file.readSecure({
        filePath:'wgt://a.txt',
        key:'',
        callback:function(err,data,dataType,optId){
            if(err){
                //出错了
                return;
            }
            //data 就是文件内的数据
            
        }
    });
    
    //读取指定的文件内容
    var file = appcan.require('file');
    file.readSecure({
        filePath:'wgt://a.txt',
        key:'',
        callback:function(err,data,dataType,optId){
            if(err){
                //出错了
                return;
            }
            //data 就是文件内的数据
            
        }
    });


###appcan.file.readJSON(filePath,callback)
读取指定的json文件    
`filePath`:json文件的路径    
`callback(err,res)`:读取文件完成后的回调，第一个参数`err`是一个错误对象，如果未空表示没有错误，如果
不为空表示出错了，`res`为指定文件的json对象   

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        callback:function(err,res){
            //do somethings
        }
    }
>

例如：
    
    //读一个json文件
    appcan.file.readJSON({
        filePath:'wgt://a.json',
        callback:function(err,res){
            if(err){
                //出错了
                return;
            }
            //res文件保存这的数据转成了JSON
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.readJSON({
        filePath:'wgt://a.json',
        callback:function(err,res){
            if(err){
                //出错了
                return;
            }
            //res文件保存这的数据转成了JSON
        }
    });
    
###appcan.file.write(filePath,content,callback,mode) 
把内容写到指定的文件中
`filePath`:要写的文件路径    
`content`:要写到文件中的内容    
`mode`:写入文件中的方式    
`callback(err)`:写完成后的回调，`err`是错误对象，如果为空则表示没有错误，否则表示有错误发生   

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        content:'',
        mode:'',
        callback:function(err){
            //do somethings
        }
    }
>

例如：
    
    //向文件中些人数据
    appcan.file.write({
        filePath:'a.txt',
        content:'hello world',
        callback:function(err){
            if(err){
                //写入出错了
                return;
            }
            //写入成功了
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.write({
        filePath:'a.txt',
        content:'hello world',
        callback:function(err){
            if(err){
                //写入出错了
                return;
            }
            //写入成功了
        }
    });

###appcan.file.writeSecure(filePath,content,callback,mode,key) 
把内容写到指定的加密文件中   
`filePath`:要写的文件路径    
`content`:要写到文件中的内容    
`mode`:写入文件中的方式    
`key`:加密的密钥   
`callback(err)`:写完成后的回调，`err`是错误对象，如果为空则表示没有错误，否则表示有错误发生   

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        content:'',
        mode:'',
        key:'',
        callback:function(err){
            //do somethings
        }
    }
>

例如：
    
    //向文件中些人数据
    appcan.file.writeSecure({
        filePath:'a.txt',
        key:'password',
        content:'hello world',
        callback:function(err){
            if(err){
                //写入出错了
                return;
            }
            //写入成功了
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.writeSecure({
        filePath:'a.txt',
        key:'password',
        content:'hello world',
        callback:function(err){
            if(err){
                //写入出错了
                return;
            }
            //写入成功了
        }
    });


###appcan.file.create(filePath,callback)
创建一个新文件    
`filePath`:新文件的路径    
`callback(err,data,dataType,optId)`:创建文件完成后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //创建一个新文件
    appcan.file.create({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //创建文件出错了
                return;
            }
            if(data == 0){
                //创建成功
            }else{
                //创建失败
            }
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.create({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //创建文件出错了
                return;
            }
            if(data == 0){
                //创建成功
            }else{
                //创建失败
            }
        }
    });


###appcan.file.createSecure(filePath,key,callback)
创建一个新加密文件    
`filePath`:新文件的路径    
`key`:加密的密钥   
`callback(err,data,dataType,optId)`:创建加密文件完成后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>   
    {
        filePath:'',
        key:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }
>

例如：
    
    //创建一个新文件
    appcan.file.createSecure({
        filePath:'wgt://a.txt',
        key:'password',
        callback:function(err,data,dataType,optId){
            if(err){
                //创建文件出错了
                return;
            }
            if(data == 0){
                //创建成功
            }else{
                //创建失败
            }
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.createSecure({
        filePath:'wgt://a.txt',
        key:'password',
        callback:function(err,data,dataType,optId){
            if(err){
                //创建文件出错了
                return;
            }
            if(data == 0){
                //创建成功
            }else{
                //创建失败
            }
        }
    });

###appcan.file.remove(filePath,callback)
删除指定的文件   
`filePath`:要删除的文件路径    
`callback(err,data,dataType,optId)`:删除文件完成后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    
> 参数还可以以对象的形式传参:    
> 
    {
        filePath:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }

例如：
    
    //删除一个指定的文件,删除a.txt文件
    appcan.file.remove({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //删除文件错误
                return;
            }
            if(data == 0){
                //删除文件成功
            }else{
                //删除文件失败
            }
        }
    });
    
    //另外一种使用方式
    var file = appcan.require('file');
    file.remove({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //删除文件错误
                return;
            }
            if(data == 0){
                //删除文件成功
            }else{
                //删除文件失败
            }
        }
    });

###appcan.file.append(filePath,content,callback)
把内容附加到指定的文件路径     
`filePath`:要附加内容到文件路径   
`content`:要附加的内容   
`callback(err)`:写完成后的回调，`err`是错误对象，如果为空则表示没有错误，否则表示有错误发生   

> 参数还可以以对象的形式传参:    
> 
    {
        filePath:'',
        content:'',
        callback:function(err){
            //do somethings
        }
    }   

例如：

    //附加新内容到现有内容上
    appcan.file.append({
        filePath:'a.txt',
        content:'hello world',
        callback:function(err){
            if(err){
                //附加内容出错了
                return;
            }
            //附加内容成功
        }
    });
    //另一种使用方式
    var file = appcan.require('file');
    file.append({
        filePath:'a.txt',
        content:'hello world',
        callback:function(err){
            if(err){
                //附加内容出错了
                return;
            }
            //附加内容成功
        }
    });


###appcan.file.exists(filePath,callback)
判断给定的路径是否存在文件    
`filePath`:要判断给定文件的路径    
`callback(err,data,dataType,optId)`:判断文件是否存在的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：   
>
    {
        filePath:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }  
    
例如：
    
    //判断文件a.txt是否存在
    appcan.file.exists({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //判断文件文件出错了
                return;
            }
            if(data == 1){
                //文件存在
            }else{
                //文件不存在
            }
        }
    });
    //判断文件a.txt是否存在
    var file = appcan.require('file');
    file.exists({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //判断文件文件出错了
                return;
            }
            if(data == 1){
                //文件存在
            }else{
                //文件不存在
            }
        }
    });

###appcan.file.stat(filePath,callback)
获取文件的相关属性   
`filePath`:文件路径   
`callback(err,data,dataType,optId)`:获取文件属性后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id
其中`data.isFile`如果为`true`表示是文件,`data.isDirectory` 为`true`表示是文件夹。  

> 参数还可以以对象的形式传参：   
> 
    {
        filePath:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }  

例如：
    
    //获取文件信息
    appcan.file.stat({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //获取文件信息出错了
                return;
            }
            if(data.isFile){
                //该路径是文件
            }
            if(data.isDirectory){
                //该路径是一个文件夹
            }
        }
    });
    //另外一种方式
    var file = appcan.require('file');
    file.stat({
        filePath:'wgt://a.txt',
        callback:function(err,data,dataType,optId){
            if(err){
                //获取文件信息出错了
                return;
            }
            if(data.isFile){
                //该路径是文件
            }
            if(data.isDirectory){
                //该路径是一个文件夹
            }
        }
    });

###appcan.file.deleteLocalFile(callback)
默认的话会提供一个`wgt://data/locFile.txt`文件来进行方便操作，如果执行删除会把该文件删掉   
`callback(err,data,dataType,optId)`:删除文件完成后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：   
> 
    {
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }

例如：
    
    //删除预置本地文件
    appcan.file.deleteLocalFile(function(err,data,dataType,optId){
        if(err){
            //删除文件出错了
            return err;
        }
        if(data == 0){
            //删除文件成功
        }else{
            //删除文件失败
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.deleteLocalFile(function(err,data,dataType,optId){
        if(err){
            //删除文件出错了
            return err;
        }
        if(data == 0){
            //删除文件成功
        }else{
            //删除文件失败
        }
    });

###appcan.file.writeLocalFile(content,callback)
重写`wgt://data/locFile.txt`中的内容    
`content`:要重写的内容   
`callback(err)`:写完成后的回调，`err`是错误对象，如果为空则表示没有错误，否则表示有错误发生    

> 参数还可以以对象的形式传参：   
> 
    {
        content:'',
        callback:function(err){
            //do somethings
        }
    }   

例如：
    
    //向本地预置文件中写新内容
    appcan.file.writeLocalFile({
        content:'hello world',
        callback:function(err){
            if(err){
                //出错了
                return;
            }
            //写文件成功
        }
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.writeLocalFile({
        content:'hello world',
        callback:function(err){
            if(err){
                //出错了
                return;
            }
            //写文件成功
        }
    });

###appcan.file.readLocalFile(callback)
获取本地文件中的内容     
`callback(err,data,dataType,optId)`:读取文件完成后的回调，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：   
> 
    {
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }   

例如：
    
    //读取预置的本地文件内容
    appcan.file.readLocalFile(function(err,data,dataType,optId){
        if(err){
            //读取内容出错了
            return;
        }
        //data就是文件的内容
        
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.readLocalFile(function(err,data,dataType,optId){
        if(err){
            //读取内容出错了
            return;
        }
        //data就是文件的内容
        
    });

###appcan.file.getRealPath(filePath,callback)
获取给定路径的真实路径     
`filePath`:要获取真实路径的路径    
`callback(err,data,dataType,optId)`:获取文件后的回调函数，第一个参数是`Error`对象如果为空则表示
没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：   
> 
    {
        filePath:'',
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }   

例如：
    
    //读取预置的本地文件内容
    appcan.file.getRealPath('wgt://a.txt'function(err,data,dataType,optId){
        if(err){
            //读取内容出错了
            return;
        }
        //data就是真实路径
        
    });
    //另外一种使用方式
    var file = appcan.require('file');
    file.getRealPath('wgt://a.txt'function(err,data,dataType,optId){
        if(err){
            //读取内容出错了
            return;
        }
        //data就是真实路径
        
    });


##appcan locStorage 存储模块
这个模块是关于存储的封装，`local`是对本地存储的封装`localStorage`   

###appcan.locStorage.getVal(key)
获取`key`保存在`localStorage`中对应的值    
`key`:要获取值的键值    

例如
    
    //获取保存的color
    appcan.locStorage.getVal('color');//返回保存的颜色值
    //另外一种使用方式
    var locSotrage = appcan.require('locStorage');
    locStorage.getVal('color');
     

###appcan.locStorage.setVal(key,val)
要设置的键值对    
`key`:要保存的键，`key`如果是数组，就会把数组中每个键值对都保存起来，如果是对象则会把对象里面每个键值对都保存起来   
`val`:要保存对应的值   

例如：

    //设置一个color到本地存储中
    appcan.locStorage.setVal('color','red');
    //另外一种使用方式
    var locSotrage = appcan.require('locStorage');
    locStorage.setVal('color','red');

###appcan.locStorage.remove(key)
清除`localStorage`中对应的值    
`key`:要清除值的健名，_**如果为空会清空整个存储**_  

例如

    //清除保存的颜色值
    appcan.locStorage.remove('color');
    //另外一种使用方式
    var locSotrage = appcan.require('locStorage');
    locStorage.remove('color');

###appcan.locStorage.keys()
获取`localStorage`中，保存的所有键值   

例如：
    
    //获取保存在localStorage中所有的key
    var keys = appcan.locStorage.keys();//返回值是数组，包含所有的key
    //另外一种使用方式
    var locSotrage = appcan.require('locStorage');
    var keys = locStorage.keys();
    
    
###appcan.locStorage.val(key,value)
获取或者设置`localStorage`的值   
`key`:要包括的键值    
`value`:要保存的内容,如果该值不设置可以则返回`key`对应的保存的值     

例如：
    
    //获取保存在localStorage中所有的key
    var value = appcan.locStorage.val('k');//返回值是数组，包含所有的key
    //另外一种使用方式
    var locSotrage = appcan.require('locStorage');
    var value = locStorage.val('k');

    
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

##appcan string 模块
该模块对基本的`String`能力进行了扩展

###appcan.trim(str)
去除字符串两端的空白字符    
`str`:要去除空白字符的字符串   
返回去除完字符串的结果   

例如：
    
    //去除字符串两端的空格
    appcan.trim(' a ');//返回'a'没有任何空格

###appcan.trimLeft(str)
去除字符左侧的空白字符   
`str`:要去除空白字符的字符串  
返回去除完空白字符的字符串    

例如：
    
    //去除字符串两端的空格
    appcan.trim(' a ');//返回'a '左边空格去掉

###appcan.trimRight(str)  
去除字符右侧的空白字符   
`str`:要去除空白字符的字符串  
返回去除完空白字符的字符串   

例如：
    
    //去除字符串两端的空格
    appcan.trim(' a ');//返回' a'右边空格去掉

###appcan.byteLength(str)
获取字符串的字节长度   
`str`:要获取字节长的字符串    
返回当前字符串的字节长度   

例如：
    
    //获取一个字符串长度，中文字符按照实际位长计算
    appcan.byteLength('a啊');//返回4
    appcan.byteLength('aa');//返回2
    
    
##appcan view 视图模块
这是appcan的视图模块，其中目前实现的是模板    

###appcan.view.template(template,options)
根据给定的字符串返回一个模板对象    
`template`:模板字符串   
`options`:模板的设置选项，比如你想配置输出块    

    {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,   
        escape      : /<%-([\s\S]+?)%>/g    
    } 

例如：
    
    //获取一个模板对象
    var tp = appcan.view.template('<%=a%>');//返回一个简单的模板对象
    //另外一种使用方式
    var view = appcan.require('view');
    var tp = view.template('<%=a%>');

###appcan.view.render(selector,template,data,options)
把通过模板生成好的数据，填充到指定的元素中   
`selector`:css3选择器，选中对应的元素   
`template`:对应的模板数据    
`data`:要渲染的数据源    
`options`:模板的设置选项，比如你想配置输出块    

    {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,   
        escape      : /<%-([\s\S]+?)%>/g    
    } 

例如：
    
    //把根据模板生成的内容放到指定的元素内
    appcan.view.render('#todo','<%=c%>',{c:'todo'});
    //另外一种使用方式
    var view = appcan.require('view');
    view.render('#todo','<%=c%>',{c:'todo'});
    

###appcan.view.appendRender(selector,template,data,options)
把通过模板生成好的数据，附加到指定的元素中   
`selector`:css3选择器，选中对应的元素   
`template`:对应的模板数据    
`data`:要渲染的数据源    
`options`:模板的设置选项，比如你想配置输出块    

    {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,   
        escape      : /<%-([\s\S]+?)%>/g    
    } 

例如：
    
    //把根据模板生成的内容附加到指定的元素上
    appcan.view.render('#todo','<%=c%>',{c:'todo1'});
    //另外一种使用方式
    var view = appcan.require('view');
    view.render('#todo','<%=c%>',{c:'todo1'});


###appcan.view.config(options)
配置模板信息   
`options`:模板的设置选项，比如你想配置输出块    

    {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,   
        escape      : /<%-([\s\S]+?)%>/g    
    } 

例如：
    
    //配置模板的匹配参数
    appcan.view.config({
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<${([\s\S]+?)}$/g,   
        escape      : /<%-([\s\S]+?)%>/g    
    });
    //另外一种使用方式
    var view = appcan.require('view');
    view.config({
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<${([\s\S]+?)}$/g,   
        escape      : /<%-([\s\S]+?)%>/g    
    });

##appcan window 窗口模块 
appcan是多窗口的，该模块封装了关于窗口的基础操作   

###appcan.window.open(name,data,aniId,type,dataType,width,height,animDuration)
打开一个新的窗口  
`name`:新窗口的的名称，如果窗口存在直接打开，如果不存在先创建然后打开   
`data`:新窗口填充的数据   
`dataType`:新窗口填充的数据类型   
> 1. `0`: url  
> 2. `1`: html 数据   
> 3. `2`: html 和 url 混合数据   

`aniId`:动画类型Id    
> 1. `0`：无动画
> 2. `1`: 从左向右推入
> 3. `2`: 从右向左推入
> 4. `3`: 从上向下推入
> 5. `4`: 从下向上推入
> 6. `5`: 淡入淡出
> 7. `6`: 左翻页
> 8. `7`: 右翻页
> 9. `8`: 水波纹
> 10. `9`: 由左向右切入
> 11. `10`: 由右向左切入
> 12. `11`: 由上先下切入
> 13. `12`: 由下向上切入

> 14. `13`: 由左向右切出
> 15. `14`: 由右向左切出
> 16. `15`: 由上向下切出
> 17. `16`: 由下向上切出   

`type`:窗口类型   
> 1. `0`: 普通窗口
> 2. `1`: OAuth 窗口
> 3. `2`: 加密页面窗口
> 4. `4`: 强制刷新
> 5. `8`: url用系统浏览器打开
> 6. `16`: view不透明
> 7. `32`: 隐藏的winwdow
> 8. `64`: 等待popOver加载完毕后显示
> 9. `128`: 支持手势
> 10. `256`: 标记opn的window上一个window不隐藏
> 11. `512`: 标记呗open的浮动窗口用友打开wabapp  

`width`:要打开的窗口的宽   
`height`:要打开的窗口的高   
`animDuration`:动画执行时间    

> 参数还可以以对象的形式传参：   

>       {     
        name:"",    
        data:"",
        dataType:"",
        aniId:"",
        type:"",
        width:"",
        height:"",
        animDuration:""
    }   

例如：
    
    //打开一个新demo窗口,并加载appcan.cn页面
    appcan.window.open({
        name:'demo',
        dataType:0,
        data:'http://appcan.cn'
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.open({
        name:'demo',
        dataType:0,
        data:'http://appcan.cn'
    });

###appcan.window.close(aniId,animDuration)
关闭当前窗口    
`aniId`:动画类型Id    
> 1. `0`：无动画
> 2. `1`: 从左向右推入
> 3. `2`: 从右向左推入
> 4. `3`: 从上向下推入
> 5. `4`: 从下向上推入
> 6. `5`: 淡入淡出
> 7. `6`: 左翻页
> 8. `7`: 右翻页
> 9. `8`: 水波纹
> 10. `9`: 由左向右切入
> 11. `10`: 由右向左切入
> 12. `11`: 由上先下切入
> 13. `12`: 由下向上切入

> 14. `13`: 由左向右切出
> 15. `14`: 由右向左切出
> 16. `15`: 由上向下切出
> 17. `16`: 由下向上切出  

`animDuration`:动画持续时间   

> 参数还可以以对象的形式传参：   

> 
    {
        aniId:"",
        animDuration:""
    }   

例如：
    
    //关闭当前窗口
    appcan.window.close({
        aniId:17,
        animDuration:1000
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.close({
        aniId:17,
        animDuration:1000
    });
    

###appcan.window.evaluateScript(name,content,type)
在指定的窗口脚本执行   
`name`:要执行脚本的窗口名称    
`content`:要执行的脚本   
`type`:窗口类型

> 参数还可以以对象的形式传参：   

>     {
        name:'',
        content:'',
        type:''
    }   

例如：
    
    //在demo窗口执行脚本
    appcan.window.evaluateScript({
        name:'demo',
        content:'alert("hello world")'
    });
    //另一种使用方式
    var win = appcan.require('window');
    win.evaluateScript({
        name:'demo',
        content:'alert("hello world")'
    });

###appcan.window.evaluatePopoverScript(name,popName,content)
在指定的浮动窗口内执行响应的脚本    
`name`:要执行脚本的窗口名称    
`popName`:要执行的浮动窗口的名称   
`content`:要执行的脚本内容    

> 参数还可以以对象的形式传参：   

>     {
        name:'',
        popName:'',
        content:''
    }

例如：
    
    //在demo窗口的浮动窗口执行脚本
    appcan.window.evaluatePopoverScript({
        name:'demo',
        popName:'demoPop',
        content:'alert("hello world")'
    });
    //另一种使用方式
    var win = appcan.require('window');
    win.evaluatePopoverScript({
        name:'demo',
        popName:'demoPop',
        content:'alert("hello world")'
    });

###appcan.window.setBounce(bounceType,downEndCall,upEndCall,color,imgSettings)
设置上下弹动效果     
`bonceType`:弹动的类型   
> 1. `0`: 无任何效果
> 2. `1`: 颜色弹动效果
> 3. `2`: 设置图片弹动

`downEndCall`:当弹动类型设置为下边界弹动时，如果页面到了下边界则会触发该回调    
`upEndCall`:当弹动类型设置为上边界弹动时，如果页面到了上边界则会触发该回调   
`color`:如果超过了该边界显示的背景颜色    
`imgSettings`:如果超过了该边界，并且想要设置显示的内容包括图片文字则设置该参数   

>关于imgSettings的设定的实例: 
>  
>     {
        "imagePath":"res://reload.png",
        "textColor":"#530606",
        "pullToReloadText":"拖动刷新",
        "releaseToReloadText":"释放刷新",
        "loadingText":"加载中，请稍等"
    }
>

> 参数还可以以对象的形式传参：   

>     {
        bounceType:'',
        downEndCall:function(){
            //do somethings
        },
        upEndCall:function(){
            //do somethings
        },
        color:'',
        imgSettings:{}
    }

例如：
    
    //给页面天加一个简单的弹动效果
    appcan.window.setBounce({
        bonceType:'1',
        color:'#F00',
        upEndCall:function(status,type){
            if(status ==1 ){
                //超过边界了
            }
        }
    });
    //另一种使用方式
    var win = appcan.require('window');
    win.setBounce({
        bonceType:'1',
        color:'#F00',
        upEndCall:function(status,type){
            if(status ==1 ){
                //超过边界了
            }
        }
    });

###appcan.window.enableBounce()
开启页面弹动效果，如果调用该方法，则该`webView`具有弹动效果   

例如：
    
    //开启页面弹动效果
    appcan.window.enableBounce()
    //另一种使用方式
    var win = appcan.require('window');
    win.enableBounce()

###appcan.window.disableBounce()
禁用页面弹动效果，如果调用该方法，则该`webView`不具有弹动效果    

例如
    
    //禁用页面弹动效果
    appcan.window.disableBounce();//禁用页面弹动效果
    //另一种使用方式
    var win = appcan.require('window');
    win.disableBounce();
    
###appcan.window.setBounceType(type,color,flag,callback)
设置页面弹动类型，_**前提是开启`webView`的弹动设置，如果没有开启调用了该方法则会默认开启页面弹动效果**_   

`type`:页面的弹动类型   
> 1. `0`: 无任何效果
> 2. `1`: 颜色弹动效果
> 3. `2`: 设置图片弹动

`color`:设置弹动结果的背景颜色    
`flag`:是否显示内容,`1`:显示内容，`0`:不显示内容    
`callback(status,type)`:当设置成功后，如果滑动超过了弹动的边界，则会触发该回调，`status`:
当`type=0`时，值`0`为向下拉，`1`为超越边界，`2`为向上返回到最初状态；当`type=1`时，`0`为向上拉，`1`为超越边界，`2`为向下返回到最初状态。 
`type`跟传入的参数`type`一致    

> 参数还可以以对象的形式传参：   

>     {
        type:'',
        callback:function(status,type){
            //do somethings
        },
        flag:'',
        color:''
    }

例如：
    
    //设置上边弹动
    appcan.window.setBounceType({
        type:1,
        flag:1,
        color:'#F00',
        callback:function(status,type){
            if(stats == 1){
                //超过边界了
            }
        }
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.setBounceType({
        type:1,
        flag:1,
        color:'#F00',
        callback:function(status,type){
            if(stats == 1){
                //超过边界了
            }
        }
    });

###appcan.window.setBounceParams(position,data)
设置对应弹动显示的内容   
`position`:页面的弹动位置   
> 1. `0`: 顶端
> 2. `1`: 底部   

`data`:超过页面边界显示的内容    
>关于data设置的实例：
>  
>     {
        "imagePath":"res://reload.png",
        "textColor":"#530606",
        "pullToReloadText":"拖动刷新",
        "releaseToReloadText":"释放刷新",
        "loadingText":"加载中，请稍等"
    }
>

> 参数还可以以对象的形式传参：

>     {
        position:'',
        data:{}
    }

例如：
    
    //设置参数
    appcan.window.setBounceParams({
        position:2,
        data:{
            "imagePath":"res://reload.png",
            "textColor":"#530606",
            "pullToReloadText":"拖动刷新",
            "releaseToReloadText":"释放刷新",
            "loadingText":"加载中，请稍等"
        }
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.setBounceParams({
        position:2,
        data:{
            "imagePath":"res://reload.png",
            "textColor":"#530606",
            "pullToReloadText":"拖动刷新",
            "releaseToReloadText":"释放刷新",
            "loadingText":"加载中，请稍等"
        }
    });

###appcan.window.resetBounceView(position)
恢复默认弹动    
`position`:页面的弹动位置   
> 1. `0`: 顶端
> 2. `1`: 底部   


> 参数还可以以对象的形式传参：

>     {
        position:''
    }
    
例如：
    
    //重置顶部效果
    appcan.window.resetBounceView(0)
    //另外一种使用方式
    var win = appcan.require('window');
    win.resetBounceView(0)

###appcan.window.openToast(msg,duration,position,type)
打开一个`toast`浮动窗口   
`msg`:toast要显示的内容    
`duration`:toast显示的时间   
`position`:toast显示在屏幕中的位置  

> 1. `1`: left_top 左上
> 2. `2`: top 上中
> 3. `3`: right_top 右上
> 4. `4`: left 左中
> 5. `5`: middle 中间
> 6. `6`: right 右中
> 7. `7`: bottom_left 下左
> 8. `8`: bottom 下中
> 9. `9`: right_bottom 右中 
   
`type`:toast的类型   

> 1. `0`: 没有进度条
> 2. `1`: 有进度条

> 参数还可以以对象的形式传参：

>     {
        msg:'',
        duration:'',
        position:'',
        type:''
    }

例如
    
    //打开一个没有弹出框的toast
    appcan.window.openToast({
        msg:'toast',
        duration:1000,
        position:9,
        type:0
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.openToast({
        msg:'toast',
        duration:1000,
        position:9,
        type:0
    });
    


###appcan.window.closeToast()
关闭现在显示的`toast`    

例如：
    
    //关闭当前页面的toast
    appcan.window.closeToast();
    //另外一种使用方式
    var win = appcan.requrie('window');
    win.closeToast();

###appcan.window.moveAnim(left,top,callback,duration)
以动画的形式，移动浮动窗口    
`left`:距离左边的位置   
`top`:距离上边的位置  
`callback`:动画移动完成后的回调函数    
`duration`:动画持续的时间     

> 参数还可以以对象的形式传参：

>     {
        left:'',
        top:'',
        callback:function(){
            //do somethings
        },
        duration:''
    }

例如：
    
    //把浮动窗口移动到指定的位置
    appcan.window.moveAnim({
        left:10，
        top:10,
        callback:functin(){
            //动画完成
        }
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.moveAnim({
        left:10，
        top:10,
        callback:functin(){
            //动画完成
        }
    });
    

###appcan.window.openPopover(name,dataType,url,data,left,top,width,height,fontSize,type,bottomMargin)
打开一个弹出框，如果不存在则会先创建然后再打开，如果存在则直接打开   
`name`:要打开浮动窗口的名称   
`dataType`:新窗口填充的数据类型   
> 1. `0`: url  
> 2. `1`: html 数据   
> 3. `2`: html 和 url 混合数据   

`url`:弹出框要加载的页面的地址   
`data`:弹出框要价值的数据内容   
`left`:弹出框距离左边的距离   
`top`:弹出框距离上边的距离    
`width`:弹出框的宽度     
`height`:弹出框的高度    
`fontSize`:页面基础的字体大小   
`type`:窗口类型   
> 1. `0`: 普通窗口
> 2. `1`: OAuth 窗口
> 3. `2`: 加密页面窗口
> 4. `4`: 强制刷新
> 5. `8`: url用系统浏览器打开
> 6. `16`: view不透明
> 7. `32`: 隐藏的winwdow
> 8. `64`: 等待popOver加载完毕后显示
> 9. `128`: 支持手势
> 10. `256`: 标记opn的window上一个window不隐藏
> 11. `512`: 标记呗open的浮动窗口用友打开wabapp  

`bottomMargin`:浮动窗口相对父窗口底部的距离。为空或0时，默认为0。当值不等于0时，inHeight参数无效

&nbsp;

> 参数还可以以对象的形式传参：

>     {
        name:'',
        dataType:'',
        url:'',
        data:'',
        left:'',
        top:'',
        width:'',
        height:'',
        fontSize:'',
        type:'',
        bottomMargin:''
    }

例如：
    
    //弹出一个简单的demo窗口,并打开appcan.cn
    appcan.window.openPopover({
        name:'demo',
        dataType:0,
        url:'http://appcan.cn',
        top:100,
        left:100,
        width:100,
        height:100,
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.openPopover({
        name:'demo',
        dataType:0,
        url:'http://appcan.cn',
        top:100,
        left:100,
        width:100,
        height:100,
    });
    

###appcan.window.closePopover(name)
关闭指定的浮动窗口   
`name`:浮动窗口的名字    

> 参数还可以以对象的形式传参：

>     {
        name:''
    }

例如：
    
    //关闭demo浮动窗口
    appcan.window.closePopover('demo');
    //另外一种使用方式
    var win = appcan.require('win');
    win.closePopover('demo');

###appcan.window.resizePopover(name,left,top,width,height)
重置指定浮动窗口的大小、位置    
`name`:要重置的浮动窗口的名称   
`left`:要重置浮动窗口距离左边的距离    
`top`:要重置的浮动窗口距离上边的距离   
`width`:要重置的浮动窗口的宽度    
`height`:要充值浮动窗口的高度    

> 参数还可以以对象的形式传参：

>     {
        name:'',
        left:'',
        top:'',
        width:'',
        height:''
    }

例如：
    
    //修改demo弹出框的位置
    appcan.window.resizePopover({
        name:'demo',
        left:100,
        top:100,
        width:102,
        height:102
    })
    //另外一种使用方式
    var win = appcan.require('window');
    win.resizePopover({
        name:'demo',
        left:100,
        top:100,
        width:102,
        height:102
    })

###appcan.window.alert(title,content,buttons,callback)
弹出一个确认浮动窗口,如果只有一个按钮弹出是警告框，如果是一个以上的按钮弹出的是提示框   
`title`:弹出框的标题    
`content`:弹出框的内容   
`buttons`:弹出框的按钮列表最多是三个   
`callback(err,data,dataType,optId)`:当点击了其中一个按钮后的回调，
第一个参数是`Error`对象如果为空则表示没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>     {
        title:'',
        content:'',
        buttons:[],
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }

例如：
    
    //打开一个提示框 
    appcan.window.alert({
        title:'提示',
        content:'小提示',
        buttons:'确定'
    });
    //另外一种使用方式
    var win = appcan.require('window'); 
    win.alert({
        title:'提示',
        content:'小提示',
        buttons:'确定'
    });
    

###appcan.window.confirm(title,content,buttons,callback)
弹出一个提示框   
`title`:弹出框的标题    
`content`:弹出框的内容   
`buttons`:弹出框的按钮列表最多是三个   
`callback(err,data,dataType,optId)`:当点击了其中一个按钮后的回调，
第一个参数是`Error`对象如果为空则表示没有错误，否则表示操作出错了，`data`表示返回的操作结果,`dataType`操作结果的数据类型，`optId`该操作id    

> 参数还可以以对象的形式传参：

>     {
        title:'',
        content:'',
        buttons:[],
        callback:function(err,data,dataType,optId){
            //do somethings
        }
    }

例如：
    
    //打开一个确认框 
    appcan.window.confirm({
        title:'提示',
        content:'小提示',
        buttons:['确定','取消'],
        callback:function(err,data,dataType,optId){
            if(err){
                //如果出错了
                return;
            }
            //data 按照按钮的索引返回值
        }
    });
    //另外一种使用方式
    var win = appcan.require('window'); 
    win.confirm({
        title:'提示',
        content:'小提示',
        buttons:['确定','取消'],
        callback:function(err,data,dataType,optId){
            if(err){
                //如果出错了
                return;
            }
            //data 按照按钮的索引返回值
        }
    });
    
###appcan.window.bringPopoverToFront(name)
把指定的浮动窗口设置为最上层   
`name`:要设置的弹出层的名称   

> 参数还可以以对象的形式传参：

>     {
        name:''
    }

例如：
    
    //把demo窗口显示到所有窗口最上面
    appcan.window.bringPopoverToFront('demo');
    //另外一种使用方式
    var win = appcan.require('window'); 
    win.bringPopoverToFront('demo');

###appcan.window.popoverElement(id,url,left,top,name)
根据给定元素的样式弹出样式相似的浮动窗口   
`id`:指定元素的Id   
`url`:要加载到浮动窗口中的地址  
`left`:距离做边界的距离   
`top`:距离上边界的距离   
`name`:浮动窗口的名称，_**如果id没有指定的话用name，否则用id**_   

> 参数还可以以对象的形式传参：

>     {
        id:'',
        url:'',
        left:'',
        top:'',
        name:''
    }

例如：
    
    //根据指定的元素打开弹出框,并打开appcan.cn
    appcan.window.popoverElement({
        id:'container',
        url:'http://appcan.cn',
        top:'100',
        left:100
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.popoverElement({
        id:'container',
        url:'http://appcan.cn',
        top:'100',
        left:100
    });

###appcan.window.resizePopoverByEle(id,left,top,name)
设置指定的浮动窗口回复到指定窗口的大小，并设置浮动窗口的位置   
`id`:指定的元素，根据该元素设置浮动窗口的大小   
`left`:浮动窗口距离做边界的距离   
`top`:浮动窗口距离上边界的距离  
`name`:要设置的浮动窗口的名称，_**如果id没有传值的话使用这个值**_

> 参数还可以以对象的形式传参：

>     {
        id:'',
        left:'',
        top:'',
        name:''
    }

例如：
    
    //重置demo窗口,位置
    appcan.window.popoverElement({
        id:'container',
        left:100,
        top:100
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.popoverElement({
        id:'container',
        left:100,
        top:100
    });
    
###appcan.window.openMultiPopover(popName,content,dataType, left, top, width, height, fontSize, flag, indexSelected)
打开多页面浮动窗口   
`popName`:打开新窗口的名称   
`content`:要传入的数据，一个json对象，或者json字符串，结构必须为`{'content':[{"inPageName":"p1", "inUrl":"xxx1.html","inData":""}]}`
其中：inPageName:所包含的单页面窗口的名字，inUrl：url类型数据，inData：窗口的内容的二进制数据，可为空    
`dataType`:窗口载入的数据的类型，0：url方式载入；1：html内容 方式载入；2：既有url方式，又有html内容方式    
`left`:距离左边界的距离   
`top`:距离上边界的距离  
`width`:窗口的宽   
`height`:窗口的高   
`fontSize`:字体的大小  
`flag`:窗口类型  
> 1. `0`: 普通窗口
> 2. `1`: OAuth 窗口
> 3. `2`: 加密页面窗口
> 4. `4`: 强制刷新
> 5. `8`: url用系统浏览器打开
> 6. `16`: view不透明
> 7. `32`: 隐藏的winwdow
> 8. `64`: 等待popOver加载完毕后显示
> 9. `128`: 支持手势
> 10. `256`: 标记opn的window上一个window不隐藏
> 11. `512`: 标记呗open的浮动窗口用友打开wabapp  

`indexSelected`:默认显示的索引项，默认显示第一项    

> 参数还可以以对象的形式传参：   

>     {
        popName:'',
        content:'',
        dataType:'',
        left:'',
        top:'',
        width:'',
        height:'',
        fontSize:'',
        flag:'',
        indexSelected:''
    }
    
    

例如：
    
    //打开一个四个窗口的弹出框
    appcan.window.openMultiPopover({
        popName:'nav',
        content:{
            content:[{
                inPageName:'p1',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p2',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p3',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p4',
                inUrl:'http://www.appcan.cn',
                inData:''
            }]
        },
        height:500,
        dataType:0,
        indexSelected:2
    });
    //另外一种使用方式
    var win = appcan.require('window');
    win.openMultiPopover({
        popName:'nav',
        content:{
            content:[{
                inPageName:'p1',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p2',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p3',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p4',
                inUrl:'http://www.appcan.cn',
                inData:''
            }]
        },
        height:500,
        dataType:0,
        indexSelected:2
    });
    
###appcan.window.closeMultiPopover(popName)
关闭多页面浮动窗口    
`popName`:多页面窗口的名称   

> 参数还可以以对象的形式传参：   

>     {
        popName:''
    }

例如：
    
    //关闭指定的多页面浮动窗口
    appcan.window.closeMultiPopover('nav');
    //另外一种使用方式
    var win = appcan.require('window');
    win.closeMultiPopover('nav');
    

###appcan.window.selectMultiPopover(popName,index)
设置多页面浮动窗口跳转到的子页面窗口的索引   
`popName`:要设置的多页面浮动窗口的名称    
`index`:要设置的多页面浮动窗口页面的索引    

> 参数还可以以对象的形式传参：   

>     {
        popName:'',
        index:''
    }

例如：
    
    //选择第三个页面
    appcan.window.selectMultiPopover('nav',2);
    //另外一种使用方式
    var win = appcan.require('window');
    win.selectMultiPopover('nav',2);
    
    
    

##appcan frame 浮动窗口模块
封装相关浮动窗口的基础操作

###appcan.frame.open(name,dataType,url,data,left,top,width,height,fontSize,type,bottomMargin)
打开一个浮动窗口，如果不存在则会先创建然后再打开，如果存在则直接打开   
`name`:要打开浮动窗口的名称   
`dataType`:新窗口填充的数据类型   
> 1. `0`: url  
> 2. `1`: html 数据   
> 3. `2`: html 和 url 混合数据   

`url`:浮动窗口要加载的页面的地址   
`data`:浮动窗口要价值的数据内容   
`left`:浮动窗口距离左边的距离   
`top`:浮动窗口距离上边的距离    
`width`:浮动窗口的宽度     
`height`:浮动窗口的高度    
`fontSize`:页面基础的字体大小   
`type`:窗口类型   
> 1. `0`: 普通窗口
> 2. `1`: OAuth 窗口
> 3. `2`: 加密页面窗口
> 4. `4`: 强制刷新
> 5. `8`: url用系统浏览器打开
> 6. `16`: view不透明
> 7. `32`: 隐藏的winwdow
> 8. `64`: 等待popOver加载完毕后显示
> 9. `128`: 支持手势
> 10. `256`: 标记opn的window上一个window不隐藏
> 11. `512`: 标记呗open的浮动窗口用友打开wabapp  

`bottomMargin`:浮动窗口相对父窗口底部的距离。为空或0时，默认为0。当值不等于0时，inHeight参数无效

&nbsp;

> 参数还可以以对象的形式传参：

>     {
        name:'',
        dataType:'',
        url:'',
        data:'',
        left:'',
        top:'',
        width:'',
        height:'',
        fontSize:'',
        type:'',
        bottomMargin:''
    }

例如：
    
    //弹出一个简单的demo浮动窗口,并打开appcan.cn
    appcan.frame.open({
        name:'demo',
        dataType:0,
        url:'http://appcan.cn',
        top:100,
        left:100,
        width:100,
        height:100,
    });
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.open({
        name:'demo',
        dataType:0,
        url:'http://appcan.cn',
        top:100,
        left:100,
        width:100,
        height:100,
    });
    

###appcan.frame.close(name)
关闭指定的浮动窗口   
`name`:浮动窗口的名字    

> 参数还可以以对象的形式传参：

>     {
        name:''
    }

例如：
    
    //关闭demo浮动窗口
    appcan.frame.close('demo');
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.close('demo');
    
    
###appcan.frame.resize(name,left,top,width,height)
重置指定浮动窗口的大小、位置    
`name`:要重置的浮动窗口的名称   
`left`:要重置浮动窗口距离左边的距离    
`top`:要重置的浮动窗口距离上边的距离   
`width`:要重置的浮动窗口的宽度    
`height`:要充值浮动窗口的高度    

> 参数还可以以对象的形式传参：

>     {
        name:'',
        left:'',
        top:'',
        width:'',
        height:''
    }

例如：
    
    //修改demo浮动窗口的位置
    appcan.frame.resize({
        name:'demo',
        left:100,
        top:100,
        width:102,
        height:102
    })
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.resize({
        name:'demo',
        left:100,
        top:100,
        width:102,
        height:102
    })
    
    
###appcan.frame.bringToFront(name)
把指定的浮动窗口设置为最上层   
`name`:要设置的弹出层的名称   

> 参数还可以以对象的形式传参：

>     {
        name:''
    }

例如：
    
    //把demo窗口显示到所有窗口最上面
    appcan.frame.bringToFront('demo');
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.bringToFront('demo');


###appcan.frame.evaluateScript(name,popName,content)
在指定的浮动窗口内执行响应的脚本    
`name`:要执行脚本的窗口名称    
`popName`:要执行的浮动窗口的名称   
`content`:要执行的脚本内容    

> 参数还可以以对象的形式传参：   

>     {
        name:'',
        popName:'',
        content:''
    }

例如：
    
    //在demo窗口的浮动窗口执行脚本
    appcan.frame.evaluateScript({
        name:'demo',
        popName:'demoPop',
        content:'alert("hello world")'
    });
    
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.evaluateScript({
        name:'demo',
        popName:'demoPop',
        content:'alert("hello world")'
    });

###appcan.frame.openMulti(popName,content,dataType, left, top, width, height, fontSize, flag, indexSelected)
打开多页面浮动窗口   
`popName`:打开新窗口的名称   
`content`:要传入的数据，一个json对象，或者json字符串，结构必须为`{'content':[{"inPageName":"p1", "inUrl":"xxx1.html","inData":""}]}`
其中：inPageName:所包含的单页面窗口的名字，inUrl：url类型数据，inData：窗口的内容的二进制数据，可为空    
`dataType`:窗口载入的数据的类型，0：url方式载入；1：html内容 方式载入；2：既有url方式，又有html内容方式    
`left`:距离左边界的距离   
`top`:距离上边界的距离  
`width`:窗口的宽   
`height`:窗口的高   
`fontSize`:字体的大小  
`flag`:窗口类型  
> 1. `0`: 普通窗口
> 2. `1`: OAuth 窗口
> 3. `2`: 加密页面窗口
> 4. `4`: 强制刷新
> 5. `8`: url用系统浏览器打开
> 6. `16`: view不透明
> 7. `32`: 隐藏的winwdow
> 8. `64`: 等待popOver加载完毕后显示
> 9. `128`: 支持手势
> 10. `256`: 标记opn的window上一个window不隐藏
> 11. `512`: 标记呗open的浮动窗口用友打开wabapp  

`indexSelected`:默认显示的索引项，默认显示第一项    

> 参数还可以以对象的形式传参：   

>     {
        popName:'',
        content:'',
        dataType:'',
        left:'',
        top:'',
        width:'',
        height:'',
        fontSize:'',
        flag:'',
        indexSelected:''
    }
    
    

例如：
    
    //打开一个四个窗口的浮动窗口
    appcan.frame.openMulti({
        popName:'nav',
        content:{
            content:[{
                inPageName:'p1',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p2',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p3',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p4',
                inUrl:'http://www.appcan.cn',
                inData:''
            }]
        },
        height:500,
        dataType:0,
        indexSelected:2
    });
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.openMulti({
        popName:'nav',
        content:{
            content:[{
                inPageName:'p1',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p2',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p3',
                inUrl:'http://www.appcan.cn',
                inData:''
            },{
                inPageName:'p4',
                inUrl:'http://www.appcan.cn',
                inData:''
            }]
        },
        height:500,
        dataType:0,
        indexSelected:2
    });
    
###appcan.frame.closeMulti(popName)
关闭多页面浮动窗口    
`popName`:多页面窗口的名称   

> 参数还可以以对象的形式传参：   

>     {
        popName:''
    }

例如：
    
    //关闭指定的多页面浮动窗口
    appcan.frame.closeMulti('nav');
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.closeMulti('nav');
    

###appcan.frame.selectMulti(popName,index)
设置多页面浮动窗口跳转到的子页面窗口的索引   
`popName`:要设置的多页面浮动窗口的名称    
`index`:要设置的多页面浮动窗口页面的索引    

> 参数还可以以对象的形式传参：   

>     {
        popName:'',
        index:''
    }

例如：
    
    //选择第三个页面
    appcan.frame.selectMulti('nav',2);
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.selectMulti('nav',2);
    
    

