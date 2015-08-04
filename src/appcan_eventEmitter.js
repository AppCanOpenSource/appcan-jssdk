/*

    author:dushaobin
    email:shaobin.du@3g2win.com
    description:构建appcan eventEmitter模块
    create:2014.08.18
    update:______/___author___


*/
/*global appcan*/
appcan && appcan.define('eventEmitter',function($,exports,module){
    //事件对象
    var eventEmitter = {
        on:function(name,callback){
            if(!this.__events){
                this.__events = {};
            }
            if(this.__events[name]){
                this.__events[name].push(callback);
            }else{
                this.__events[name] = [callback];
            }
        },
        off:function(name,callback){
            if(!this.__events){
                return;
            }
            if(name in this.__events){
                for(var i=0,len=this.__events[name].length;i<len;i++){
                    if(this.__events[name][i] === callback){
                        this.__events[name].splice(i,1);
                        return;
                    }
                }
            }
        },
        once:function(name,callback){
            var that = this;
            var tmpcall = function(){
                callback.apply(that,arguments);
                that.off(tmpcall);
            };
            this.on(name,tmpcall);
        },
        addEventListener:function(){
            return this.on.apply(this,arguments);
        },
        removeEventListener:function(){
            return this.off.apply(this,arguments);
        },
        trigger:function(name,context){
            var args = [].slice.call(arguments,2);
            if(!this.__events || !appcan.isString(name)){
                return;
            }
            context = context || this;
            if(name && (name in this.__events)){
                for(var i=0,len=this.__events[name].length;i<len;i++){
                    this.__events[name][i].apply(context,args);
                }
            }
        },
        emit:function(){
            return this.trigger.apply(this,arguments);
        }

    };
    //扩展到appan基础对象上
    appcan.extend(eventEmitter);
    module.exports = eventEmitter;
});
