import { Native } from "Common/utils/appBridge"
import React, { Component } from 'react'
import { Toast } from 'antd-mobile';
import { imgSrc } from 'Common/config/index'
import Headers from 'Common/publicCommon/Headers'
import { session } from "Common/utils/store";
import "./style.scss"
import { observer, inject } from 'mobx-react'
import { commonStore } from "Common/pages/store"
import Store from "./store"
@observer
class PgCallbackNative extends React.Component {
    Store = Store
   
    componentDidMount() {
        if (!sessionStorage.getItem("nativeNum")) { sessionStorage.setItem("nativeNum", "0") }
        let num = Number(sessionStorage.getItem("nativeNum")) + 1;
        if (num == 2) {
            Native.closeWebView();
            return;
        }
        sessionStorage.setItem("nativeNum", String(num));
        let { type }: any = commonStore.query()
        let { openSuccess,detailsPage} = this.Store
            if (type === "OpenAccount") {
               setTimeout(()=>{
                openSuccess()
               },2000)
            }else{
                detailsPage()
            }
            this.setState({
                type:false
            })

    }



    render() {
        let { orgName, orgLogo }:any = JSON.parse(session.get("bankData"))|| {}
        return (
            <div className="banklonding">
                <Headers type={"empty"}>{orgName}</Headers>
                <div className="londingBox">
                    <div>
                        <img src={imgSrc + orgLogo} alt="" className="orgLogo" />
                        <span className="orgName">{orgName}</span>
                    </div>
                    <p className="londingText">正在跳转至{orgName}页面…</p>
                </div>
            </div>
        )
    }
}
export default PgCallbackNative
