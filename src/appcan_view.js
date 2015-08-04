/*

    author:dushaobin
    email:shaobin.du@3g2win.com
    description:构建appcan view模块
    create:2014.08.19
    update:______/___author___


*/
/*global window,appcan*/
window.appcan && appcan.define('view',function($,exports,module){
    var _ = appcan.require('underscore');
    var settings = {};
    /*
        配置模版参数
        @param Object newSettings 新的配置信息

    */
    var config = function(newSettings){
        settings = _.defaults({},settings,newSettings);
    };
    /*
        替换内容到制定的元素中
        @param String selector 选择器
        @param String template 模板
        @param Object dataSource 数据源
        @param Object options 参数

    */
    var renderTemp = function(selector,template,dataSource,options){
        options = _.defaults({},settings,options);
        var render = _.template(template,options);
        var dataRes = render(dataSource);
        $(selector).html(dataRes);
        return dataRes;
    };
    /*
        附加内容到指定的元素中
        @param String selector 选择器
        @param String template 模板
        @param Object dataSource 数据源
        @param Object options 参数

    */
    var apRenderTemp = function(selector,template,dataSource,options){
        options = _.defaults({},settings,options);
        var render = _.template(template,options);
        var dataRes = render(dataSource);
        $(selector).append(dataRes);
        return dataRes;
    };
    module.exports = {
        template:_.template,
        render:renderTemp,
        appendRender:apRenderTemp,
        config:config
    };
});
