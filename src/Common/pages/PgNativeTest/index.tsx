import React from 'react'
import { Button } from 'antd-mobile'
import { Native } from 'Common/utils/appBridge'

import { Link } from 'react-router-dom'
// import {Images} from "config";
import Lrz from 'lrz'
import { ORG_ID } from "Common/config/index";
class Test extends React.Component<any, any> {
    // jsNeedLogin
    // h5_closeState
    // unloginResult
    // loginResult
    // ios下
    async goDetail() {
        try {
            // routeKey:'bankProduct',productId:prdId,rateId: params.RATE_ID || ''
            await Native.goProDetail({
                data: { routeKey: 'bankProduct', productId: "1000000017", rateId: '', depositTypeId: '' }
            })
        } catch (e) {
            console.log(e);
        }
    }

    // 银行列表
    async goList() {
        try {
            await Native.goBankList({
                data: { routeKey: 'bankProductList', orgId: require('Common/config/index').ORG_ID, orgName: require('Common/config/index').ORG_NAME }  //orgName 只针对ios
            }, true)
        } catch (e) {
            console.log(e);
        }
    }

    // 持仓
    async goChiC() {
        try {
            await Native.goChiC({ prdTypeId: "3", depositTypeId: "2", pId: "1" })
        } catch (e) {
            console.log(e);
        }
        // let Win: any = window
        // Win.AgoBankNativePages({
        //     routeKey: 'ok',
        //     data: {
        //         PRD_TYPE_ID: "1", DEPOSIT_TYPE_ID: "2", ID: "3"
        //     }
        // })
    }

    async closeWebView() {
        try {
            await Native.closeWebView()
        } catch (e) {
            console.log(e);
        }
    }


    async goAppLogin() {
        try {
            await Native.goAppLogin()
        } catch (e) {
            console.log(e);
        }
    }

    async goOpenHome() {
        try {
            await Native.goOpenHome({
                data: { routeKey: 'appHomeActivity', index: "0" }
            })
        } catch (e) {
            console.log(e);
        }
    }

    async goClearToken() {
        try {
            await Native.clearToken()
        } catch (e) {
            console.log(e);
        }
    }

    imgToBaseFan(e) {
        console.log(e.target.files[0])
    }

    async finishOpen() {
        try {
            await Native.openInfoSuccess({ closeState: '1', orgId: ORG_ID })
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        return <div>
            <Button style={{ background: "red" }}>app下</Button>
            <Button onClick={() => this.goOpenHome()}>比财APP首页(列表页)</Button>
        </div>
    }
}

export default Test
