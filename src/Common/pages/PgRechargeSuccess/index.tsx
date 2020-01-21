import * as React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import { Toast } from 'antd-mobile';//ui组件
import Headers from 'Common/publicCommon/Headers'
// import BcButton from 'Common/publicCommon/BcButton'
import { BcButton, BcBankMark } from 'Common/publicCommon/index'
import {Images} from "Common/config/index";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import { commonStore } from "Common/pages/store"


@observer
class RechargeSuccess extends React.Component<any, any>{
    Store = Store
    render() {
        let { sub, goBackProductList}:any = this.Store
        let res:any = commonStore.query()
        return <div className='recharge-success'>
            {/* 头部 */}
            <Headers type="empty">充值结果</Headers>
            <div className='success'>
                <img src={Images.success}  alt="充值成功" className="icon-success" />
                <p className="text">充值成功</p>
            </div>
            <div className='info'>
                <p>充值金额
                    <span>{res && res.amountDesc}</span>
                
                </p>
                <p>交易流水号
                    <span>{res && res.reqSerial}</span>
                </p>
                <p>交易时间
                    <span>{res && res.optionDate}</span>
                </p>
            </div>
            {/* 下一步按钮 */}
              <BcButton  onClick={()=>goBackProductList()} >购买产品</BcButton>
             {/* 下一步按钮 */}
             <BcButton  className="ant-btn-dashed"  onClick={()=>sub()} >查看余额</BcButton>
              {/* <BcBankMark logo={res.bankIcon} name={res.bankName}></BcBankMark> */}
             <BottomColumn type='long'></BottomColumn> 
        </div>
    }
}
export default RechargeSuccess