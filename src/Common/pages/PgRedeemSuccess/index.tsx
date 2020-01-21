/**
 * @author  Mr.ma
 * @use     支取成功的页面
 * @date    2019-05-31
 * @params  支取成功接口返回的字段信息展示
 */

import React from 'react'
import './style.scss'
import { Toast } from 'antd-mobile';
import { Headers, BcButton, BcBankMark } from 'Common/publicCommon/index'
import { observer, inject } from 'mobx-react'
import { Images } from "Common/config/index";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import { commonStore } from "Common/pages/store"

@observer
class RedeemSuccess extends React.Component<any, any> {
    Store = Store
    Config:any = {
        profitDescOnOff : true,
        isReqSerial:false, //是否有交易流水号
    }
    render() {
        let res: any = commonStore.query()
        let { complate } = this.Store
        return (
            <div className='redeem-success'>
                <Headers type="empty">支取结果</Headers>
                <div className='success'>
                    <img src={Images.success} alt="支取成功" className="icon-success"/>
                    <p className="text">支取成功</p>
                </div>
                <div className='info'>
                    <p>支取本金
                        <span>{res.amountDesc}</span>
                    </p>
                    { 
                        this.Config.profitDescOnOff?
                        <p>支取利息
                            <span>{res.profitDesc}</span>
                        </p>
                        :null
                    }
                    <p>收款账户
                        <span>{res.bankElecAccountNum}</span>
                    </p>
                    { 
                        this.Config.isReqSerial?
                        <p>交易流水号
                            <span>{res.reqSerial}</span>
                        </p>
                        :null
                    }
                    <p>交易时间
                        <span>{res.optionDate}</span>
                    </p>
                </div>
                <BcButton onClick={()=>complate()}>完成</BcButton>
                <BottomColumn type='long'></BottomColumn>
            </div>
        )
    }
}
export default RedeemSuccess