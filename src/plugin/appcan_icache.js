/**
 *
 */
appcan.define("icache", function($, exports, module) {
    var opid = 1000;
    var CACHE_PATH = "wgt://icache/";
    function iCache(option) {
        var self = this;
        appcan.extend(this, appcan.eventEmitter);
        self.waiting = [];
        self.running = [];
        self.option = $.extend({
            maxtask : 3
        }, option, true);
        uexFileMgr.cbGetFileRealPath = function(opCode, dataType, path) {
            self.realpath = path;
            self.emit("NEXT_SESSION");
        }
        uexFileMgr.cbIsFileExistByPath = function(opId, dataType, data) {
            self.emit("FS" + opId, self, data);
        }
        uexDownloaderMgr.cbCreateDownloader = function(opCode, dataType, data) {

            self.emit("CDL" + opCode, self, data);
        }
        uexDownloaderMgr.onStatus = function(opCode, fileSize, percent, status) {

            self.emit("DLS" + opCode, self, {
                fileSize : fileSize,
                percent : percent,
                status : status
            });
        }
        uexFileMgr.getFileRealPath("wgt://");
        self.on("NEXT_SESSION", self._next);

    }


    iCache.prototype = {
        _progress : function(data, session) {
            if (session.progress) {
                session.progress(data, session);
            }
        },
        _success : function(fpath, session) {
            var self = this;
            self.off("DLS" + session.id);
            uexDownloaderMgr.closeDownloader(session.id);
            if (session.success) {
                session.success(fpath, session);
            } else if (session.dom && session.dom.length) {
                switch(session.dom[0].tagName.toLowerCase()) {
                case "img":
                    session.dom.attr("src", fpath);
                    break;
                default:
                    session.dom.css("background-image", "url(file://" + fpath + ") !important");
                    break;
                }
            }
            var index = self.running.valueOf(session);
            index != undefined && self.running.splice(index, 1);
            self.emit("NEXT_SESSION");
        },
        _fail : function(session) {
            var self = this;
            self.off("DLS" + session.id);
            uexDownloaderMgr.closeDownloader(session.id);
            var index = self.running.valueOf(session);
            index != undefined && self.running.splice(index, 1);
            if (session.fail) {
                session.fail(session);
            }
            self.emit("NEXT_SESSION");
        },
        _next : function() {
            var self = this;
            if (!self.realpath)
                return;
            if (self.running.length >= self.option.maxtask)
                return;
            var session = self.waiting.shift();
            if (!session)
                return;
            self.running.push(session);
            self._download(session);

        },
        _download : function(session) {
            var self = this;
            var fid = appcan.crypto.md5(session.url);
            var fpath = self.realpath + "/icache/" + fid;
            self.once("FS" + session.id, function(data) {
                if (data) {
                    self._success(fpath, session);
                } else {
                    uexDownloaderMgr.createDownloader(session.id);
                }
            })
            self.once("CDL" + session.id, function(data) {
                if (!data) {
                    (uexDownloaderMgr.setHeaders && session.header) && uexDownloaderMgr.setHeaders(session.id, session.header);
                    uexDownloaderMgr.download(session.id, session.url, fpath, '0');
                } else
                    self._fail(session);
            })
            self.on("DLS" + session.id, function(data) {
                switch(parseInt(data.status)) {
                case 0:
                    self._progress(data, session)
                    break;
                case 1:
                    self._success(fpath, session);
                    break;
                default:
                    self._fail(session);
                    break;
                }
            })
            uexFileMgr.isFileExistByPath(session.id, fpath);
        },
        run : function(option) {
            var self = this;
            var session = $.extend({
                id : ("" + (opid++)),
                status : 0
            }, option, true);
            self.waiting.push(session);
            self.emit("NEXT_SESSION");
        },
        clearcache:function(){
            uexFileMgr.deleteFileByPath(CACHE_PATH);
        }
    }

    module.exports = function(option) {
        return new iCache(option);
    };
})
