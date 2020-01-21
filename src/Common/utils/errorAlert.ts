/*
 * @Author: 张政
 * @Date: 2019-06-06 13:33:22
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-07-19 09:45:24
 * @Description: 1-购买;2-充值;3-提现;5-支取 的失败弹框进行统一处理
 */

import { commonStore } from "Common/pages/store"
import { Modal } from 'antd-mobile';
import {logDealFailureAgainBuy} from 'Common/Plugins/recordLogInfo'
import {BIZ_TYPE,INNER_CODE} from 'Common/config/params.enum'
import { session } from 'Common/utils/store'
import { Native } from "Common/utils/appBridge"

/**
 * 对于失败的弹框统一处理
 */
const actions = (e, path, query = '') => {
  const _oneFn = [{ text: '确定', onPress: () => { console.log('确定') } }]
  const _twoFn = [{ text: '确定', onPress: () => {
    if (path == '/buy') {
      logDealFailureAgainBuy()
    }
    let flag: boolean = session.get('comBuyParams') ? (session.get('comBuyParams').groupPrdFlag == '1' ? false : true) : true
    if (!flag) {
      Native.closeWebView()
      return
    } else {
      commonStore.Hash.history.replace(path + (query ? `?${query}` : ''))
    }
    
} }]
  const _threeFn = [
    { text: '取消', onPress: () => console.log('cancel'), style: { color: "#999999" } },
    { text: '更新身份证', onPress: () => commonStore.Hash.history.push({ pathname: '/updateIdCard' }) },
  ]
  const _fourFn = [
    { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
    { text: '去大额转账', onPress: () => commonStore.Hash.history.replace({ pathname: '/largeAmountsTransfer' }) }
  ]
  return new Map([
    // [INNER_CODE.SubmitOnly, ['失败原因：' + e.popMsg, _oneFn]], 提取公共
    [INNER_CODE.SubmitAndDoThing, ['失败原因：' + e.popMsg, _twoFn]],
    [INNER_CODE.CancelAndUpdateIdCard, [e.popMsg, _threeFn ]],
    [INNER_CODE.LargeAmounts, [e.popMsg, _fourFn]],
    // [INNER_CODE.CancelAndCallPhone, [e.popMsg, _fourFn]] 拨打电话号码提取公共
  ])
}
// 1:绑定手机号短信验证码 2:绑卡短信验证 3:充值短信验证 4：提现短信验证码 6：存入 7:支取
const tradingStatus = new Map([
  [BIZ_TYPE.buy, ['存入', '/buy']],
  [BIZ_TYPE.investment, ['投资', '/buy']],
  [BIZ_TYPE.recharge, ['充值', '/recharge']],
  [BIZ_TYPE.withdraw, ['提现', '/withdraw']],
  [BIZ_TYPE.redeem, ['支取', '/redeem']],
  [BIZ_TYPE.jch, ['充值', '/recharge']],
  [BIZ_TYPE.cancel, ['撤单', '/cancelTheOrder']]
])

// 失败的方法
// const errHandle = (e, query = '') => {
//   let { data }: any = this.state
//   let action = actions(e.innerCode, tradingStatus.get(data.type)[1], query)
//   alert(tradingStatus.get(data.type)[0] + '失败', action.get(e.innerCode)[0], action.get(e.innerCode)[1])
// }

export {
  actions,
  tradingStatus
}
