//设置导航模块
appcan.use("dom",function($){
    $('.nav-slide').on('click','li',function(){
        var self = $(this);
        self.siblings().removeClass('active');
        self.addClass('active');
    });
});
