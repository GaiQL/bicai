interface Props {
    [propsName:string]:any
}
function Common(target):any {
    target.a = '1'
    // target.query= (() => {
    //     let url = window.location.href
    //     if (url.indexOf('?') == -1) return null
    //     var arr1 = url.split("?");
    //     var params = arr1[1].split("&");
    //     var obj = {};//声明对象
    //     for (var i = 0; i < params.length; i++) {
    //         var param = params[i].split("=");
    //         obj[param[0]] = decodeURIComponent(param[1]);//为对象赋值
    //     }
    //     return obj;
    // })()
    return null
}

export default Common