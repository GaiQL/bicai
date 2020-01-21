import React from 'react'
import './style.scss'
import { observer } from 'mobx-react'
import { Headers, BcButton, BottomColumn } from 'Common/publicCommon/index'
import help from 'Common/utils/Tool'
import { commonStore } from "Common/pages/store"
import Store from './store'
import { BcYzmInput } from 'bc-bank-design'

@observer
class PgsigningSmsCode extends React.Component<any, any> {
    Store = Store
    state = {
        code: "", // 验证码
    }
    UNSAFE_componentWillMount() {
        let params: any = commonStore.query()
        let { initState } = Store
        let { phoneNum, bankCardNum } = params
        initState(phoneNum, bankCardNum)
    }
    componentDidMount() {
        let { apiSendPhoneCodeFn } = Store
        apiSendPhoneCodeFn()
    }
    render() {
        let { code } = this.state
        let { sendCodeFlag, phone, timer, resetFlag, againGetYzm, confirm } = Store
        let title = `输入代收通道签约验证码`
        return (
            <div className='securityCode'>
                <Headers>{title}</Headers>
                <div className='securityCode-info'>
                    <p>我们已发送<span>验证码</span>短信到您的手机</p>
                    <p>{help.fromatMobileFilter(phone)}</p>
                </div>
                <BcYzmInput
                    resetFlag={resetFlag}
                    countDownFlag={sendCodeFlag}
                    timer={timer}
                    click={(fn) => {
                        againGetYzm(fn)
                    }}
                    change={(e) => {
                        this.setState({ code: e })
                    }}>
                </BcYzmInput>
                <BcButton
                    isDisabled={code == "" || code.length != 6}
                    className='securityCode-confirm'
                    onClick={() => confirm(code)}>确定</BcButton>
                <BottomColumn type='long' />
            </div>
        )
    }
}

export default PgsigningSmsCode
