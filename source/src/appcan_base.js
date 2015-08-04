/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:扩展zepto到appcan dom 对象上
    扩展Backbone到appcan Backbone 对象上
    扩展underscore到appcan _ 对象上
    created:2014,08.18
    update:


*/
/*global appcan,Zepto,Backbone,_,uexLog,window*/

//把zepto，导入到appcan.dom 上
window.appcan && window.appcan.define('dom',function($,exports,module){
    module.exports = Zepto;
});

//把Backbone，导入到appcan.Backbone 上
window.appcan && appcan.define('Backbone',function($,exports,module){
    module.exports = Backbone;
});

//把underscore，导入到appcan._ 上
window.appcan && appcan.define('_',function($,exports,module){
    module.exports = _;
});

//把underscore，导入到appcan.underscore 上
window.appcan && appcan.define('underscore',function($,exports,module){
    module.exports = _;
});

//扩展appcan基础库能力
window.appcan && appcan.extend(function(ac,exports,module){

    /*
    打印日志到控制台，如果是appcan应用打印到，响应的控制台
    @param * obj 任何类型

    */
    var logs = function(obj){
        try{
            if(window.uexLog){
                window.uexLog && uexLog.sendLog(obj);
            }else{
                console && console.log(obj);
            }
        }catch(e){
            return e;
        }
    };

    ac.logs = logs;

});

//扩展原声的dom对象
window.appcan && appcan.extend('dom',function(dom,exports,module){
    if(!appcan.isAppcan){
        return;
    }
    
});
