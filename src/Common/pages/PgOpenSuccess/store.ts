
import { observable, action, runInAction } from "mobx";
import { Toast } from "antd-mobile";
import goBC from "Common/utils/goBC";
import { session } from "Common/utils/store";
import { ORG_ID } from "Common/config/index";
import { Native } from "Common/utils/appBridge";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { openSuccessSubmitBtn } from 'Common/Plugins/recordLogInfo'
import { commonStore } from "Common/pages/store"

interface Person {
    [propName: string]: any;
}

export class PgOpenSuccess extends StoreExtends {

    goNext = async () => {
        console.log(this)
        try {
            openSuccessSubmitBtn()
        } catch (err) { }

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
            if (session.get('h5FormPage')) {
                // 外部跳转的 需要location跳回去
                window.location.replace(session.get('h5FormPage'))
                return
            }
            if (session.get('query')) {
                //  老代码！有实际去掉
                let { toPage, proId } = session.get('query')
                switch (toPage) {
                    case 'buy':
                        commonStore.Hash.history.replace('buy?proId=' + proId)
                        break;
                    // case 'open':
                    //     this.props.history.replace('openFlow')
                    //     break;
                    case 'order':
                        Toast.info('产品已经下架')
                        break;
                    case 'bankAssets':
                        commonStore.Hash.history.replace('bankDetail')
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
                        commonStore.Hash.history.replace('bankDetail')
                }
            } else {
                commonStore.Hash.history.replace('bankDetail')
            }
        }

    }


}
export default new PgOpenSuccess()
