import React from 'react'
import { observer } from 'mobx-react'
import {Headers} from 'Common/publicCommon/index'
import Store from './store'
import { commonStore } from "Common/pages/store"
import './style.scss'
@observer
class AnalysisText extends React.Component<any, any>{
    Store = Store
    state = {
        protoolText: ''
    }
    componentDidMount() {
        let query:any = commonStore.query()
        let { openAnAccountAgreementContentFn } = this.Store
        console.log(JSON.parse(query.itemAgreement),'6666')
        openAnAccountAgreementContentFn( { agreementCode: JSON.parse(query.itemAgreement).agreeOnlineFlag }).then( res => {
            this.setState({  protoolText: res.data.protoolText })
        })
    }
    render() {
        return (
            <div>
                <div className='PgDeal'>
                    <Headers>服务协议</Headers>
                    <div className='PgDeal-txt' dangerouslySetInnerHTML={{__html:`<div>${this.state.protoolText}</div>`}}></div>
                </div>
            </div>
        )
    }
}
export default AnalysisText