/*
    author:jiaobingqian
    email:bingqian.jiao@3g2win.com
    description:扩展离线缓存 到appcan对象上
    created:2015,04.03
    update:


*/

//文件的状态 、是否正在缓存，是否缓存完成
//文件是否过期
//过期时间
//保存时间
appcan.offline = {
    config:function(opts){
        opts={
            cachePath:'wgt://data/icache/',//默认离线文件存储目录
            timeout:'24',//默认超时时间单位小时
            updateControl:'',//time,url,byfile
        }; 
    },
    //获取任意长度的随机数
    getRandomID = function(len){
        len = len || 2;
        var seed = '123456789';
        var seedLen = seed.length - 1;
        var randomId = '';
        while(len--){
            randomId += seed[Math.round(Math.random()*seedLen)]
        }
        return randomId;
    },
    //获取24小时内的唯一id，随机不重复
    getOPID:function(){
        var date = new Date();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();

        return hour*36000000 + minutes*600000 + seconds*10000 + milliseconds*10 + getRandomID(1);
    },
    init:function(){
         uexFileMgr.cbReadFile = function(opId, dataType, data) {
            if (opId == 1 && dataType == 0) {
                document.getElementById('readData').value = data;
            }
            if (opId == 100 && dataType == 0) {
                document.getElementById('readData2').value = data;
            }
        }
    }
    /*
    离线缓存文件更新
    @param String url 需要更新的文件url地址
    @param String timeout 离线文件缓存超时时间，默认单位为小时
    */
    update:function(url,timeout){//http://baidu.com/logo.jpg
        if(!uexFileMgr.isFileExistByPath('wgt://data/offline.txt')){
            if(!uexFileMgr.isFileExistById(1)){
                uexFileMgr.openFile(1,'wgt://data/offline.txt','1');
                uexFileMgr.writeFile(1,'0','{"http://www.weather.com.cn/m2/i/icon_weather/29x20/n04.gif"}');
            }
            else{

            }
        }
        else{
            if(uexFileMgr.isFileExistById(1))
            uexFileMgr.createFile(1,'wgt://data/offline.txt');
            uexFileMgr.openFile(1,'wgt://data/offline.txt','1');
            uexFileMgr.writeFile(1,'0','{"http://www.weather.com.cn/m2/i/icon_weather/29x20/n04.gif"}');
            var json = {

            }
        }

    },
    updatePatch:function([]){
        
    },
    getFile:function(url,exist){
        cache(url)
        //获取真实路径
    },
    clear:function(url){
        //remove file

    },
    getStatus:function(url){
    }
}