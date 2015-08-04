/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:扩展storage 到 appcan 上
    created:2014,08.25
    update:


*/
/*global appcan,window,unescape*/
appcan && appcan.define('locStorage',function($,exports,module){

    var storage = window.localStorage,
            i=0,
            len=0;
    /*
    从本地存储获取值
    @param String key 设置localstorage的key
    @param String value 设置localstorage的val

    */
    function setValue(key,val){
        try{
            if(storage){
                if(!appcan.isString(val)){
                    val = JSON.stringify(val);
                }
                storage.setItem(key,val);
            }else{

            }
        }catch(e){

        }
    }
    /*
        批量设置localstorage

    */
    function setValues(key){
        if(appcan.isPlainObject(key)){
            for(var k in key){
                if(key.hasOwnPropery(k)){
                    setValue(k,key[k]);
                }
            }
        }else if(appcan.isArray(key)){
            for(i=0,len=key.length;i<len;i++){
                if(key[i]){
                    setValue.apply(this,key[i]);
                }
            }
        }else{
            setValue.apply(this,arguments);
        }
    }

    /*
    从localStorage获取对应的值
    @param String key 获取值的key

    */
    function getValue(key){
        if(!key){
            return;
        }
        try{
            if(storage){
                return storage.getItem(key);
            }
        }catch(e){

        }
    }
    /*
    从localStorage获取所有的keys

    */
    function getKeys(){
        var res = [];
        var key = '';
        for (var i=0,len=storage.length; i< len; i++){
            key = storage.key(i);
            if(key){
                res.push(key);
            }
        }
        return res;
    }

    /*
    青春对应的key
    @param String key


    */
    function clear(key){
        try{
            if(key && appcan.isString(key)){
                storage.removeItem(key);
            }else{
                storage.clear();
            }
        }catch(e){

        }
    }

    /*
    localStorage剩余空间大小

    */
    function leaveSpace(){
        var space = 1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(storage))).length;
        return space;
    }
    
    /*
        获取或者设置localStorage的值
        @param String key
        @param String val
        
    */
    function val(key,value){
        if(arguments.length === 1){
            return getValue(key);
        }
        setValue(key,value);
    }

    module.exports = {
        getVal:getValue,
        setVal:setValues,
        leaveSpace:leaveSpace,
        remove:clear,
        keys:getKeys,
        val:val
    };

});
