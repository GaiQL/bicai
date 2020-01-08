(function() {
    window.enentH5 = function(fn) {
            fn()
    }
    //  是否打开 vConsole
    // if (('finsuit.bicai365.com'.indexOf(window.location.host) == -1 || new GetRequest().env != 'pro') && VConsole) {
    //     var vConsole = new VConsole()
    // }
    // 与原生交互的方法
    window.sendParam = sendParam //
        // 手动挂载
    window.loginResult = loginResult // ios登录
        // 存储环境标示
    if (new GetRequest().env) {
        window.sessionStorage.setItem('env', JSON.stringify(new GetRequest().env))
    }
    if (new GetRequest().theme) {
        window.sessionStorage.setItem('theme', JSON.stringify(new GetRequest().theme))
    }

})()

/**
 * base64
 * @constructor
 */
function MyBase64() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding
    this.encode = function(input) {
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
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function(input) {
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
    _utf8_encode = function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

/**
 * 原生给h5传参数
 * @param val
 */
function sendParam(val) {
    reLoginState(val)
        // loginResult(val)
    window.sessionStorage.setItem("isBicaiApp", '1')
    window.sessionStorage.setItem("nativeData", val)
}

/**
 * 二次登录处理
 * @param val
 */
function reLoginState(val) {
    var mBase = new MyBase64()
    var proData = JSON.parse(mBase.decode(val))
    if (proData.type && proData.type == 'reLoginState') {
        var token = proData.head.token
        if (token) {
            window.sessionStorage.setItem('_MX_BICAI_TOKEN', JSON.stringify(token))
        }
        //  window.location.reload()
    }
}

/**
 * ios 2.0 登录
 * @param val
 */
function loginResult(val) {
    var mBase = new MyBase64()
    var proData = JSON.parse(mBase.decode(val))
    if (proData.TOKEN) {
        //   alert("进来了")
        var token = proData.TOKEN
        window.sessionStorage.setItem('_MX_BICAI_TOKEN', JSON.stringify(token))
            //  window.location.reload()
    }
}

/**
 * 获取url参数
 * @returns {*}
 * @constructor
 */
function GetRequest() {
    console.log('初始的location.href', location.href);
    var url = location.hash.split('?')[1]; //获取url中"?"符后的字串
    if (url) {
        url = '?' + url
    } else {
        return null
    }
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}