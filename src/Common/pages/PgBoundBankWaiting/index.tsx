
import React from 'react'
import './style.scss'
import { Headers, BcButton } from 'Common/publicCommon'
import { Images } from "Common/config";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { commonStore } from "Common/pages/store"

class BoundBankWaiting extends React.Component<any, any>{
    Config = {
        title: '绑定结果',
        orderMsgTitle: '绑定处理中',
        orderMsgContent: '银行已经受理，预计两小时内处理完成'
    }

    complate() {
        commonStore.Hash.history.replace('/boundBank?page=service')
    }
    render() {
        let {title, orderMsgTitle, orderMsgContent} = this.Config;
        return (
            <div className="buy-results">
                <Headers type="empty">{title}</Headers>
                <section>
                    <img src={Images.wait} alt="" width="60" height="60" />
                    <div className="status">{orderMsgTitle}</div>
                    <div className="result" dangerouslySetInnerHTML={{ __html: orderMsgContent }}></div>
                </section>
                <BcButton onClick={this.complate.bind(this)}>完成</BcButton>
                <BottomColumn type='long'/>
            </div>
        )
    }
}
export default BoundBankWaiting