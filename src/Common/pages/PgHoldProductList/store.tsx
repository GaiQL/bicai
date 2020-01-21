import { observable, runInAction } from "mobx";
import { ListView, Toast } from 'antd-mobile';
import { commonStore } from 'Common/pages/store'
import { session } from "Common/utils/store";
import goBC from "Common/utils/goBC"
import { Native } from "Common/utils/appBridge"
import { INNER_CODE } from "Common/config/params.enum";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { withdrawingInAdvanceBtn, againDepositBtnBtn, buyLookCombinationDetailsBtn } from 'Common/Plugins/recordLogInfo'
import {otherWebHandle} from 'Common/utils/goOtherWeb'
const { openAlert, changeAlertTitle } = commonStore
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

interface apiTradeCheckType {
    // [propsName:string]:any,
    tradeType: 10 | 20 | 30 | 40, // 10:充值 20：提现 30：购买 40：支取
    prdIndexId: any,
    prdIndexName: string,
    reqSerial: any,
    fieldValue: any,
    amount: any,
    bankSerialNum: string;
    buyDate?: string,
    expireDate?: string
    depositTypeId?: string
    rate?: any //利率
    payInterestDate? :any //到息日
}

export class PgProductList extends StoreExtends {
    Store = commonStore

    @observable incomeUrl = ''


    @observable dataSource = dataSource
    @observable list = [] // 数据源
    @observable currentPage = 0 // 当前第几页
    @observable totalPage = 0 // 总共页数
    @observable isLoading = true
    @observable params: any = {}
    @observable totalHoldAmount = ''
    @observable height = document.documentElement.clientHeight
    @observable navStatus = 0 // 默认展示第一列
    @observable totalIncomeDesc = ''// 总收益
    @observable totalYesIncome = '' // 昨日收益
    @observable unPayProfit = '' // 待派发收益
    @observable pageType = '' // 分页的类型
    @observable nextFlag = 0 // 0 无 1 有
    @observable currentPageStatus = 0 //  0 ->  暂无数据   1 -> 加载完成
    @observable moduleFlag = false
    @observable totalHoldAmountDesc = ''
    @observable totalIncome = ''
    @observable defaultText = '维护信息'
    @observable needNote = false  //导航栏上方的提示开关；
    @observable noteOnoff = false  // 请求持有中列表后再展示提示；
    @observable noteStr = "" //导航栏上方的提示字符串；
    // 初始化可能缓存的状态
    initStatus = () => {
        runInAction(() => {
            this.params = this.Store.query()
            this.currentPage = 0
            this.navStatus = 0
            this.currentPageStatus = 0
            this.list = []
            this.dataSource = this.dataSource.cloneWithRows(this.list)
        })
    }
    //组合购买跳转路由
    // todp
    goDetail = (groupTradeProductId) =>{
        try {
            buyLookCombinationDetailsBtn(groupTradeProductId)
        } catch(err) {}
        otherWebHandle.goCombinationDetailsFn({groupTradeProductId})
    }

