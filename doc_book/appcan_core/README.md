# appcan_core

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
    
    
    