import React from 'react'
import {Images} from "Common/config/index";
import apiBicai from 'Common/api/bicai2.0'

import "./style.scss"
class WxMiniFly extends React.Component {
    // componentDidMount(): void {
    //     this.WxInit()
    // }
    goBack(){
        console.log('回到小程序')
        const {wx}:any = window
        wx.miniProgram.navigateBack()
    }
    async WxInit() {
        const {wx}:any = window
        let POSTFIXURL = window.location.href.split('#')[0].split('//')[1]
        let res:any = await apiBicai.getWXinit({
            POSTFIXURL
        })
        let wxParam = res.wxParam
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxParam.appId, // 必填，公众号的唯一标识
            timestamp: wxParam.timestamp, // 必填，生成签名的时间戳
            nonceStr: wxParam.nonceStr, // 必填，生成签名的随机串
            signature: wxParam.signature,// 必填，签名
            jsApiList: ['chooseImage'] // 必填，需要使用的JS接口列表
        });
    }
    render() {
        let FromMini:any = window.sessionStorage.getItem('FromMini')
        return  <div>
            {
                FromMini == 1 ?  <div className="wx-init" onClick={this.goBack.bind(this)}>
                    <img src={Images.goBackWxMini} alt=""/>
                </div> :null
            }
        </div>

    }
}
export default WxMiniFly

