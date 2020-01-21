import React from 'react'
import { observer } from 'mobx-react'
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import {BcYzmInput} from 'bc-bank-design'
// import { commonStore } from 'Common/pages/store'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'

@observer
class SecurityCode extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }
  Config = {
    getCode: true // 获取验证码方式
  }
  Store = Store
  componentDidMount() {
    let { getSecurityCode, initData, firstGetYzm } = this.Store
    initData()
    let { getCode } = this.Config//获取验证码方式(工商开户第一步就发送，其他的得调用)
     //进入页面默认发送一次验证码
    getCode ? getSecurityCode() : firstGetYzm() // 如果getCode为flase，则会走firstGetYzm函数，不调验证码接口
  }
  render() {
    let {  yzm, phoneNumTxt, confirm, againGetYzm, flag, timer,resetFlag,changeYzm } = this.Store
    console.log(flag,'flag');
    return <div className='securityCode'>
      {/* 头部 */}
      <Headers>输入验证码</Headers>
      <div className='securityCode-info'>
        <p>我们已发送<span>验证码</span>短信到您的手机</p>
        <p>{phoneNumTxt}</p>
      </div>
      {/*<BcYzmInput resetFlag={resetFlag} countDownFlag={flag} timer={60} click={againGetYzm} change={(e) => changeYzm(e)}> </BcYzmInput>*/}

      <BcYzmInput
          resetFlag={resetFlag}
          countDownFlag={flag} timer={timer} click={againGetYzm.bind(this)}
        change={(e) => {
            changeYzm(e)
        }}> </BcYzmInput>
      <BcButton
        isDisabled={yzm.length != 6}
        className='securityCode-confirm'
        onClick={() => {
          confirm()
        }}>确定</BcButton>
      <BottomColumn type='long' />
    </div>
  }
}
export default SecurityCode
