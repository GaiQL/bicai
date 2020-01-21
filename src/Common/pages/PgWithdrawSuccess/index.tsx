import React from 'react'
import './style.scss'
import { Headers, BcButton, BcBankMark } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import { session } from 'Common/utils/store'
import { observer, inject } from 'mobx-react'
import { BottomColumn } from 'Common/publicCommon/index'
import { commonStore } from "Common/pages/store"
import Store from './store'

@observer
class WithdrawSuccess extends React.Component<any, any>{
    Store = Store
    render() {
        let res: any = commonStore.query()
        let { complate} = this.Store

        return (
            <div className='withdraw-success'>
                <Headers type="empty">提现结果</Headers>
                <div className='success'>
                    <img src={Images.success} alt="提现成功" className="icon-success" />
                    <p className="text">提现成功</p>
                </div>
                <div className='info'>
                    <p>
                        提现金额<span>{res.amountDesc}</span>
                    </p>
                    <p>
                        交易流水号
                        {
                            // res.apiPackSeq.length > 21 ? <span>{res && res.apiPackSeq.substring(0,21)}<br/>{res && res.apiPackSeq.substring(21,res.apiPackSeq.length)}</span>:
                            <span>{res.reqSerial}</span>
                        }
                    </p>
                    <p>
                        交易时间<span>{res.optionDate}</span>
                    </p>
                </div>
                <BcButton onClick={()=>complate(res.path)} >完成</BcButton>
                {/* <BcBankMark logo={res.bankIcon} name={res.bankName}></BcBankMark> */}
                <BottomColumn type='long'></BottomColumn>
            </div>
        )
    }
}
export default WithdrawSuccess