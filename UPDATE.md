--------
v 0.1.1


--------
v 0.1.2
修复 touch cancel 之后tap事件不触发bug    
修复 模拟器 selectMultiPopover bug    
更新版本号   
删除调试信息   

v 0.1.3
修复appcan.frame.open 元素默值，如果居左，居右没有值则使用元素本身的值
appcan.listview中添加id字段
解决switch导致的android2.3.4问题
appcan.slider.js添加自动播放功能
appcan.slider.js修复向下方滑动停止问题
appcan.slider.js添加change方法，滑动后的回调方法，可以获取当前的index

v 0.1.3.1 
appcan.slider.js fixed 上滑、下滑bug

appcan.control.js fixed ios 7 全屏bug

appcan.treeview.js 修复初始化treeview bug

v 0.1.3.2
appcan.js 新增 appcan.window.swipeRight 方法

appcan.js 新增 appcan.window.swipeLeft 方法

appcan.js 新增 appcan.frame.swipeRight 方法

appcan.js 新增 appcan.frame.swipeLeft 方法

v 0.1.4
修复appVerify bug

v 0.1.5
修复 listview change事件bug

v 0.1.6
修复 treeview 隐藏选项
修复 treeview 隐藏所有选项

v 0.1.7
修改：appcan.window.open(name,data,aniId,type,dataType,width,height,animDuration,extraInfo) 新增参数extraInfo
修改：appcan.window.openPopover(name,dataType,url,data,left,top,width,height,fontSize,type,bottomMargin,extraInfo) 新增参数extraInfo
修改：appcan.window.openMultiPopover(popName,content,dataType, left, top, width, height,change, fontSize, flag, indexSelected，extraInfo) 新增参数extraInfo
修改：:appcan.frame.open(id,url,left,top,name,index,change,extraInfo) 新增参数extraInfo
修改：::appcan.window.popoverElement(id,url,left,top,name,extraInfo) 新增参数extraInfo

v 0.1.8
修复 ios openPopover 打开窗口bug

v 0.1.9
新增 appcan.window.setMultilPopoverFlippingEnbaled 方法
修改 slider控件与multiPopover冲突
v 0.1.10
新增 appcan.ajax 插件合并到appcan.js并扩展appcan.request.ajax
修改appcan.crypto中添加了md5接口
新增appcan.icache.js文件用于处理图片缓存
v 0.1.11
修改 appcan.ajax 插件（1.增加自定义目录参数offlineDataPath,2.离线数据保存的文件名改为url编码后的值）并扩展到appcan.request.ajax
新增 appcan.request.clearOffline(url,callback)方法

修复 listview title describe内容是数字不自动换行的bug
v 0.1.12
修改appcan.ajax插件，增加expires参数，实现设置离线数据过期功能，并扩展到appcan.request.ajax
v 0.1.13
修改appcan.request.ajax插件，适应uexXmlHttpMgr增加sucess,error回调参数
v 0.1.14
修改appcan.request.ajax及appcan.ajax，offline参数为true读取本地文件时，成功回调函数返回参数与远程ajax获取返回参数保持一致
v 0.1.15
修改appcan.request.ajax及appcan.ajax当返回状态码为null，大于等于200及小于300，304时都视为success
v 0.1.16
修复了appcan.request.ajax及appcan.ajax请求同一url不同参数，参数过长缓存文件名可能相同的问题
同时修改了appcan.request.clearOffline(url,callback,data),新增data参数
修改appcan.request.ajax及appcan.ajax新增crypto,password参数实现rc4的数据加解密功能
修改appcan.optionList.js,新增list列表的click事件
修复了appcan.slider.js调用set多次导致事件绑定多次的bug
v 0.1.17
修复appcan.request.ajax兼容适配web/微信

