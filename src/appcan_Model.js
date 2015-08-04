/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:扩展zepto到appcandom 对象上
    created:2014,08.20
    update:


*/
/*global appcan,window*/
window.appcan && appcan.define('Model',function($,exports,module){
    var Backbone = appcan.require('Backbone');
    var Model = Backbone.Model.extend({
        setToken:function(){

        }
    });

    module.exports = Model;
});