    showModule = (incomeUrl) => {
        runInAction(() => {
            this.moduleFlag = true
            this.incomeUrl = incomeUrl
        })
    }
    onClose = () => {
        runInAction(() => {
            this.moduleFlag = false
        })
    }
    // 切换nav
    switchNav = (status) => {
        const { navStatus, params } = this
        if (status === navStatus) return
        runInAction(() => {
            this.navStatus = status
            this.list = []
            this.dataSource = this.dataSource.cloneWithRows([])
            this.isLoading = true
        })
        if (status) {
            this.getMyInvestOver(params)
        } else {
            this.getHoldInfo(params)
        }
    }
    // 上拉加载
    onEndReached = () => {
        let { currentPage, navStatus, params, nextFlag, pageType, totalPage } = this
        runInAction(() => {
            this.isLoading = true,
                this.currentPage = this.currentPage + 1
        })
        console.log(pageType)
        if (pageType == 'LIMIT' || pageType == 'NEXTPAGE') {
            if (nextFlag == 0) {
                runInAction(() => {
                    this.isLoading = false
                })
                return
            }
        } else {
            console.log(currentPage, totalPage)
            if (currentPage * 1 >= totalPage * 1) {
                runInAction(() => {
                    this.isLoading = false
                })
                return
            }
        }

        if (navStatus) {
            this.getMyInvestOver(params, this.currentPage)
        } else {
            this.getHoldInfo(params, this.currentPage)
        }

    }
    // 对于支取的活动的提示信息逐个展示
    loopModal = (curNum = 0, list, prdIndexId, reqSerial, amount, bankSerialNum, otherParams?) => {
        if (list[curNum].resCode == 2) {
            this.Store.openAlert('提示', list[curNum].resMsg, [
                {
                    text: '确定', onPress: () => {
                    }, style: { color: "#508CEE" }
                }
            ])
        } else {
            this.Store.openAlert('提示', list[curNum].resMsg, [
                { text: '取消', style: { color: "#508CEE" }, onPress: () => console.log('cancel') },
                {
                    text: '继续支取', style: { color: "#999999" }, onPress: () => {
                        if (curNum == list.length - 1) {
                            this.Store.Hash.history.push(`/redeem?prdIndexId=${prdIndexId}&reqSerial=${reqSerial}&amount=${amount}&bankSerialNum=${bankSerialNum}`)
                            return false
                        }
                        ++curNum
                        this.loopModal(curNum, list, prdIndexId, reqSerial, amount, bankSerialNum, otherParams)
                    }
                }
            ])
        }
    }
    goOpenHome = () => {
        try {
            Native.goOpenHome({
                data: { routeKey: 'appHomeActivity', index: "0" }
            })
        } catch (e) {
            Toast.info(e)
        }
    }
    alertTitleMsg = new Map([
        [10, ['充值']],
        [20, ['提现']],
        [30, ['存入']],
        [40, ['支取']],
    ])
    // 校验成功后的操作
    tradeCheckSuccess = async (data, params, res) => {
        switch (data.tradeType) {
            case 10:
                break;
            case 20:
                break;
            case 30:
                try {
                    againDepositBtnBtn(data.prdIndexId)
                } catch (err) {
                }
                if (Native.isApp()) {
                    try {
                        await Native.goProDetail({
                            // 产品id
                            data: {
                                routeKey: 'bankProduct',
                                productId: data.prdIndexId,
                                rateId: '',
                                depositTypeId: params.depositTypeId
                            }
                        })
                    } catch (e) {
                        Toast.info(e)
                    }
                } else {
                    goBC({
                        name: 'ProdctionDetail',
                        type: 'push',
                        params: {
                            PRD_TYPE_ID: params.prdType,
                            DEPOSIT_TYPE_ID: params.depositTypeId,
                            PRD_NAME: data.prdIndexName,
                            PRO_ID: data.prdIndexId,
                            // ORG_ID: require('../config/index').ORG_ID,
                            APP_FLAG: session.get('appFlag'),
                            CHANNEL_ID: session.get('channelId'),
                        }
                    })
                }
                break;
            case 40:
                try {
                    withdrawingInAdvanceBtn(data.prdIndexId)
                } catch (err) {
                }
                if (res.length) {
                    let otherParams = {} // 其他参数【总集】
                    this.loopModal(0, res, data.prdIndexId, data.reqSerial, data.amount, data.bankSerialNum, otherParams)
                } else {
                    this.Store.Hash.history.push(`/redeem?prdIndexId=${data.prdIndexId}&reqSerial=${data.reqSerial}&amount=${data.amount}&bankSerialNum=${data.bankSerialNum}&depositTypeId=${params.depositTypeId}`)
                }
                break;
        }
    }
    // 针对再次存入/支取的校验
    apiTradeCheckFn = async (data: apiTradeCheckType) => {
        changeAlertTitle(this.defaultText)
        let {params}: any = this
        try {
            let res: any = await this.apiBank.apiTradeCheck({
                tradeType: data.tradeType,
                prdIndexId: data.prdIndexId,
                reqSerial: data.reqSerial,
                buyDate: data.buyDate,
                expireDate: data.expireDate,
                rate: data.rate||'',
                payInterestDate: data.payInterestDate||'',
            })
            this.tradeCheckSuccess(data, params, res)
        } catch (err) {

            switch (err.innerCode) {
                case INNER_CODE.SubmitAndDoThing:
                    openAlert(this.alertTitleMsg.get(data.tradeType * 1)[0] + "失败", err.popMsg, [
                        { text: '取消', onPress: () => console.log('cancel') },
                        {
                            text: '确定', onPress: () => {
                                if (Native.isApp()) {
                                    try {
                                        this.goOpenHome()  //产品下架跳转
                                    } catch (e) {
                                        Toast.info(e)
                                    }
                                } else {
                                    goBC({
                                        name: 'ProductList',
                                        type: 'push',
                                        params: {
                                            CHANNEL_ID: session.get('channelId'),
                                        }
                                    })
                                }
                            }
                        },
                    ])
                    break;
                case INNER_CODE.CancelAndUpdateIdCard:
                    openAlert(this.alertTitleMsg.get(data.tradeType * 1)[0] + '失败', err.popMsg, [
                        { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                        {
                            text: '更新身份证', onPress: () => {
                                this.Store.Hash.history.push('/updateIdCard')
                            }
                        },
                    ])
                    break;
                case INNER_CODE.CancelAndDoRedeem:
                    openAlert('提示', err.popMsg, [
                        { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                        {
                            text: '立即支取', onPress: () => {
                                this.Store.Hash.history.push(`/redeem?prdIndexId=${data.prdIndexId}&reqSerial=${data.reqSerial}&amount=${data.amount}&depositTypeId=${params.depositTypeId}`)
                                // this.Store.Hash.history.push('/updateIdCard')
                            }
                        },
                    ])
                    break;
                case INNER_CODE.goBcFaceDiscern: // 比财活体暂时跳过，到下一页判断吧
                    // this.tradeCheckSuccess(data, params, [])
                    openAlert('提示', err.popMsg, [
                        { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                        {
                            text: '确定', onPress: () => {
                                this.Store.Hash.history.push(`/faceDiscern?type=back&backPath=${window.location.hash.split('?')[0].substr(1)}&backParams=${JSON.stringify(this.params)}`)
                            }
                        },
                    ])
                    break;
                case INNER_CODE.SubmitOnly: // 100000 不做处理
                    break;
                case INNER_CODE.CancelAndCallPhone: // 100005 不做处理
                    break;
                default:
                    openAlert('提示', err.popMsg, [
                        { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                        { text: '确定', onPress: () => { } },
                    ])
                    break;
            }

        }
    }
    // 判断当前分页使用那种类型做判断
    isNextStep = (pageType, totalPage, nextFlag, list, currentPage) => {
        if (pageType == 'LIMIT' || pageType == 'NEXTPAGE') {
            // 此if的场景是后端有返回数据，但是没有下一页了，需要显示加载完成
            if (list.length && currentPage == 1 && nextFlag == 0) return 1
            return nextFlag == 0 ? 1 : 0 // 0 无 1 有
        } else {
            return totalPage * 1 ? 1 : 0
        }
    }
    // 持有中接口请求
    getHoldInfo = async (query = this.params, currentPage = 1, type?) => {
        const { depositTypeId, prdType }: any = query
        let params: any = {
            currentPage,
            prdType,
            depositTypeId,
            reqType: this.navStatus
        }
        let res: any = await this.apiBank.apiQryHoldInfo(params)
        if( this.needNote ){
            runInAction(()=>{
                this.noteOnoff = res.retList.length
            })
        }
        runInAction(() => {
            this.list = this.list.concat(res.retList)
            this.dataSource = this.dataSource.cloneWithRows(this.list)
            this.currentPage = currentPage
            this.isLoading = false
            this.unPayProfit = res.unPayProfit
            this.totalIncomeDesc = res.totalIncomeDesc
            this.totalIncome = res.totalIncome
            this.totalHoldAmount = res.totalHoldAmount
            this.totalHoldAmountDesc = res.totalHoldAmountDesc
            this.totalYesIncome = res.totalYesIncome
            this.pageType = res.pageType
            this.nextFlag = res.nextFlag
            this.totalPage = res.totalPage
            this.currentPageStatus = this.isNextStep(res.pageType, res.totalPage, res.nextFlag, res.retList, currentPage)
        })
    }
    // 已支取接口请求
    getMyInvestOver = async (query, currentPage = 1) => {
        const { depositTypeId, prdType } = query
        let params: any = {
            currentPage,
            prdType,
            depositTypeId,
            reqType: this.navStatus
        }
        let res: any = await this.apiBank.getMyInvestOver(params)
        runInAction(() => {
            this.list = this.list.concat(res.retList)
            this.dataSource = this.dataSource.cloneWithRows(this.list)
            this.currentPage = currentPage
            this.totalPage = res.totalPage
            this.isLoading = false
            this.unPayProfit = res.unPayProfit
            this.totalIncomeDesc = res.totalIncomeDesc
            this.totalIncome = res.totalIncome
            this.totalHoldAmount = res.totalHoldAmount
            this.totalYesIncome = res.totalYesIncome
            this.pageType = res.pageType
            this.nextFlag = res.nextFlag
            this.currentPageStatus = this.isNextStep(res.pageType, res.totalPage, res.nextFlag, res.retList, currentPage)
        })
    }
}

export default new PgProductList()


// handleDrow = async(prdIndexId, reqSerial, fieldValue, minRedmptAmt, minRedmptAmtMsg, buyDate, expireDate) => {
//     const { apiRedemptionValidFn } = this.props.store.Deposit
//     let data = {
//         prdIndexId,
//         buyDate: buyDate.substring(0, 10),
//         expireDate
//     }
//     apiRedemptionValidFn(data).then(res => {
//         let list = res.retList
//         if (list.length) {
//             this.loopModal(0, list, prdIndexId, reqSerial, fieldValue, minRedmptAmt, minRedmptAmtMsg)
//             // this.loopModal(0, list, prdIndexId, reqSerial, fieldValue)
//         } else {
//             this.goReedem(prdIndexId, reqSerial, fieldValue, minRedmptAmt, minRedmptAmtMsg)
//         }
//     }).catch (err => {
//         if (err.innerCode == '100000') {
//             Modal.alert("维护信息",err.popMsg, [
//                 { text: '确定', onPress: () => console.log('确定')},
//             ])
//         } else if (err.innerCode == '100004') {
//             Modal.alert("支取失败", err.popMsg, [
//                 { text: '取消', onPress: () =>  console.log('cancel'),style: {color: "#999999"}},
//                 { text: '更新身份证', onPress: () => this.props.history.push( { pathname: '/updateIdCard'}),style: {color: "#508CEE"}},
//             ])
//         }
//     })
// }
