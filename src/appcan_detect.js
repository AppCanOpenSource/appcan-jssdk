/*

    author:dushaobin
    email:shaobin.du@3g2win.com
    description:构建appcan view模块
    create:2014.08.25
    update:______/___author___


*/
/* global appcan,window,document*/
appcan && appcan.define('detect',function(ac,exports,module){
    var os = {};
    var browser = {};
    var ua = window.navigator.userAgent;
    var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
      android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
      osx = ua.match(/\(Macintosh\; Intel .*OS X ([\d_.]+).+\)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      wp = ua.match(/Windows Phone ([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/),
      ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
      webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
      safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) {
        browser.version = webkit[1];
    }
    //android
    if (android) {
        os.name = 'android';
        os.android = true;
        os.version = android[2];
    }

    if (iphone && !ipod) {
        os.name = 'iphone';
        os.ios = os.iphone = true;
        os.version = iphone[2].replace(/_/g, '.');
    }

    if (ipad){
        os.name = 'ipad';
        os.ios = os.ipad = true;
        os.version = ipad[2].replace(/_/g, '.');
    }
    if (ipod) {
        os.name = 'ipod';
        os.ios = os.ipod = true;
        os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    }
    if (wp) {
        os.name = 'wp';
        os.wp = true;
        os.version = wp[1];
    }
    if (webos) {
        os.name = 'webos';
        os.webos = true;
        os.version = webos[2];
    }

    if (touchpad) {
        os.name = 'touchpad';
        os.touchpad = true;
    }

    if (blackberry) {
        os.name = 'blackberry';
        os.blackberry = true;
        os.version = blackberry[2];
    }

    if (bb10) {
        os.name = 'bb10';
        os.bb10 = true;
        os.version = bb10[2];
    }

    if (rimtabletos) {
        os.name = 'rimtabletos';
        os.rimtabletos = true;
        os.version = rimtabletos[2];
    }

    if (playbook) {
        browser.name = 'playbook';
        browser.playbook = true;
    }

    if (kindle) {
        os.name = 'kindle';
        os.kindle = true;
        os.version = kindle[1];
    }
    if (silk) {
        browser.name = 'silk';
        browser.silk = true;
        browser.version = silk[1];
    }
    if (!silk && os.android && ua.match(/Kindle Fire/)) {
        browser.name = 'silk';
        browser.silk = true;
    }
    if (chrome) {
        browser.name = 'chrome';
        browser.chrome = true;
        browser.version = chrome[1];
    }
    if (firefox) {
        browser.name = 'firefox';
        browser.firefox = true;
        browser.version = firefox[1];
    }
    if (ie) {
        browser.name = 'ie';
        browser.ie = true;
        browser.version = ie[1];
    }
    if (safari && (osx || os.ios)) {
        browser.name = 'safari';
        browser.safari = true;
        if (osx) {
            browser.version = safari[1];
        }
    }
    if(osx){
        os.name = 'osx';
        os.version = osx[1].split('_').join('.');
    }
    if (webview) {
        browser.name = 'webview';
        browser.webview = true;
    }
    //appcan navive 应用
    if(!!(appcan.isAppcan)){
        browser.name = 'appcan';
        browser.appcan = true;
    }
    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
      (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
      (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

    //检查是否支持touch事件
    var checkTouchEvent = function(){
        if(('ontouchstart' in window) || window.DocumentTouch && window.document instanceof window.DocumentTouch) {
          return true;
        }
        return false;
    };

    //判断是否支持css3d,todo：避免多次创建
    var supports3d = function() {
		var div = document.createElement('div'),
			ret = false,
			properties = ['perspectiveProperty', 'WebkitPerspective'];
		for (var i = properties.length - 1; i >= 0; i--){
			ret = ret ? ret : div.style[properties[i]] !== undefined;
		}

        //如果webkit 3d transforms被禁用,虽然语法上检查没问题，但是还是不支持
        if (ret){
            var st = document.createElement('style');
            // webkit allows this media query to succeed only if the feature is enabled.
            // "@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){#modernizr{height:3px}}"
            st.textContent = '@media (-webkit-transform-3d){#test3d{height:3px}}';
            document.getElementsByTagName('head')[0].appendChild(st);
            div.id = 'test3d';
            document.documentElement.appendChild(div);
            ret = (div.offsetHeight === 3);
            st.parentNode.removeChild(st);
            div.parentNode.removeChild(div);
        }
        return ret;
	};

    //事件的支持度检测
    var events = {
        supportTouch:checkTouchEvent()
    };

    //css的支持度检测
    var css = {
        support3d:supports3d()
    };

    //Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13
    module.exports = {
        browser:browser,
        os:os,
        event:events,
        css:css,
        ua:ua
    };

});
