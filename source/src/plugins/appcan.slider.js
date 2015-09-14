appcan.define("slider", function($, exports, module) {
    var model_item = '<div class="slider-item ub-fh ub-fv ub-img1 <%=data.id%>" style="background-image:url(<%=data.img%>)">\
    <span class="uabs"><%=data.label%></span>\
    </div>';
    var model_Conitem='<div class="slider-item1 ub-fh ub-fv" id="<%=option.index%>">\
     <div style="font-size:<%=option.size%>px;white-space:normal;position:absolute;left:0;top:0;word-wrap: break-word;" ><%=data.note%></div>\
     </div>';
    var itemTmp = appcan.view.template(model_item);
    var ConitemTmp=appcan.view.template(model_Conitem);
    function isWindows(){
        if(!('ontouchstart' in window)) return true;
    }
    var bounceState;
    function SliderView(option) {
        appcan.extend(this, appcan.eventEmitter);
        var self = this;
        self.option = $.extend({
            selector : "body",
            dir:'hor',
            hasIndicator:true,
            hasContent:false,
            canDown:true,
            hasCircle:true,
            hasLabel:false,
            aspectRatio:0,
            index:0,
            auto:false
        }, option, true);
        
        this.isReset = true;
        // if(uexWindow.getBounce && typeof uexWindow.getBounce === 'function'){
            // appcan.window.getBounceStatus(function(dt,dataType,opId){
                // bounceState = dt;
            // });
        // }else{
              bounceState =1;
         // }
        self.ele = $(self.option.selector);
        self.ele.css({'-webkit-transform':'translateZ(0)','transform':'translateZ(0)'});
        if(self.option.aspectRatio){
            self.ele.css("height",self.ele.offset().width*self.option.aspectRatio);
        }
        if (self.option.data) {
            self.set(data);
        }
        if(self.option.auto){
            self.autoMove(self.option.auto);
        }
    };

    SliderView.prototype = {
        buildItem:function(data){
            var self = this;
         if(self.option.hasContent){
            var item = $(ConitemTmp({
                    data : data,
                    option : self.option
                }));
            }else{
            var item = $(itemTmp({
                    data : data,
                    option : self.option
                }));
            }
            item[0]["lv_data"]=data;
            return item;
        },
        _moveTo:function(index,anim){
            var self = this;
            if(!(anim === false )){
                self.container.addClass("slider-anim");
                self.container.on("webkitTransitionEnd",function(){
                    self.container.off("webkitTransitionEnd");
                    self.container.removeClass("slider-anim");
                    if(self.option.index >= self.option.itemCount){
                        self.option.index = 0;
                    }
                    if(self.option.index < 0){
                        self.option.index = self.option.itemCount-1;
                    }
                    self.emit("change",self,self.option.index);
                    self._moveTo(self.option.index,false);
                    self.isReset = true;
                });
            }
            var w=(-(self.option.index+1)*self.ele.offset().width);
            self.container.css("-webkit-transform", "translateX("+w+"px)");
            if(self.option.hasIndicator){
                var width = self.ele.offset().width / self.option.itemCount;
                self.focus.css("-webkit-transform", "translateX("+self.option.index * width+"px)");
            }
            if(self.option.hasLabel){
                self.label.html(self.option.data[self.option.index+1].label);
            }
            if(self.option.hasCircle){
                self.circle.html(self.option.data[self.option.index+1].label);
            }
        },
        drag:function(d){
            var self = this;
            var w=(-(self.option.index+1)*self.ele.offset().width)+d;
            self.container.css("-webkit-transform", "translateX("+w+"px)");
            self.isReset = false;
        },
        reset:function(){
            var self = this;
            if(!this.isReset){
                self._moveTo(self.option.index);
                self.autoMove(self.option.auto);
            }
        },
        set:function(data){
            var self = this;
            self.ele.children().remove();
            self.option.itemCount = data.length;
            self.container = self.container || $('<div class="slider-group ub-fh ub-fv"></div>');
            self.container.empty();
            data.unshift(data[data.length - 1]);
            data.push(data[1]);
            self.option.data = data;
            for(var i in data){
                var item = self.buildItem(data[i]);
                self.container.append(item);
            }
            self.ele.append(self.container);
            
            var width = self.ele.offset().width / self.option.itemCount;
            if(self.option.hasLabel){
                self.label = self.label || $('<div class="uinn1 ulev-1 ut-s label sc-text-hint"></div>');
                self.ele.append(self.label);
            }
            if(self.option.hasCircle){
                self.Circle = $('<div class="label1" style="background-color:rgba(152, 139, 123, 0.5);height:1.5em;width: 100%;position: absolute;left: 0px;bottom: 0px;"></div>');
                self.circle =self.circle || $('<div class="ulev-1 ut-s label sc-text-hint uinn-l1"></div>');
                var dian = $('<div class="labelzan" style="margin:0 auto;top :.6em;right: .2em;"></div>');
                var zamcon = $('<div class="labelcon1" name="labContent" style="margin-right : .5em;float: left;padding: 0.25em;background-color: #ff8a00;border-radius: 50%;"></div>');
                var zamcon1 = $('<div class="labelcon" name="labContent"></div>');
                for(var tt = 0;tt < self.option.itemCount;tt++){
                    if(tt == 0){
                        dian.append(zamcon);
                    }else{
                        dian.append('<div class="labelcon" name="labContent" style="margin-right : .5em;float: left;padding: 0.25em;background-color: #cfc1b0;border-radius: 50%;"></div>');
                    }
                }
                self.Circle.append(self.circle);
                if(self.option.site=='Right'){
                dian[0].style.cssText='margin-top:0.75em;margin-left:75%;';
                }else if(self.option.site=='Left'){
                    dian[0].style.cssText='margin-top:0.75em;margin-left:0;';
                }
                dian.css("width",self.option.itemCount+"em");
                self.Circle.append(dian);
                self.ele.append(self.Circle);
            }
            if(self.option.hasIndicator){
                self.focus = self.focus || $('<div class="utra focus bc-head"></div>');
                self.focus.css("width", width);
                self.focus.css("-webkit-transform", "translateX("+self.option.index * width+"px)");
                self.ele.append(self.focus);
            }
            
            self._moveTo(self.option.index,false);
            self.ele.off("swipeMoveLeft").on("swipeMoveLeft",function(evt){
                    if(self.timer) {
                        clearInterval(self.timer);
                    }
                    self.drag(-evt._args.dx);          
            });
            self.ele.off("swipeMoveRight").on("swipeMoveRight",function(evt){
                    if(self.timer) {
                        clearInterval(self.timer);
                    }
                    self.drag(evt._args.dx);  
            });
            
            //结束的时候
            self.ele.off("touchend touchcancel").on("touchend touchcancel",function(evt){
                self.reset();
            });
            
            self.ele.off("tap").on("tap",function(evt){
                self.emit("clickItem",self,self.option.index,data[self.option.index+1]);
            });
            self.ele.off("swipeLeft").on("swipeLeft",function(evt){
                    var name = $("div[name=labContent]");
                    var index = self.option.index + 1;
                    if(index >= self.option.itemCount){
                        index = 0;
                    }
                    for(var i = 0;i < name.length;i++){
                        if(i == index){
                            name[i].style.cssText= 'margin-right : .5em;float: left;padding: 0.25em;background-color: #ff8a00;border-radius: 50%;';
                        }else{
                            name[i].style.cssText = 'margin-right : .5em;float: left;padding: 0.25em;background-color: #cfc1b0;border-radius: 50%;';
                        }
                    }
                    self._moveTo(++self.option.index);
                    self.autoMove(self.option.auto);             
            });
            self.ele.off("swipeRight").on("swipeRight",function(evt){
                var name = $("div[name=labContent]");
                    var index = self.option.index - 1;
                    if(index < 0){
                        index = self.option.itemCount - 1;
                    }
                    for(var i = 0;i < name.length;i++){
                        if(i == index){
                            name[i].style.cssText= 'margin-right : .5em;float: left;padding: 0.25em;background-color: #ff8a00;border-radius: 50%;';
                        }else{
                            name[i].style.cssText = 'margin-right : .5em;float: left;padding: 0.25em;background-color: #cfc1b0;border-radius: 50%;';
                        }
                    }
                    self._moveTo(--self.option.index);
                    self.autoMove(self.option.auto);
            });
            
            self.ele.off("swipeUp").on("swipeUp",function(evt){
                self._moveTo(self.option.index);
                self.autoMove(self.option.auto);
            });
            self.ele.off("swipeDown").on("swipeDown",function(evt){
                self._moveTo(self.option.index);
                self.autoMove(self.option.auto)
            });
            $(document).on("touchstart",function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                if(self.option.canDown){
                var touch = evt.touches[0];
                screenX1 =touch.screenX;
                screenY1 =touch.screenY;
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                appcan.window.disableBounce();
                appcan.window.setMultilPopoverFlippingEnbaled(1);
                return true;
                }else{
                if(bounceState == 1){
                appcan.window.enableBounce();
                }
                appcan.window.setMultilPopoverFlippingEnbaled(0);
                }
                }else{
                var touch = evt.touches[0];
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                appcan.window.disableBounce();
                appcan.window.setMultilPopoverFlippingEnbaled(1);
                return false;
                }else{
                if(bounceState == 1){
                appcan.window.enableBounce();
                }
                appcan.window.setMultilPopoverFlippingEnbaled(0);
                }  
                }
            });
            $(document).on("touchmove",function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                if(self.option.canDown){
                var touch = evt.touches[0];
                screenX2 =touch.screenX;  
                screenY2=touch.screenY;
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    appcan.window.setMultilPopoverFlippingEnbaled(1);
                    if(self.timer) clearInterval(self.timer);
                    
                    function GetSlideAngle(dx, dy) {
                        return Math.atan2(dy, dx) * 180 / Math.PI;
                    }
                    //根据起点和终点返回方向 3：向上，4：向下，2：向左，1：向右,0：未滑动
                    function GetSlideDirection(screenX1,screenX2,screenY1,screenY2){
                        var dy = screenX2 - screenX1;
                        var dx = screenY2 - screenY1;
                        var result = 0;
                
                        //如果滑动距离太短
                        if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                          return result;
                        }
                        var angle = GetSlideAngle(dx, dy);
                        if(angle >= -45 && angle < 45) {
                            result = 4;
                        }else if (angle >= 45 && angle < 135) {
                            result = 1;
                        }else if (angle >= -135 && angle < -45) {
                            result = 2;
                        }
                        else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                            result = 3;
                        }
                        return result;
                    }
                    var direction = GetSlideDirection(screenX1,screenX2,screenY1,screenY2);
                    if(direction==3||direction==4){
                        appcan.window.enableBounce();
                        return true;
                    }
                    else{
                        appcan.window.disableBounce();
                        return false;
                    }
                }
                }else{
                var touch = evt.touches[0];
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    appcan.window.disableBounce();
                    appcan.window.setMultilPopoverFlippingEnbaled(1);
                    if(self.timer) clearInterval(self.timer);
                    return false;
                } 
                }
            });
            $(document).on("touchcancel",function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                if(self.option.canDown){
                var touch = evt.touches[0];
                if(bounceState == 1){
                    appcan.window.enableBounce();
                }
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    appcan.window.setMultilPopoverFlippingEnbaled(0);
                }
                return false;
                }else{
                    appcan.window.setMultilPopoverFlippingEnbaled(0); 
                }
            });
            $(document).on("touchend",function(evt){
                var left = self.ele.offset().left;
                var top = self.ele.offset().top;
                var width = self.ele.width();
                var height = self.ele.height();
                if(self.option.canDown){
                var touch = evt.touches[0];
                if(bounceState == 1){
                    appcan.window.enableBounce();
                }
                if(touch.pageX > left && touch.pageX < left+width && touch.pageY > top && touch.pageY < top+height){
                    appcan.window.setMultilPopoverFlippingEnbaled(0);
                }
                return false;
                }else{
                appcan.window.setMultilPopoverFlippingEnbaled(0);
                }
            });
            return self;
        },
        autoMove:function(auto){
            if(auto){
                var self = this;
                if(self.timer) {
                    clearInterval(self.timer);
                }
                self.timer = setInterval(function(){
                    self._moveTo(++self.option.index,true);
                },auto);
            }
        }
    }
    module.exports = function (option) {
        return new SliderView(option);
    };
});
