/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:扩展user 到appcan对象上
    created:2014,08.21
    update:


*/
/*global window,appcan*/
window.appcan && appcan.extend(function(ac,exports,module){
    /*
    字符组去除前后空格
    @param String str 要去空格的字符串


    */
    var trim = function(str){
        if(!str){
            return '';
        }
        if(String.prototype.trim){
            return String.prototype.trim.call(str);
        }
        return str.replace(/^\s+|\s+$/ig,'');
    };
    /*
    字符组去除前面空格
    @param String str 要去空格的字符串


    */
    var trimLeft = function(str){
        if(!str){
            return '';
        }
        if(String.prototype.trimLeft){
            return String.prototype.trimLeft.call(str);
        }
        return str.replace(/^\s+/ig,'');
    };

    /*
    字符组去除后面空格
    @param String str 要去空格的字符串


    */
    var trimRight = function(str){
        if(!str){
            return '';
        }
        if(String.prototype.trimRight){
            return String.prototype.trimRight.call(str);
        }
        return str.replace(/\s+$/ig,'');
    };
    /*
    获取字符串的字节长度
    @param String str

    */
    var byteLength = function(str){
        if(!str){
            return 0;
        }
        var totalLength = 0;
        var i;
        var charCode;
        for (i = 0; i < str.length; i++) {
            charCode = str.charCodeAt(i);
          if (charCode < 0x007f) {
              totalLength = totalLength + 1;
          } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
              totalLength += 2;
          } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
              totalLength += 3;
          }
        }
        return totalLength;
    };

    module.exports = {
        trim:trim,
        trimLeft:trimLeft,
        trimRight:trimRight,
        byteLength:byteLength
    };
    
});
