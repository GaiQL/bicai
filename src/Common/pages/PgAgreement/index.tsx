import React from 'react'
import { observer } from 'mobx-react'
import { BANK_HOST } from 'Common/config/index'
import {Headers} from 'Common/publicCommon/index'
import { imgSrc } from "Common/config";


@observer
class Agreement extends React.Component<any, any>{
    render () {
        let href = window.location.href
        let url = href.indexOf('url') > -1 ? href.substring(href.indexOf('url') + 4, href.length).replace(/@/g, '?') : ''
        return (
            <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Headers>服务协议</Headers>
                <iframe src={`${url.indexOf('http:') != -1 ? url : imgSrc + '/' + url}`} style={{width:'100%', flex: '1', border:'0'}}></iframe>
            </div>
        )
    }
}
export default Agreement