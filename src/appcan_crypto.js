/*
 author:dushaobin
 email:shaobin.du@3g2win.com
 description:扩展encrypt 到appcan对象上
 created:2014,08.21
 update:

 */
/*global appcan*/
appcan && appcan.define('crypto', function($, exports, module) {
    /*
     扰乱s-box
     @param String key 字符串长度为0-256位

     */
    function rc4Init(key) {
        var s = [],
            j = 0,
            x;
        for (var i = 0; i < 256; i++) {
            s[i] = i;
        }
        for ( i = 0; i < 256; i++) {
            j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
            x = s[i];
            s[i] = s[j];
            s[j] = x;
        }
        return s;
    }

    /*
     用rc4 进行加解密
     @param String str 要加密的数据
     @param Array s 初始化好的s-box

     */
    function rc4Encrypt(str, s) {
        var i = 0;
        var j = 0;
        var res = '';
        var k = [];
        var x = null;
        k = k.concat(s);
        for (var y = 0; y < str.length; y++) {
            i = (i + 1) % 256;
            j = (j + k[i]) % 256;
            x = k[i];
            k[i] = k[j];
            k[j] = x;
            var dest = str.charCodeAt(y) ^ k[(k[i] + k[j]) % 256] || str.charCodeAt(y)
            res +=String.fromCharCode(dest);

        }
        return res;
    }

    /*
     直接加密数据合并两个方法

     */
    function rc4EncryptWithKey(key, content) {
        if (!key || !content) {
            return '';
        }
        var sbox = rc4Init(key);
        return rc4Encrypt(content, sbox);
    }

    function MD5(data) {

        // convert number to (unsigned) 32 bit hex, zero filled string
        function to_zerofilled_hex(n) {
            var t1 = (n >>> 0).toString(16)
            return "00000000".substr(0, 8 - t1.length) + t1
        }

        // convert array of chars to array of bytes
        function chars_to_bytes(ac) {
            var retval = []
            for (var i = 0; i < ac.length; i++) {
                retval = retval.concat(str_to_bytes(ac[i]))
            }
            return retval
        }

        // convert a 64 bit unsigned number to array of bytes. Little endian
        function int64_to_bytes(num) {
            var retval = []
            for (var i = 0; i < 8; i++) {
                retval.push(num & 0xFF)
                num = num >>> 8
            }
            return retval
        }

        //  32 bit left-rotation
        function rol(num, places) {
            return ((num << places) & 0xFFFFFFFF) | (num >>> (32 - places))
        }

        // The 4 MD5 functions
        function fF(b, c, d) {
            return (b & c) | (~b & d)
        }

        function fG(b, c, d) {
            return (d & b) | (~d & c)
        }

        function fH(b, c, d) {
            return b ^ c ^ d
        }

        function fI(b, c, d) {
            return c ^ (b | ~d)
        }

        // pick 4 bytes at specified offset. Little-endian is assumed
        function bytes_to_int32(arr, off) {
            return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off])
        }

        /*
         Conver string to array of bytes in UTF-8 encoding
         See:
         http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
         http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
         How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
         */
        function str_to_bytes(str) {
            var retval = []
            for (var i = 0; i < str.length; i++)
                if (str.charCodeAt(i) <= 0x7F) {
                    retval.push(str.charCodeAt(i))
                } else {
                    var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%')
                    for (var j = 0; j < tmp.length; j++) {
                        retval.push(parseInt(tmp[j], 0x10))
                    }
                }
            return retval
        }

        // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
        function int128le_to_hex(a, b, c, d) {
            var ra = ""
            var t = 0
            var ta = 0
            for (var i = 3; i >= 0; i--) {
                ta = arguments[i]
                t = (ta & 0xFF)
                ta = ta >>> 8
                t = t << 8
                t = t | (ta & 0xFF)
                ta = ta >>> 8
                t = t << 8
                t = t | (ta & 0xFF)
                ta = ta >>> 8
                t = t << 8
                t = t | ta
                ra = ra + to_zerofilled_hex(t)
            }
            return ra
        }

        // conversion from typed byte array to plain javascript array
        function typed_to_plain(tarr) {
            var retval = new Array(tarr.length)
            for (var i = 0; i < tarr.length; i++) {
                retval[i] = tarr[i]
            }
            return retval
        }

        // check input data type and perform conversions if needed
        var databytes = null
        // String
        var type_mismatch = null
        if ( typeof data == 'string') {
            // convert string to array bytes
            databytes = str_to_bytes(data)
        } else if (data.constructor == Array) {
            if (data.length === 0) {
                // if it's empty, just assume array of bytes
                databytes = data
            } else if ( typeof data[0] == 'string') {
                databytes = chars_to_bytes(data)
            } else if ( typeof data[0] == 'number') {
                databytes = data
            } else {
                type_mismatch = typeof data[0]
            }
        } else if ( typeof ArrayBuffer != 'undefined') {
            if ( data instanceof ArrayBuffer) {
                databytes = typed_to_plain(new Uint8Array(data))
            } else if (( data instanceof Uint8Array) || ( data instanceof Int8Array)) {
                databytes = typed_to_plain(data)
            } else if (( data instanceof Uint32Array) || ( data instanceof Int32Array) || ( data instanceof Uint16Array) || ( data instanceof Int16Array) || ( data instanceof Float32Array) || ( data instanceof Float64Array)) {
                databytes = typed_to_plain(new Uint8Array(data.buffer))
            } else {
                type_mismatch = typeof data
            }
        } else {
            type_mismatch = typeof data
        }

        if (type_mismatch) {
            alert('MD5 type mismatch, cannot process ' + type_mismatch)
        }

        function _add(n1, n2) {
            return 0x0FFFFFFFF & (n1 + n2)
        }

        return do_digest()

        function do_digest() {

            // function update partial state for each run
            function updateRun(nf, sin32, dw32, b32) {
                var temp = d
                d = c
                c = b
                //b = b + rol(a + (nf + (sin32 + dw32)), b32)
                b = _add(b, rol(_add(a, _add(nf, _add(sin32, dw32))), b32))
                a = temp
            }

            // save original length
            var org_len = databytes.length

            // first append the "1" + 7x "0"
            databytes.push(0x80)

            // determine required amount of padding
            var tail = databytes.length % 64
            // no room for msg length?
            if (tail > 56) {
                // pad to next 512 bit block
                for (var i = 0; i < (64 - tail); i++) {
                    databytes.push(0x0)
                }
                tail = databytes.length % 64
            }
            for ( i = 0; i < (56 - tail); i++) {
                databytes.push(0x0)
            }
            // message length in bits mod 512 should now be 448
            // append 64 bit, little-endian original msg length (in *bits*!)
            databytes = databytes.concat(int64_to_bytes(org_len * 8))

            // initialize 4x32 bit state
            var h0 = 0x67452301
            var h1 = 0xEFCDAB89
            var h2 = 0x98BADCFE
            var h3 = 0x10325476

            // temp buffers
            var a = 0,
                b = 0,
                c = 0,
                d = 0

            // Digest message
            for ( i = 0; i < databytes.length / 64; i++) {
                // initialize run
                a = h0
                b = h1
                c = h2
                d = h3

                var ptr = i * 64

                // do 64 runs
                updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7)
                updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12)
                updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17)
                updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22)
                updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7)
                updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12)
                updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17)
                updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22)
                updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7)
                updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12)
                updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17)
                updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22)
                updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7)
                updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12)
                updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17)
                updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22)
                updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5)
                updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9)
                updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14)
                updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20)
                updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5)
                updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9)
                updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14)
                updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20)
                updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5)
                updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9)
                updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14)
                updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20)
                updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5)
                updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9)
                updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14)
                updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20)
                updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4)
                updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11)
                updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16)
                updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23)
                updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4)
                updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11)
                updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16)
                updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23)
                updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4)
                updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11)
                updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16)
                updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23)
                updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4)
                updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11)
                updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16)
                updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23)
                updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6)
                updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10)
                updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15)
                updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21)
                updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(databytes, ptr + 48), 6)
                updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(databytes, ptr + 12), 10)
                updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15)
                updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21)
                updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6)
                updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10)
                updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15)
                updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21)
                updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6)
                updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10)
                updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15)
                updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21)

                // update buffers
                h0 = _add(h0, a)
                h1 = _add(h1, b)
                h2 = _add(h2, c)
                h3 = _add(h3, d)
            }
            // Done! Convert buffers to 128 bit (LE)
            return int128le_to_hex(h3, h2, h1, h0).toUpperCase()
        }

    }

        /**
    *
    *  Base64 encode / decode
    *
    **/
    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    function encode(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = _utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

        }

        return output;
    }

    // public method for decoding
    function decode(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = _utf8_decode(output);

        return output;

    }

    // private method for UTF-8 encoding
    function _utf8_encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    // private method for UTF-8 decoding
    function _utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

    function Arcfour(key,txt) {
        var S = [], result = "", i = 0, j = 0;

        for(i = 0; i < 256; i++) {
            S[i] = i;
            j = (j + S[i] +  key.charCodeAt(i % key.length)) % 256;
            S[j] = [S[i], S[i] = S[j]][0];  // Swap S[i] for S[j]
        }
        i = j = 0;
        for(var n = 0; n < txt.length; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;
            S[i] = [S[j], S[j] = S[i]][0];  // Swap S[i] for S[j]
            result += String.fromCharCode(txt.charCodeAt(n) ^ S[(S [i] + S [j]) % 256]) || txt.charCodeAt(n);
        }
        return result;
    }


    module.exports = {
        /*
         rc4:{
         encryptWithKey:rc4EncryptWithKey
         }*/
        rc4 : rc4EncryptWithKey,
        rc4New : Arcfour,
        md5 : MD5,
        base64Encode :encode,
        base64Decode :decode
    };

});
