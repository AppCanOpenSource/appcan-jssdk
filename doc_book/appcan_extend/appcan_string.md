# appcan_string 对字符串的扩展


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
    