import React from 'react'
import { observer } from 'mobx-react'
import './style.scss'
import {Headers, BcButton, BottomColumn} from 'Common/publicCommon/index'
import { Modal } from 'antd-mobile';
import { imgSrc, Images } from 'Common/config/index'
// import { session } from "Common/utils/store";
import { BcDealInput } from 'bc-bank-design'
// import Store from './store'
// import { commonStore } from "Common/pages/store"
// import { BIZ_TYPE } from "Common/config/params.enum";
// import {buyPage} from 'Common/Plugins/recordLogInfo'
// import { Session } from 'inspector'


export default class Transfer extends React.Component<any, any>{
    state = {
        isRead: true
    }
    changeMoney = (val) => {
        console.log(val)
    }
    render() {
        return (
            <div className="transfer-box">
                <Headers>产品转让</Headers>
                <div className="pro-transfer-info">
                    <div className="pro-transfer-left">
                        <div className="pro-transfer-logo">
                            <img src="" alt=""/>
                        </div>
                        <div>武汉众邦银行 | 众力存</div>
                    </div>
                    <div className="pro-transfer-right">剩余年限：3年</div>
                </div>
                <div className="friendly-reminder">预计年化：4.58%&nbsp;&nbsp;&nbsp;&nbsp;可转让金额20,000.00</div>
                <div className="transfer-input">
                    <div className="transfer-money">转让金额</div>
                    <BcDealInput
                        value={200000}
                        isEdit={true}
                        extra="|&nbsp;&nbsp;&nbsp;全部转让"
                        handleChange={(val) => this.changeMoney(val)}
                    />
                </div>
                <div className="profit-tip">预计转让后可获得收益：</div>
                <div className="agreement-box">
                    <div className='icer'><img src={this.state.isRead ? Images.selected : Images.select} alt="" /></div>
                    <div className="agreement">本人已阅读并同意《众力存产品说明书》《众力存产品转让协议》</div>
                </div>
                <BcButton className="buy-btn">存入</BcButton>
                <BottomColumn type='long' />
            </div>
        )
    }
}

