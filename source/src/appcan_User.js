/*
    author:dushaobin
    email:shaobin.du@3g2win.com
    description:扩展user 到appcan对象上
    created:2014,08.21
    update:


*/
/*global appcan*/
appcan && appcan.define('User',function($,exports,module){
    var Backbone = appcan.require('Backbone');
    var db = appcan.require('database');
    var User = Backbone.Model.extend({
        login:function(){

        },
        signup:function(){

        },
        logout:function(){


        },
        changePassword:function(){

        }
    });
    module.exports = User;
});
