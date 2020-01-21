import {action, configure, observable, runInAction} from 'mobx'
import PgBuy from './PgBuy/store'
import PgBankDetail from './PgBankDetail/store'
import PgInputSmsCode from './PgInputSmsCode/store'
import PgOpenPerfection from './PgOpenPerfection/store'
import PgOpenSuccess from './PgOpenSuccess/store'
import { publicStore } from './public/store'
import PgOpenFlow from './PgOpenFlow/store'
import PgOpenAddBankCard from './PgOpenAddBankCard/store'
import PgBankList from './PgBankList/store'
import PgBoundBank from './PgBoundBank/store'
import PgChangePhone from './PgChangePhone/store'
import PgChangeBank from './PgChangeBank/store'
import PgGetPrdInfo from './PgGetPrdInfo/store'
import PgNativeStatus from './PgNativeStatus/store'
import PgRecharge from './PgRecharge/store'
import PgRedeem from './PgRedeem/store'
import PgTradingCode from './PgTradingCode/store'
import PgUpdateIdCard from './PgUpdateIdCard/store'
import PgWithdraw from './PgWithdraw/store'
import PgServiceSmsCode from './PgServiceSmsCode/store'
import TradeRequestMethod from './public/TradeRequestMethod'
import PglargeAmountsTransfer from './PgLargeIntoHome/store'
import PgRiskQuestions from './PgRiskQuestions/store'
import PgUpdateSmsCode from './PgUpdateSmsCode/store'
import ReactDOM from 'react-dom';

// import PgAssessmentLevel from './PgAssessmentLevel/store'
// import PgRiskAppraisal from './PgRiskAppraisal/store'
// import PgDepositDetail from './PgDepositDetail/store'
// import PgRevenueList from './PgRevenueList/store'
import {ActionSheet, Modal, Toast} from 'antd-mobile';
import {INNER_CODE} from "Common/config/params.enum";

// 切回app时关闭除了Loading外的Toast提示；
document.addEventListener("visibilitychange", () => {
    if ( !document.hidden ) {
        const amToastMask = document.getElementsByClassName('am-toast-mask');
        if( amToastMask.length ){
            Array.from( amToastMask ).forEach(element => {
                const loadingOnoff = element.contains( element.getElementsByClassName('am-icon-loading')[0] )
                if( !loadingOnoff ){
                    if( document.body.contains(element) ){
                        setTimeout(()=>{
                            if( element.parentNode ){
                                ReactDOM.unmountComponentAtNode( <Element> element.parentNode );
                            }
                        })
                    }
                }
            });
        }
    }
})

configure({ enforceActions: "observed" })

let Alert = null

interface T {
    text: string,
    onPress: any
}
// import
const PageConfig = require('Common/config/bank.zh.json')
export class ComStore {
    static query() {
        throw new Error("Method not implemented.");
    }
    @observable publicBaseData = {
        cancel: '取消',
        sure: '确定'
    }
    @observable Hash = null
    @observable alertTitle = '提示'
    @observable PageConfig = PageConfig
    @observable currentTimestamp = +new Date();
    @observable initialHeight = 0  // 底部组件第一次加载的时候赋值
    @action.bound

    changeAlertTitle(alertTitle?) {
        // 修改100000情况下的title
        if (alertTitle) {
            this.alertTitle = alertTitle
        }
    }

    @action.bound
    getHistory = (val) => {
        this.closeAlert()
        ActionSheet.close()
        runInAction(() => {
            this.alertTitle = '提示'
            this.Hash = val
        })
    }
    // 获取当前页面url参数对象
    query = () => {
        let url = window.location.href
        if (url.indexOf('?') == -1) return null
        var arr1 = url.split("?");
        var params = arr1[1].split("&");
        var obj = {};//声明对象
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split("=");
            obj[param[0]] = decodeURIComponent(param[1]);//为对象赋值
        }
        return obj;
    }
    openAlert = (title: string, msg?: string, data?: Array<T | any>) => {
        console.log(msg);
        Alert = Modal.alert(title, msg, data)
    }

    closeAlert = () => {
        Alert && Alert.close()
    }
    calculateBottomPosition = () => {
        runInAction(() => { this.currentTimestamp = +new Date() })
    }
    //开户的报错码表
    errCode(code) {
        let codeList = [
            {
                code: INNER_CODE.ModifyInfo,
                confirmTit: "修改信息",
                hist: '/openPerfection'
            },
            {
                code: INNER_CODE.ModifyOpenInfo,
                confirmTit: "修改开户信息",
                hist: '/openPerfection'
            },
            {
                code: INNER_CODE.SubmitAndDoThing,
                confirmTit: "确定",
                hist: '/openPerfection'
            },
            {
                code: INNER_CODE.CancelAndUpdateIdCard,
                confirmTit: "更新身份证",
                hist: `/updateIdCard?errCode=${INNER_CODE.CancelAndUpdateIdCard}`
            },
            {
                code: INNER_CODE.DoFaceDiscern,
                confirmTit: "重新活体识别",
                hist: "/openPerfection?errCode=" + INNER_CODE.DoFaceDiscern
            }
        ]
        if (code) {
            return codeList.map(item => {
                if (item.code == code) return item
            }).filter(item => item)[0]
        }
        return null
    }
}

export let commonStore = new ComStore()
export default ComStore
export {
    PgBuy,
    PgBankDetail,
    PgInputSmsCode,
    PgOpenPerfection,
    PgOpenSuccess,
    publicStore,
    PgOpenFlow,
    PgOpenAddBankCard,
    PgBankList,
    PgBoundBank,
    PgChangePhone,
    PgChangeBank,
    PgGetPrdInfo,
    PgNativeStatus,
    PgRecharge,
    PgUpdateIdCard,
    PgRedeem,
    PgTradingCode,
    PgWithdraw,
    PgServiceSmsCode,
    TradeRequestMethod,
    PglargeAmountsTransfer,
    PgRiskQuestions,
    PgUpdateSmsCode
}

