import React from 'react'
import {observer} from 'mobx-react'
import './style.scss'
import {Headers} from 'Common/publicCommon'
import {BcButton} from 'Common/publicCommon'
import {BcYzmInput} from 'bc-bank-design'
import Store from './store'
import {session} from "Common/utils/store";
import BottomColumn from 'Common/publicCommon/BottomColumn'

@observer
class SecurityCode extends React.Component<any, any> {

    Store = Store
    Config = {
        getCode: true//获取验证码方式
    }

    UNSAFE_componentWillMount() {
        let {initData} = this.Store
        initData()
    }

    /**
     * 可重写
     **/
    getCode() {
        let {getSecurityCode} = this.Store
        let {getCode} = this.Config//获取验证码方式(工商开户第一步就发送，其他的得调用)
        getCode ? getSecurityCode() : null
    }
    componentDidMount() {
        //进入页面默认发送一次验证码
        this.getCode()
    }
    componentWillUnmount() {
        let {  clearYzm } = this.Store
        clearYzm()
    }

    render() {
        let {flag, againGetYzm, confirm, changeYzm, phone, yzm, resetFlag} = this.Store
        return <div className='securityCode'>

            {/* 头部 */}
            <Headers>输入验证码</Headers>
            <div className='securityCode-info'>
                <p>我们已发送<span>验证码</span>短信到您的手机</p>
                <p>{(phone || session.get("messagePhone")).replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}</p>
            </div>
            <BcYzmInput resetFlag={resetFlag} countDownFlag={flag} timer={60} click={againGetYzm} change={(e) => changeYzm(e)}> </BcYzmInput>
            <BcButton isDisabled={yzm.length != 6} className='securityCode-confirm'
                    onClick={() => confirm()}>确定</BcButton>
            <BottomColumn type='long'/>
        </div>
    }
}

export default SecurityCode
