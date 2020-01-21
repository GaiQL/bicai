import React from 'react'
import { observer } from 'mobx-react'
import { Headers } from 'Common/publicCommon'
import "./style.scss"
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { BcButton } from 'Common/publicCommon/index'
import { commonStore } from "Common/pages/store";
import { Native } from "Common/utils/appBridge";

interface Preson {

}
@observer
class PgHandlePage extends React.Component<any, Preson> {
    render() {
        let { type }: any = commonStore.query()
        console.log(type)
        return <div className="handlePage">
            <Headers type="empty">销户结果</Headers>
            <div className="handlePage-cont">
                {
                    type == "success" ? this.success() : this.inProcessing()
                }

            </div>
            <BcButton onClick={() => {
                type == "success" ? Native.closeWebView() : commonStore.Hash.history.replace("/moreService")
            }}>完成</BcButton>
            <BottomColumn type='long' />
        </div>

    }
    //成功的渲染
    success = () => {
        return < div >
            <img className="handleImg" src={require('Common/assets/images/success.png')} alt="" />
            < p className="handlePage-bigText" > 销户成功</p>
        </div >
    }
    //处理中的渲染
    inProcessing = () => {
        return < div >
            <img className="handleImg" src={require('Common/assets/images/verifySuccess.png')} alt="" />
            < p className="handlePage-bigText" > 销户处理中</p>
            <p className="handlePage-smallText">银行已经受理，请您耐心等待。</p>
        </div >
    }

}
export default PgHandlePage