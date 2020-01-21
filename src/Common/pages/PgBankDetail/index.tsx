import React from 'react'
import './style.scss'
import { observer, inject } from 'mobx-react'
import { Headers } from 'Common/publicCommon'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile'
import { imgSrc } from 'Common/config/index'
import { session } from "Common/utils/store";
import { Native } from "Common/utils/appBridge"
import { commonStore } from "Common/pages/store"
import Store from './store'
import IconSvg, { IconOpenEyes, IconCloseEyes, IconSet } from './IconSvg'
import { INNER_CODE } from "Common/config/params.enum";
import { holdProductsBtn, bankHomeRechargePageBtn, bankHomeWithdrawBtn, lookAllProductsBtn } from 'Common/Plugins/recordLogInfo'


const { openAlert, changeAlertTitle } = commonStore

declare let document

@observer
class BankDetail extends React.Component<any, any> {
    state = {
        reast: true,
        closeType: true
    }
    Store = Store

    UNSAFE_componentWillMount(): void {
        // document.getTags()
        document.getElementById('root').style.backgroundColor = '#f5f5f5'
    }

    componentWillUnmount(): void {
        document.getElementById('root').style.backgroundColor = '#fff'
    }

    async componentDidMount() {
        let { initData } = this.Store //
        initData()
    }

