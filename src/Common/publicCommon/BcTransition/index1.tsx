import React from 'react'
import './style.scss'
import { imgSrc } from 'Common/config/index'
import Headers from 'Common/publicCommon/Headers'
function BcTransition(props) {
    let { orgName, logoUrl, headerText } = props
    return (
        <div className="banklonding">
            <Headers type={'empty'}>{headerText}</Headers>
            <div className="londingBox">
                <div className="logo">
                    <img src={imgSrc + logoUrl} alt="" className="orgLogo" />
                    <span className="orgName">{orgName}</span>
                    <div className="londingText">
                        <p className="goBank"> 正在跳转至{orgName}页面…</p>
                        <p>您已经进入比财和{orgName}共同打造的安全域…</p>
                    </div>
                </div>
                <div className="logdingBottom">
                    <p>比财平台和银行共同承诺</p>
                    <p className="lodingCont">
                        <span>所销售产品为该行正规产品；比财平台不设</span>
                        <span>资金池；所有开户、购买、赎回等操作都在银行后台进行。</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default BcTransition


