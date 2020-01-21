import React from 'react'
import './style.scss'
import {Headers, BcButton, BottomColumn} from 'Common/publicCommon/index'
import { Images } from "Common/config/index";

export default class TransferResult extends React.Component<any, any>{
    render() {
        return (
            <>
                <Headers>转让结果</Headers>
                <section>
                    <img src={Images.wait} alt="" width="60" height="60" />
                    <p className="result-tip">转让提交成功</p>
                    {/* <div className="result-content">您的转让订单已受理，请以银行处理结果为准，可在资产页关注转让状态</div>
                    <BcButton>完成</BcButton> */}
                    <div className="transfer-time">
                        <div><span>转让申请时间</span><span>2019-12-09</span></div>
                        <div><span>转让截止时间</span><span>2019-12-09</span></div>
                    </div>
                    <div className="btn-actions">
                        <BcButton>查看转让列表</BcButton>
                        <div className="complete">完成</div>
                    </div>
                </section>
                <BottomColumn/>
            </>
        )
    }
}