    // 只做日切判断
    judgeFnDate = async (type, apiTradeCheckFn) => {
        changeAlertTitle('维护信息')
        try {
            if (type == '充值') {
                await apiTradeCheckFn({ tradeType: 10 })
                this.props.history.push('/recharge')
            }
            if (type == '提现') {
                await apiTradeCheckFn({ tradeType: 20 })
                session.set('withdrawType', 'bankDetail')
                this.props.history.push('/withdraw')
            }
        } catch (err) {
            switch (err.innerCode) {
                case INNER_CODE.CancelAndUpdateIdCard:
                    openAlert(type + '失败', err.popMsg, [
                        {
                            text: '取消', onPress: () => {
                                console.log('取消');
                            }
                        },
                        {
                            text: '更新身份证', onPress: () => {
                                this.props.history.push('/updateIdCard')
                            }
                        },
                    ])
                    break;
                case INNER_CODE.PasswordNotSet:
                    openAlert('提示', err.popMsg, [
                        {
                            text: '立即设置', onPress: async () => {
                                let url = window.location.href.split("#/")[0]
                                let { apiBank } = this.Store
                                try {
                                    await apiBank.resetPayPwd({
                                        tranBackAdd: url + "#/bankDetail",
                                        tranBackExceptAdd: url + "#/bankDetail",
                                        fallbackUrl: url + "#/bankDetail",
                                        operateType:"06"
                                    }).then((data: any) => {
                                        let url = data.operateURL //获取银行url地址
                                        this.setState({
                                            closeType: false
                                        })
                                        window.location.href = url
                                    })
                                } catch (error) {

                                }
                            }
                        },
                    ])
                    break;
                case INNER_CODE.goBcFaceDiscern: // 比财活体暂时跳过，到下一页判断吧 
                    // this.tradeCheckSuccess(data, params, [])
                    openAlert('提示', err.popMsg, [
                        {text: '取消', onPress: () => console.log('取消'), style: {color: "#999999"}},
                        {
                            text: '确定', onPress: () => {
                                this.props.history.push(`/faceDiscern?type=back&backPath=${window.location.hash.split('?')[0].substr(1)}`)
                            }
                        },
                    ])
                    break;
            }
        }
    }
    // 做身份验证和日切判断
    judgeFn = async (type, idCardStatusFn, apiTradeCheckFn) => {
        changeAlertTitle('维护信息')

        try {
            await idCardStatusFn()
            try {

                if (type == '充值') {
                    await apiTradeCheckFn({ tradeType: 10 })
                    this.props.history.push('/recharge')
                }
                if (type == '提现') {
                    await apiTradeCheckFn({ tradeType: 20 })
                    session.set('withdrawType', 'bankDetail')
                    this.props.history.push('/withdraw')
                }
            } catch (err) {

            }

        } catch (err) {
            if (err.innerCode && err.innerCode == INNER_CODE.CancelAndUpdateIdCard) {
                openAlert(type + '失败', err.popMsg, [
                    { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                    {
                        text: '更新身份证', onPress: () => {
                            this.props.history.push('/updateIdCard')
                        }
                    },
                ])
            }
        }
    }
    topUp = (type) => {
        let { idCardStatusFn, apiTradeCheckFn } = this.Store
        if (type == '充值') {
            try {
                bankHomeRechargePageBtn()
            } catch (err) {}            
        } else {
            try {
                bankHomeWithdrawBtn()
           } catch (err) {}   
        }
        // this.judgeFn(type, idCardStatusFn, apiTradeCheckFn)
        // 身份证状态； 0正常，1过期
        // 身份证审核状态； 0审核中，1审核成功，2审核失败
        let { isjudge = false } = this.props
        if (isjudge) {
            this.judgeFn(type, idCardStatusFn, apiTradeCheckFn)
        } else {
            this.judgeFnDate(type, apiTradeCheckFn)
        }
    }

    async goBuyOther() {
        try {
            lookAllProductsBtn()
        } catch(err) {}

        if (Native.isApp()) {
            try {
                await Native.goBankList({
                    data: {
                        routeKey: 'bankProductList',
                        orgId: require('Common/config/index').ORG_ID,
                        orgName: require('Common/config/index').ORG_NAME
                    }
                }, false)   //银行列表

            } catch (e) {
                Toast.info(e)
            }
        } else {
            Toast.info('不再app内')
        }

    }

    splitCardNo(num) {
        let arr = []
        if (num) {
            let bankNoArr: any = num.split('')
            for (let i = 0, j = 0; i < bankNoArr.length; i++) {
                if (!arr[j] && arr[j] !== '') arr[j] = ''
                if (i / 4 < j + 1) {
                    arr[j] += bankNoArr[i]
                } else {
                    arr[j + 1] = ''
                    arr[j + 1] += bankNoArr[i]
                    j++
                }
            }
        }
        return arr
    }

    // depositTypeMsg = (depositTypeId) => {
    //     let depositTypeMsg = ['', '活期存款', '智能存款', '结构性存款', '定期存款']
    //     return depositTypeMsg[depositTypeId]
    // }


    toHoldProductList = (item) => {
        // 点位： 持有产品按钮
        try {
            holdProductsBtn(item.prdType, item.depositTypeId)
        } catch(err) {}
        
        this.props.history.push(`/holdProductList?depositTypeId=${item.depositTypeId}&prdType=${item.prdType}&prdTypeName=${item.prdTypeName}`)
    }

    twoCardTemplate = (result, isHide, setHide, userAccount) => {
        return <div className='BankDetail-card'>
            <div className='BankDetail-card-bg'>
                {/* <img className="BankDetail-card-bg-img" src={imgSrc + result.logBackgroundUrl} alt="" /> */}
                {
                    result.bankBgUrl ?
                        <img className="BankDetail-card-bg-img" src={imgSrc + result.bankBgUrl} alt="."
                            onClick={() => {
                                return false
                            }} /> : <img className="BankDetail-card-bg-img"
                                src='https://finsuit-test.oss-cn-beijing.aliyuncs.com/ORG/5f61d266-e7af-41fe-99e8-3bb529e71b6c.jpg'
                                alt="." onClick={() => {
                                    return false
                                }} />
                }
                <p className='BankDetail-card-logo'>
                    <img src={imgSrc + result.bankLogo} alt="" />
                </p>
                <p className='BankDetail-card-bankName'>
                    <span>{result.bankName}</span>
                </p>
                <p className='BankDetail-card-iconHide' onClick={() => setHide()}>
                    {
                        isHide ? <IconOpenEyes /> : <IconCloseEyes />
                    }
                </p>
                <p className='BankDetail-card-iconSet' onClick={() => {
                    this.props.history.push('/moreService')
                }}>
                    <IconSet />
                </p>

                <p className={'BankDetail-card-bankNum'}>
                    {
                        userAccount.map((num, index) => {
                            return <span key={index}>{isHide ? num : num.replace(/\d/g, '*')}</span>;
                        })
                    }
                </p>
                <p className={'BankDetail-card-copy'} onClick={() => {
                    copy(result.bankElecAccountNum);
                    Toast.info('复制成功')
                }}>
                    <span>复制</span>
                </p>

                <div className='BankDetail-card-oper'>
                    <p>
                        <span>账户余额</span>
                        <span>{isHide ? result.balanceDesc : "******"}</span>
                    </p>
                    <p>
                        <span onClick={this.topUp.bind(this, '充值')}>充值</span>
                        <span onClick={this.topUp.bind(this, '提现')}>提现</span>
                    </p>
                </div>
            </div>
        </div>
    }

    render() {
        let { result, isHide, setHide } = this.Store
        let userAccount = this.splitCardNo(result.bankElecAccountNum)
        return (
            <div className={'BankDetail'}>
                {/* 头部 */}
                <Headers type={this.state.closeType ? "close" : "back"}>{result.bankName || ' '}</Headers>
                {/*userCardIdCheck 身份证审核状态（2审核未通过 1通过）*/}
                {/*cardStatusMsg 身份证过期状态描述(资产首页顶部错误描述)*/}
                {/*userCardIdExpire 身份证过期状态（0正常 1过期）*/}
                {console.log(result.userCardIdExpire)}
                {
                    (result.userCardIdCheck == 2 || result.userCardIdExpire == 1)
                        ? <p
                            onClick={() => {
                                this.props.history.push('/updateIdCard?type=bankDetail')
                            }}
                            className='BankDetail-tip'><span>{result.cardStatusMsg}</span><IconSvg color='#F4AA39' /></p>
                        : null
                }
                
                {this.twoCardTemplate(result, isHide, setHide, userAccount)}
                <div className='BankDetail-property'>
                    <div className='BankDetail-property-detail'>
                        <p>
                            <span>总资产</span>
                            <span>(元)</span>
                        </p>
                        <p>
                            <span onClick={() => {
                                this.props.history.push({
                                    pathname: '/tradingDetail', query: {
                                        a: 1,
                                        b: 2
                                    }
                                })
                            }}>明细</span>
                            <IconSvg wid='11' hte='11' />
                        </p>
                    </div>
                    <p className='BankDetail-property-money'><span>{isHide ? result.totalAssetDesc : "***********"}</span>
                    </p>
                    <div className='BankDetail-property-earnings'>
                        <p>
                            <span>昨日收益</span>
                            <span>{isHide ? ((result.ysdIncome >= 0 ? '+' : '') + (result.ysdIncomeDesc || '0.00')) : "*****"}</span>
                        </p>
                        <p>
                            <span>累计收益</span>
                            <span>{isHide ? (((result.totalIncome && result.totalIncome >= 0) ? '+' : '') + (result.totalIncomeDesc || '0.00')) : "********"}</span>
                        </p>
                    </div>
                </div>
                <div className='BankDetail-product-list'>
                    <div className='BankDetail-product-tit'>
                        <p>持有产品</p>
                    </div>
                    {
                        result.prodList && result.prodList.map((item, index) => {
                            return <p
                                onClick={() => {
                                    // holdProductList deposit
                                    this.toHoldProductList(item)
                                    // Native.goChiC({prdTypeId:item.prdType,depositTypeId:item.depositTypeId,pId:''})
                                }}
                                key={index}>
                                <span><svg width={4} height={4} className='circle'>
                                    <circle cx="2" cy="2" r="2" fill="#508CEE" />
                                </svg>
                                    {item.prdTypeName}</span>
                                <span>{isHide ? '¥' + item.holdAmountDesc : "****"}</span>
                            </p>
                        })
                    }
                </div>
                {
                    session.get('isBicaiApp') == '1' ?
                        <p className='BankDetail-prod-check' onClick={this.goBuyOther.bind(this)}>
                            <span>查看本行全部产品</span>
                            <IconSvg />
                        </p> : null
                }
                {/* <BottomColumn type="tran"/> */}
                <BottomColumn type='long' />
            </div>
        );
    }
}

export default BankDetail
