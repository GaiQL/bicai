import React from 'react'
import './style.scss'
import { imgSrc } from 'Common/config/index'
import Headers from 'Common/publicCommon/Headers'
function BcTransition(props) {
    let {orgName,logoUrl,headerText} = props
    return(
        <div className="banklonding">
            <Headers type={'empty'}>{headerText}</Headers>
            <div className="londingBox">
                <div>
                    <img src={imgSrc + logoUrl} alt="" className="orgLogo" />
                    <span className="orgName">{orgName}</span>
                </div>
                <p className="londingText">正在跳转至{orgName}页面…</p>
            </div>
        </div>
    )
}
export default BcTransition

