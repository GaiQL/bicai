import React from 'react'
import { observer } from 'mobx-react'
import './style.scss'
import { Headers, BcButton } from 'Common/publicCommon/index'
import {BcYzmInput} from 'bc-bank-design'
// import { commonStore } from 'Common/pages/store'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'

@observer
class PgUpdateFaceSmsCode extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }
  Config = {
    getCode: true // 获取验证码方式
  }
  Store = Store
  componentDidMount() {
    let { getSecurityCode, initData } = this.Store
    initData()
    getSecurityCode()
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
export default PgUpdateFaceSmsCode
