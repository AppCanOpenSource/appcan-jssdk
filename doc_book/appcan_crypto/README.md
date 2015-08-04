# appcan_crypto

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
    
