import {session} from './store'
import {BanksH5URL} from 'Common/config/index'
export default function ({type = 'replace', orgId, name , params = {}}:any) {
    let host = session.get('OriginHost') || BanksH5URL.yiyeH5Url
    var urlEncode = function (param, key?, encode?) {
        console.log(param);
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                paramStr += urlEncode(param[i], k, encode)
            }
        }
        return paramStr;
    }
    var obj = {
        ...params
    }
    var s = urlEncode(obj)
    let href = host + "/#/" + name + '?' + s
    console.log('href>>>>>>>.', href);
    if (type == 'push') {
        window.location.href = href
    } else {
        window.location[type](href)
    }


};
