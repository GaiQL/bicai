
import React from 'react'
import './style.scss'
import { Headers, BcButton } from '../../../Common/publicCommon'
import { Toast } from "antd-mobile";
import { session } from "Common/utils/store";
import goBC from "Common/utils/goBC";
import { Images } from "../../../Common/config";
import { ORG_ID } from "Common/config/index";
import BottomColumn from '../../../Common/publicCommon/BottomColumn'
import { commonStore } from "../../../Common/pages/store"
import { Native } from "Common/utils/appBridge";

class PgOpenWaiting extends React.Component<any, any>{
    Config = {
        title: '开户处理中',
        orderMsgTitle: '开户处理中',
        orderMsgContent: '银行已经受理，请您耐心等待'
    }

    complate() {
        if (Native.isApp()) {
            try {
                // todo 需要判断app是购买开户来的还是其他情况。
                // 分三种
                // 购买开户去购买：
                // 银行资产开户去电子账户 ？
                // 二类户去开户关掉页面 ？
                // Native.closeWebView()
                Native.openInfoSuccess({ closeState: 1, orgId: ORG_ID })

            } catch (e) {
                Toast.info('app开户成功后跳转页')
            }
        } else {
            if(session.get('h5FormPage')){
                window.location.replace(session.get('h5FormPage'))
                return
            }
            if (session.get('query')) {
                //  老代码！有实际去掉
                let { toPage, proId } = session.get('query')
                switch (toPage) {
                    case 'buy':
                        this.props.history.replace('buy?proId=' + proId)
                        break;
                    // case 'open':
                    //     this.props.history.replace('openFlow')
                    //     break;
                    case 'order':
                        Toast.info('产品已经下架')
                        break;
                    case 'bankAssets':
                        this.props.history.replace('bankDetail')
                        break;
                    case 'BankAccount':
                        goBC({
                            name: 'BankAccount',
                            type: 'replace',
                            params: {
                                CHANNEL_ID: session.get('channelId'),
                            }
                        });
                        break;
                    default:
                        this.props.history.replace('bankDetail')
                }
            } else {
                this.props.history.replace('bankDetail')
            }
        }
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
export default PgOpenWaiting