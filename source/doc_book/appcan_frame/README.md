# appcan_frame 浮动窗口模块

##appcan frame 浮动窗口模块
封装相关浮动窗口的基础操作

###appcan.frame.open(id,url,left,top,name,index,change)
打开一个浮动窗口，如果不存在则会先创建然后再打开，如果存在则直接打开,如会在页面中查找id的元素，把id元素的宽高指定为浮动窗口的宽高，把id元素的font-size设置为id元素的font-size

`id`:要打开浮动窗口的名称   
`url`:浮动窗口要加载的页面的地址,如果url是一个数组则打开多页面浮动窗口   
`left`:浮动窗口距离左边的距离   
`top`:浮动窗口距离上边的距离  
`name`:强制改变打开窗口的名称    
`index`:设置选中的多页面窗口的默认索引   
`change`:如果多页面浮动窗口改变时会触发该回调

&nbsp;

> 参数还可以以对象的形式传参：

>     {
        id:'',
        url:'',
        left:'',
        top:'',
        name:'',
        index:'',
        change:''
    }

例如：
    
    //弹出一个简单的demo浮动窗口,并打开appcan.cn
    appcan.frame.open({
        id:'content',
        url:'http://appcan.cn',
        top:100,
        left:100
    });
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.open({
        id:'content',
        url:'http://appcan.cn',
        top:100,
        left:100
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
    
    
###appcan.frame.resize(id,left,top,name)
根据指定的元素弹出一个跟这个元素样式相同的浮动窗口     
`id`:要重置的浮动窗口的名称   
`url`:弹出浮动窗口加载的url   
`left`:要重置浮动窗口距离左边的距离    
`top`:要重置的浮动窗口距离上边的距离   
`name`:要强制重载的浮动窗口名称    

> 参数还可以以对象的形式传参：

>     {
        id:'',
        url:'',
        left:'',
        top:'',
        name:''
    }

例如：
    
    //修改demo浮动窗口的位置
    appcan.frame.resize({
        id:'content',
        url:'http://appcan.cn'
        left:100,
        top:100
    })
    //另外一种使用方式
    var frame = appcan.require('frame');
    frame.resize({
        id:'content',
        url:'http://appcan.cn'
        left:100,
        top:100
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
    
    
    
