# appcan_plugin 插件


appcan 提供了一些常用的插件，这些插件，能快速解决一些常用问题，这些插件都是基于appcanlib 开发的，
对这些插件进行说明。

##appcan.touch(class,callback)
该方法首先提供了简单，`touchstart`、`touchend`事件的时候添加移除相应的`class`类名，来实现触摸反馈，
然后在点击完成的时候执行`callback`,回调函数，兼容`click`事件。如果是浏览器上则会用`mousedown`、`mouseup`
代替touch事件    

`class`:要修改的类名，按下时添加，松手是移除   
`callback()`:参数参考正常的事件参数，第一个是`event`事件    

##appcan.elementFor(ele,callback)
点击与选择元素相关的元素，则设置该选择元素为选中   
`ele`:与选择元素相关的元素    
`callback`:设置完成后的回调    

##appcan.initFontsize()
初始化预先保存的字体大小   

##appcan.openPopoverByEle(eleId,url,left,top,name)
根据指定元素样式打开一个弹出层，并跳转到相应的页面   
`eleId`:指定元素的id   
`url`:要打开的页面地址    
`left`:新的弹出层距离左边界的距离   
`top`:新的弹出层页面距离上边界的距离   
`name`:打开的新弹出层的名称，_**如果name没有传值的话使用eleId**_

##appcan.resizePopoverByEle(id,left,top,name)
设置指定的弹出窗口回复到指定窗口的大小，并设置弹出窗的位置   
`id`:指定的元素，根据该元素设置弹出窗口的大小   
`left`:弹出窗口距离做边界的距离   
`top`:弹出窗口距离上边界的距离  
`name`:要设置的弹出窗口的名称，_**如果name没有传值的话使用id**_

> 参数还可以以对象的形式传参：

>     {
        id:'',
        left:'',
        top:'',
        name:''
    }

##appcan.tmpl(selector,template,data,options)
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


##appcan.tmplAppend(selector,template,data,options)
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

##appcan.openWinWithUrl(name,url,aniId,type,animDuration)
打开一个新窗口，并加载相应的url内容   
`name`:新窗口的名称   
`url`:要加载的页面的内容   
`aniId`:新窗口的动画id,参考文档`appcan.window.open()`   
`type`:要打开的窗口的类型,参考文档`appcan.window.open()`  
`animDuration`:窗口动画的持续时间    

##appcan.closeWin(animId)
以指定的动画关闭当前窗口   
`animId`:要执行关闭动画的id   

##appcan.closePopover(name)
关闭指定的弹出窗口   
`name`:弹出窗口的名字    

> 参数还可以以对象的形式传参：

>     {
        name:''
    }  

##appcan.setLocVal(key,val)
在本地存储中新增一个值   
`key`:要加到本地存储中的健   
`val`:要添加到本地存储的值   

##appcan.getLocVal(key)
获取已经保存到本地存储中的值   
`key`:要获取的对应值的健   

##appcan.execScriptInWin(name,scriptContent)
在指定的窗口中执行相对应的脚本    
`name`:要执行脚本的窗口名    
`scriptContent`:要执行的脚本的内容    

##appcan.bringPopoverToFront(name)
把指定的弹出框显示在最前面,当一个弹出窗被另一个覆盖了可以用这个方法让该窗口显示到最上面    
`name`:指定的弹出窗口的名称   

##appcan.initBounce()
如果用户下拉到窗口的最底部，或者最上部，使该窗口具有一个回弹反馈   

##appcan.evaluatePopoverScript(name,popName,content)
在指定的弹出窗内执行响应的脚本    
`name`:要执行脚本的窗口名称    
`popName`:要执行的弹出窗口的名称   
`content`:要执行的脚本内容    

> 参数还可以以对象的形式传参：   

>     {
        name:'',
        popName:'',
        content:''
    }

##appcan.alert(title,content,buttons,callback)
弹出一个确认弹出窗口,如果只有一个按钮弹出是警告框，如果是一个以上的按钮弹出的是提示框   
`title`:弹出框的标题    
`content`:弹出框的内容   
`buttons`:弹出框的按钮列表最多是三个   
`callback(err,data,dataType,optId)`:当点击了其中一个按钮后的回调，如果只有一个确定按钮则不执行回调函数
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

##appcan.getObjLength(obj)
获取给定对象的长度，如果是数组返回数组的长度如果是对象，返回对象中属性的个数   
`obj`:要获取长度的对象   


##appcan.getTempCallback(fnSource,template,callFlag,elseCallFlag,len)
获取指定模板中要执行的回调函数的引用名   
`fnSource`:包含回调函数的对象  
`template`:要查找的模板    
`callFlag`:要调用的回调的标识，例如:`first:`、`last:`   
`elseCallFlag`:要调用的回调的标识，例如:`first:`、`last:`   
`len`:等待拼装的json对象包含数据的条数

##appcan.temp(template,obj,index,len,cb)
对对象中的某条数据进行拼装
`template`:模版字符串
`obj`:等待拼装的json对象中的某一个对象
`index`:等待拼装的json对象中的某条数据的索引值
`len`:等待拼装的json对象包含数据的条数
`cb`:拼接每条数据时进入的回调方法，用来处理模板中包含${cb:键值}的字段，例：
回调方法function(obj, key){}
obj代表了当前拼接的条目的JSON对象
key代表设定的键值的解析，key[1]设定的键值

##appcan.tempRenderList(template,jsonObj,len,cb,scb)
多条数据拼装
`template`:模版字符串
`jsonObj`:等待拼装的json对象
`len`:等待拼装的json对象包含数据的条数
`cb`:拼接每条数据时进入的回调方法，用来处理模板中包含${cb:键值}的字段，例：
回调方法function(obj, key){}
obj代表了当前拼接的条目的JSON对象
b代表设定的键值的解析，b[1]设定的键值
`scb`:每条数据进入的回调方法，返回每条数据对象的内容和此条数据拼装后的内容，例：
回调方法function(type,a,obj){}
type代表返回的类型，值为0或1
a表示type为0时表示当前为第几条数据，type为1时表示当前这条数据对象拼装后的内容
obj代表了当前拼接的条目的JSON对象


##appcan.tempRender(template,jsonObj,cb)
单条数据拼装
`template`:模版字符串
`jsonObj`:等待拼装的json对象
`cb`:拼接每条数据时进入的回调方法，用来处理模板中包含${cb:键值}的字段，例：
回调方法function(obj, key){}
obj代表了当前拼接的条目的JSON对象
key代表设定的键值的解析，key[1]设定的键值

##appcan.stopPropagation(self)
阻止事件传播   
`seft`:当前函数执行的上下文

#appcan.toInt(str)
把字符串转换成数字  
`str`:要转换成数字的字符串  

##appcan.selectChange(id)
把该元素内选择框选择的值显示在响应的显示框内
`id`:整控件的父元素Id   

##appcan.fold(id)
设置该控件的打开，关闭功能
`id`:要设置开关闭的元素的id

##appcan.Slide(selector,dir,endFun,lock,transEnd)
界面随着手指的移动进行跟随，当松手时根据位移情况来进行平移变换，产生弹动的效果。
`selector`:此对象所属的滑块控件
`dir`:是纵向滑动(V)还是横向滑动(H)
`endFun`:手指滑动结束离开屏幕时的事件回调
`lock`:用来控制手指触摸事件是否继续分发给下层的DOM控件和浏览器，这里我们不需要进行控制，因此设定为false
`transEnd`:手指松开后，界面自动滑动完成分页切换后执行的回调函数。

