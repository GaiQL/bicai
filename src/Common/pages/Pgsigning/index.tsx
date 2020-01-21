import React, {useEffect, useState} from 'react'
import Headers from 'Common/publicCommon/Headers'
import { BcButton, BottomColumn } from 'Common/publicCommon/index'
import './index.scss'
import Store from './store'
import { commonStore } from "Common/pages/store"
import help from 'Common/utils/Tool'

class PgSigning extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            Card: {},             // 地址栏传递的卡list的参数【选中的需要充值的银行卡】
            source: ''            // 来源 【从那个页面跳转的签约，购买需要跳转回购买页面】
        }
    }
    componentWillMount() {
        let query: any = commonStore.query()
        this.setState({
            Card: JSON.parse(query.defaultCard),
            source: query.source
        })
    }
    toGoNextStart = async() => {
        let query: any = commonStore.query()
        let { bankCardPhone, bankCardNum, bankName } = this.state.Card
        this.props.history.replace(`/signingSmsCode?phoneNum=${bankCardPhone}&bankName=${bankName}&bankCardNum=${bankCardNum}&defaultCard=${query.defaultCard}&source=${this.state.source}`)
    }

    render() {
        let { bankName, lastFourCardNo, bankCardPhone } = this.state.Card
        return (
            <>
                <div className="signing-wrap">
                    <Headers>代收通道签约</Headers>
                    <div className="signing-msg-content">
                        <div className="signing-msg-bankname">
                            <div className="signing-msg-bankname-title">
                                付款账户
                        </div>
                            <div className="signing-msg-bankname-details">
                                {bankName}{lastFourCardNo}
                            </div>
                        </div>
                        <div className="signing-msg-phone">
                            <div className="signing-msg-phone-title">
                                预留手机号
                        </div>
                            <div className="signing-msg-phone-details">
                                {help.fromatMobileFilter(bankCardPhone)}
                            </div>
                        </div>
                    </div>
                    <BcButton isDisabled={false} onClick={() => {
                        this.toGoNextStart()
                    }} >下一步</BcButton>
                    <BottomColumn type='long'></BottomColumn>
                </div>
            </>
        )
    }

    
}

export default PgSigning