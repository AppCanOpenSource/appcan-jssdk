/*
    监控整个页面，如果页面出错了，则把错误内容打印到控制台、写到本地、发送到服务器


*/
(function(){
    var debugFlag = window.appcan && appcan.debug;
    var errList = [];
    //页面出错了
    window.onerror = function(msg,url,line,col,err){
        var errObj = {};
        if(!debugFlag){
            return;
        }
        var now = new Date();
        errObj.timeStamp = now.getTime();
        errObj.msg = msg;
        errObj.url = url;
        errObj.line = line;
        errObj.col = col;
        errObj.err = err;
        errObj.stack = err && err.stack;
        errList.push(errObj);
        //console && console.log && console.log(errObj);
        alert(JSON.stringify(errObj));
        return true;
    };
    
    //离开页面，save errList
    window.onbeforeunload = function(){
        //send to server
        //alert(JSON.stringify(errList));
        //document.body.style.backgroundColor = 'red';
        //return JSON.stringify(errList);
    };
    
    //离开页面，save errList
    window.onunload = function(){
        //send to server
        //alert(JSON.stringify(errList));
        //alert('unloaded');
    };
})();