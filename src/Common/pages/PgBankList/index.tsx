import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import { imgSrc } from 'Common/config/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
let str = "<p>备注：</p><p>1.代收业务：下列银行需开通银联在线支付功能：招商银行、兴业银行、浦发银行、平安银行；</p><p>2.光大银行需在柜面或个人网银开通电子支付功能;</p><p>3.银联在线支付开通地址：<a href='https://www.95516.com/portal/open/init.do?entry=open'>https://www.95516.com/portal/open/init.do?entry=open</a>或在各银行个人网银中开通;</p><p>4.实际转账限额如遇到临时调整，以发卡行最总设定为准。</p>"
import Store from './store'
import {descFn} from '../../publicCommon/util'
import Withdraw from '../PgWithdraw/index';

@observer
class BankList extends React.Component<any, any>{
    async componentDidMount() {
        let { initData } = this.Store
        initData()
    }
    Store = Store
    render() {
        let { result }: any = this.Store
        let { supportBankList, supportBankRemarks } = result
        return <div className='BankList'>
            {/* 头部 */}
            <Headers>支持银行</Headers>
            <div className='BankList-list'>
                {console.log(result, "数据")}
                {
                    supportBankList && supportBankList.map((bank, index) => {
                        let {bankCardQuotaDescDto} = bank
                        let {dayDesc,monthDesc} = descFn(3,bankCardQuotaDescDto)
                        let withdrawDesc = descFn(4,bankCardQuotaDescDto)
                        console.log(withdrawDesc);
                        return <div className='BankList-list-item' key={index}>
                            <p>
                                <img src={imgSrc + bank.bankLogoUrl} alt="" />
                            </p>
                            <p>
                                <span>{bank.bankName}</span>
                                {/*有的话就展示*/}
                                {
                                    dayDesc
                                        ? <span>{dayDesc} </span>
                                        : null
                                }
                                {
                                    monthDesc
                                        ? <span>{monthDesc} </span>
                                        : null
                                }
                                {/*提现有的话就展示*/}
                                {
                                    withdrawDesc.dayDesc
                                        ? <span>{withdrawDesc.dayDesc} </span>
                                        : null
                                }
                                {
                                    withdrawDesc.monthDesc
                                        ? <span>{withdrawDesc.monthDesc} </span>
                                        : null
                                }
                            </p>
                        </div>
                    })
                }

            </div>
            {
                supportBankRemarks ? <div className="footer" dangerouslySetInnerHTML={{ __html: supportBankRemarks }} /> : null
            }
            <BottomColumn type='long'/>
        </div>
    }
}
export default BankList
