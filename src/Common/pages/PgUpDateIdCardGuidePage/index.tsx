import React from 'react'
import { Headers} from 'Common/publicCommon/index'
import { observer} from 'mobx-react'
import { BottomColumn } from 'Common/publicCommon/index'
import Store from './store'
import "./index.scss"
@observer
class UpDateIdCardGuidePage extends React.Component<any, any>{
    Store = Store
    render() {
        return (
            <div style={{height:"100%",boxSizing:"border-box"}}>
                <Headers>更新身份证信息操作指引</Headers>
                <iframe style={{width:"100%",height:"100%"}} src="https://finsuit-test.oss-cn-beijing.aliyuncs.com/open_api_bank/h5/html/254/bhh.html">
                </iframe>
                <BottomColumn type='long' ></BottomColumn>
            </div>
        )
    }

}
export default UpDateIdCardGuidePage