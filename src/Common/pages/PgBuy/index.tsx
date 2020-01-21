import React from 'react'
import { observer } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import { BcButton, BcImitateInput, BcSelectCard } from 'Common/publicCommon/index'
import help from 'Common/utils/Tool'
import { Modal } from 'antd-mobile';
import { imgSrc, Images } from 'Common/config/index'
import { session } from "Common/utils/store";
import { BcDealInput } from 'bc-bank-design'
import BottomColumn from 'Common/publicCommon/BottomColumn';
import Store from './store'
import { commonStore } from "Common/pages/store"
import { BIZ_TYPE } from "Common/config/params.enum";
import {buyPage} from 'Common/Plugins/recordLogInfo'
import refresh from 'Common/assets/images/refreshs.png'

@observer
class Buy extends React.Component<any, any>{

    Store = Store
    isArguments = true
    isPurchasesDifferentError = false // 二次购买的时候若输入的金额低于最小递增的整数倍进行错误提示【不针对起购做错误提示】
    isExtraCopy = false // 是否有额外文案【购买按钮下面，类似支取提示】
    upperLimitOfBankCard = 5 // 最大绑定银行卡数，可配置

    // 争对不同产品的文案可配置
    state = {
        ModificationOfCopyRightType: {
            HeadCopy: '存入',
            PurchaseCopy: '存入金额',
            BtnCopy: '存入'
        },
        selectImg: Images.select,
        selectedImg: Images.selected,
        isEdit: true, // 是否编辑（唤起键盘）
        isRegError: false, // 余额不足去充值超出限额错误提示
        RegErrorIndex: 0,  // 充值错误文案获取
        isShowText: true,
        isRefreshBalance: false, // 是否启动刷新动画
    }

    // 获取产品信息
    async getProductInformation(query): Promise<any> {
        let { apiQueryPrdInfo, getApiQueryPurchaseCount} = this.Store
        if (query && query.proId) { // 当前如果存在产品id 就保存在session  以防错误情况再次购买产品id还存在
            session.set('proId', query.proId)
            await apiQueryPrdInfo(query.proId,query)
            this.isPurchasesDifferentError ? await getApiQueryPurchaseCount({ prdIndexId: query.proId}) : null
        }
    }

    // 获取外部传递的参数
    async getOuterChainParameters(): Promise<any> {
        let { getProInfo } = this.Store
        if (session.get('buyParams')) {
            let res: any = session.get('buyParams')
            await getProInfo(res)
        } else {
            await getProInfo()
        }
    }

    // 获取产品协议
    async getProductAgreement(query): Promise<any> {
        let { buyAgreementFn, getAgreementList } = this.Store
        if (this.isArguments) {
            await buyAgreementFn(query.proId).then(res => {
                getAgreementList(res)
            })
        }
    }

    // 获取卡列表信息
    async getUserCardList(): Promise<any> {
        let { getBankCard } = this.Store
        await getBankCard()
    }

    // 优先级高的其他方法【不依赖下面任何方法】
    OtherMethodsWithHighPriority() {}

    // 优先级低的其他方法【依赖下面的其中一种方法=====如：当前产品信息等】
    OtherMethodsWithLowPriority() {}

    async componentDidMount(): Promise<any> {
        let query: any = commonStore.query()
        try { buyPage(query.proId) } catch(err) {}
        this.OtherMethodsWithHighPriority()
        await this.getProductInformation(query)
        await this.getProductAgreement(query)
        await this.getUserCardList()
        await this.getOuterChainParameters()
        this.OtherMethodsWithLowPriority()
    }

    Config:any = {}
    componentWillUnmount() {
        let { initStatus } = this.Store // 改变状态
        initStatus()
    }

    // 是否有额外文案【购买按钮下面，类似支取提示】
    buyExtraCopy(): JSX.Element {
        return <div className="info-tip"></div>
    }

    // 显示错误的信息
    showErrHtml = () => {
        let { showErrType, bankCardInfo } = this.Store
        let errItem = ''
        if (bankCardInfo.buyMaxLimitAmt) { // 此处逻辑只兼容了最大购买，千和万的逻辑
            if (bankCardInfo.buyMaxLimitAmt * 1 / 10000 >= 1) {
                errItem = `存入金额大于最高购买限额${bankCardInfo.buyMaxLimitAmt / 10000}万元，请调整存入金额`
            } else {
                errItem = `存入金额大于最高购买限额${bankCardInfo.buyMaxLimitAmt / 1000}千元，请调整存入金额`
            }
        }
        // 是否增加可配置的错误判断+
        let errInfo = ['', '存入金额小于起存金额，请调整存入金额', errItem , '请输入递增金额的整数倍', '存入金额大于最高购买限额20万元，请调整存入金额']
        return (
            <div className='err-info'>
                <span></span>
                <div>{errInfo[showErrType]}</div>
            </div>
        )
    }
    // 是否禁用存入按钮
    isDisabledFn() {
        let { money, showErrType } = this.Store
        if (money == null || showErrType || money == '' || help.clearComma(money) * 1 == 0) {
            return true
        } else {
            return false
        }
    }

    editInputRef = null;

    // 调起充值键盘顺便监听键盘输入事件
    editInputHander = (): void => {
        let { changeMoneys, bankCardInfo, selectedCardInd } = this.Store
        this.setState({
            isEdit: false
        })
        this.editInputRef.focus()
        this.editInputRef.onInputChange = (e) => {
            let curBankInfo: any = bankCardInfo.cardList[selectedCardInd]
            let Quota: String = curBankInfo.bankCardQuotaDescDto.singleDedct
            let chargeMinLimitAmt: String = bankCardInfo.chargeMinLimitAmt
            if (Number(e.target.value) * 1 < Number(chargeMinLimitAmt) * 1) {
                this.setState({
                    isRegError: true,
                    RegErrorIndex: 0
                })
            }
            if (Number(e.target.value) * 1 > Number(Quota) * 1) {
                this.setState({
                    isRegError: true,
                    RegErrorIndex: 1
                })
            } else {
                this.setState({
                    isRegError: false
                })
            }
            changeMoneys(e.target.value)
        }
        this.editInputRef.onInputBlur = () => {
            this.setState({
                isEdit: true
            })
        }
    }

    // 调起充值收银台，对输入金额的错误判断
    prepaidCopy = (): JSX.Element => {
        let { isRegError, RegErrorIndex, isShowText } = this.state
        let { bankCardInfo } = this.Store
        let chargeMinLimitAmt: String = bankCardInfo.chargeMinLimitAmt
        let errInfo = [`充值金额需大于等于${chargeMinLimitAmt}元，请调整充值金额`, '充值金额大于付款账户每笔限额规定，请调整充值金额']
        return <p className={isRegError ? "info info-color" : "info"}>{isRegError ? errInfo[RegErrorIndex] : (isShowText ? '您还需充值' : '')}</p>
    }

    // 充值按钮错误置灰
    prepaidCopyErrorBtn(): boolean {
        let { isRegError } = this.state
        let { rechargeMoney } = this.Store
        let rechargeMoneyClear = help.clearComma(rechargeMoney)
        if (isRegError) {
            return true
        }
        if (!Number(rechargeMoneyClear)){
            return true
        }
        if (rechargeMoneyClear == '' || Number(rechargeMoneyClear) * 1 == 0){
            return true
        }
        return false
    }

    // 显示各种弹框
    showModalHtml() {
        let { isEdit, ModificationOfCopyRightType } = this.state
        let { rechargeInfo, modalType, rechargeMoney, bankCardInfo, seconds, btnTextTime, isShowHandleBtn, selectedCardInd, balance }: any = this.Store
        let { retrieve, confirmRecharge, completeHandle, rechargeBtn, curHandle, onClose }: any = this.Store
        if (modalType == 1) {
            return (
                <BcSelectCard
                    title='账户余额不足，请进行充值'
                    bizType={BIZ_TYPE.buy}
                    isShowHandleBtn={isShowHandleBtn}
                    visible={true}
                    defaultPhone={bankCardInfo.bankCardPhone}
                    name={bankCardInfo.realName}
                    idCard={bankCardInfo.userCardId}
                    bindMutiCardsFlag={bankCardInfo.bindMutiCardsFlag}
                    cardList={bankCardInfo.cardList}
                    history={this.props.history}
                    selectedIndex={selectedCardInd}
                    notifyBankInfo={(index, currentBank) => curHandle(index, currentBank)}
                    curPage='buy'
                    upperLimitOfBankCard={this.upperLimitOfBankCard}
                    extraCardListCopy={<p className='additional-cardlist-tip'>付款账户</p>}
                    closeModal={() => onClose()}
                >
                </BcSelectCard>
            )
        } else if (modalType == 2) {
            return (
                <Modal
                    className={isEdit ? 'common-modal' : 'common-modal fixed'}
                    popup
                    transparent
                    title={<div className='common-tit'><span></span><span>充值</span><span><img src={require('Common/assets/images/close.png')} alt="" onClick={() => {
                        this.setState({isRegError: false})
                        onClose()
                    }} /></span></div>}
                    visible={modalType == 2}
                    onClose={() => {
                        this.setState({ isRegError: false })
                        onClose()
                    }}
                    animationType="slide-up"
                >
                    <div className='recharge-content'>
                        <p className='recharge-content-balance'>电子账户余额：{help.formatNum(balance)}元</p>
                        {this.prepaidCopy()}
                        <div className='editInputRe'>
                            <BcDealInput
                                refs={(el) => this.editInputRef = el}
                                value={rechargeMoney}
                            />
                        </div>
                        <div className={isEdit ? '' : 'rechargeMoney-edit'} onClick={() => {
                            this.setState({ isShowText: false })
                            this.editInputHander()
                        }}>
                            <span>¥</span>
                            <span>{help.clearComma(rechargeMoney)}</span>
                            <span style={{ display: isEdit ? 'none' : 'block'}}><i className='inputcursor'></i></span>
                            <span className='editicon'>
                                <img src={require('Common/assets/images/edit.png')} alt=""/>
                            </span>
                        </div>
                        {
                            isEdit ?
                                <BcButton isDisabled={this.prepaidCopyErrorBtn()} className="confirm-recharge" onClick={() => confirmRecharge()}>确认充值</BcButton>
                                :
                                null
                        }
                    </div>
                </Modal>
            )
        } else if (modalType == 3) {
            return (
                <div className='code-modal common-modal'>
                    <div className='common-tit' style={{ border: '1px solid #DDDDDD' }}>
                        <span></span>
                        <span>请输入充值验证码</span>
                        <span style={{ marginRight: '15px' }}><img src={require('Common/assets/images/close.png')} alt="" onClick={() => onClose(this.child)} /></span>
                    </div>
                    <div className='msg-content'>
                        <p>短信已发送至{help.fromatMobileFilter(bankCardInfo.bankCardPhone)}</p>
                        <div className="code-box">
                            <BcImitateInput className="input" onRef={(el) => { this.child = el }} max={6} isShowBoard={modalType == 3} notifyComplate={(val) => completeHandle(val, this.child)} />
                            <div className={seconds <= 0 ? 'seconds isEdit' : 'seconds isSeconds'} onClick={() => retrieve()}>{seconds <= 0 ? '重新获取' : `${seconds}秒后重发`}</div>
                        </div>
                    </div>
                </div>
            )
        } else if (modalType == 4) {
            return (
                <Modal
                    className="common-modal"
                    popup
                    transparent
                    visible={true}
                    onClose={() => onClose()}
                    animationType="slide-up"
                >
                    <section className="status-box">
                        <img src={rechargeInfo.orderStatus == 0 || rechargeInfo.orderStatus == 20000 ? Images.success : Images.err} alt="" width="60" height="60" />
                        <p className="status-words">
                            {
                                rechargeInfo.orderStatus == 0 ? '充值成功' : rechargeInfo.orderStatus == 20000 ? '充值处理中' : '充值失败'
                            }
                        </p>
                        <p className="status-details" dangerouslySetInnerHTML={{ __html: rechargeInfo.orderStatus == 0 || rechargeInfo.orderStatus == 20000 ? rechargeInfo.orderMsgContent : rechargeInfo.popMsg }} >
                        </p>
                        <BcButton className="status-btn" onClick={() => rechargeBtn(rechargeInfo, bankCardInfo.cardList[selectedCardInd])}>
                            {
                                rechargeInfo.orderStatus == 0 ? `立即${ModificationOfCopyRightType.BtnCopy}(${btnTextTime})` : rechargeInfo.orderStatus == 20000 ? '完成' : (rechargeInfo.innerCode == 100011 ? '去签约' : '重新充值')
                            }
                        </BcButton>
                    </section>
                </Modal>
            )
        }
    }
    // 中关村添加，第一次购买显示协议，再次购买不需要协议出现  isShowArgument  继承组件传递参数，是否有该需求 true为有 不传则没有
    showArgument = () => {
        let { agreementList, isRead, isV, tabIsRead, selectFlag, goAgreement } = this.Store
        let { isShowArgument = false } = this.Config
        let { selectedImg, selectImg } = this.state
        if (isShowArgument) {
            if (!selectFlag) {
                return <div className={isV ? 'agreementers' : 'none'}>
                    <i className='icer' onClick={() => tabIsRead(!isRead)}><img src={isRead ? selectedImg : selectImg} alt="" /></i>
                    <p>本人已阅读并同意
                        {agreementList.length ? agreementList.map((ele, index) => {
                            return <em key={index} onClick={() => { goAgreement(ele) }}>{ele.agreementTitle}</em>
                        }) : ''}
                    </p>
                </div>
            } else {
                return null
            }
        } else {
            return <div className={isV ? 'agreementers' : 'none'}>
                <i className='icer' onClick={() => tabIsRead(!isRead)}><img src={isRead ? selectedImg : selectImg} alt="" /></i>
                <p>本人已阅读并同意
                    {agreementList.length ? agreementList.map((ele, index) => {
                        return <em key={index} onClick={() => { goAgreement(ele) }}>{
                            ele.agreementTitle
                        }
                            {
                                index + 1 == agreementList.length ? null : <i>、</i>
                            }</em>
                    }): ''}
                </p>
            </div>
        }
    }
    child = null
    refresh = null

    refreshBalance = async() => {
        let { checkTheBalance } = this.Store
        console.log(this.state.isRefreshBalance)
        if (!this.state.isRefreshBalance) {
            try {
                this.setState({ isRefreshBalance: true })
                await checkTheBalance()
                setTimeout(() => {
                    this.setState({ isRefreshBalance: false })
                }, 1800)
            } catch (err) {
                // this.setState({ isRefreshBalance: false })
            }

        }

    }
    render() {
        let {
            isV,// 是否有协议
            money,
            modalType,
            bankCardInfo,
            showErrType,
            showBuyMinLimitAmt,
            buyMinIncreAmt,
            orgName,
            prdName,
            orgLogo,
            balance
        }: any = this.Store
        console.log(this.state.isRefreshBalance, 'fffff')
        let { changeMoney, confirmBuy }: any = this.Store
        let { ModificationOfCopyRightType, isRefreshBalance} = this.state
        // if(session.get('comBuyParams')){
        //     alert(JSON.stringify(session.get('comBuyParams')))
        //     alert(JSON.stringify(session.get('buyParams')))
        //     alert(money)
        // }
        let isEdit = session.get('comBuyParams') ? ((session.get('comBuyParams').groupPrdFlag == '1' && money) ? false : true) : true
        return (
            <div className="buy-box" >
                <Headers>{session.get('comBuyParams') ? ((session.get('comBuyParams').groupPrdFlag == '1' && money) ? '平衡存入' : ModificationOfCopyRightType.HeadCopy) : ModificationOfCopyRightType.HeadCopy}</Headers>
                {/* <div className="buy-info">
                    <div className="left">
                        <img src={imgSrc + orgLogo} alt="" />
                        <div>
                            <p className="prdName">{prdName}</p>
                            <p>{orgName}</p>
                        </div>
                    </div>
                    <div className="right">
                        <p>起投金额{showBuyMinLimitAmt}元</p>
                        <p>最小递增{buyMinIncreAmt}元</p>
                    </div>
                </div> */}

                <div className="buy-box-info-title">
                    <div className="info-logo">
                        <img src={imgSrc + orgLogo} alt="" />
                    </div>
                    <div className="info-text">
                        {orgName} | {prdName}
                    </div>
                </div>
                <div className="buy-box-info-rules">
                    <span>起投金额{showBuyMinLimitAmt}元，最小递增{buyMinIncreAmt}元</span>
                </div>
                <div className="buy-money">
                    <div className="input-box">
                        <p className="buy-words">{ModificationOfCopyRightType.PurchaseCopy}</p>
                        <BcDealInput
                            value={money}
                            isEdit={isEdit}
                            handleChange={(val) => changeMoney(val)}
                        />
                        {/* <BcInputMoney
                            isFormat={true}
                            isShowAll={false}
                            val={money}
                            isShowDelIcon={money}
                            handleChange={(e) => changeMoney(e)}
                            handleDel={() => delMoney()}
                            handleFormat={(type) => FormatMoney(type)} /> */}
                    </div>
                    {showErrType ? this.showErrHtml.bind(this)() : ''}
                    {/* <div className={`buy-bank ${showErrType ? '' : 'border'}`}>
                        <span>付款账户</span>
                        <span>{orgName}电子账户({help.fromatCardFour(bankCardInfo.bankElecAccountNum)})</span>
                        <div className='account'>账户余额：{help.formatNum(balance)}元</div>
                    </div> */}


                </div>
                {/* <div className="buy-line"></div> */}
                <div className="two-card-box">
                    <div className="two-card-box-logo">
                        <img src={require('Common/assets/images/cardlogo.png')} alt=""/>
                    </div>
                    <div className="two-card-box-wrap">
                        <span>{orgName}电子账户({help.fromatCardFour(bankCardInfo.bankElecAccountNum)})</span>
                        <div className='account'>
                            <span className='balance-contant'>可用余额：{help.formatNum(balance)}元</span>
                            <div className='refresh-loding' ref={(el) => { this.refresh = el }} onClick={() => {
                                this.refreshBalance()
                            }}>
                                <img src={refresh} style={{ animation: isRefreshBalance ? 'refresh 1s linear' : '' }} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                {this.showArgument()}
                <BcButton className={isV ? 'buy-btn' : 'buy-btn mt36px'} isDisabled={this.isDisabledFn.bind(this)()} onClick={() => {
                    this.setState({ isShowText: true})
                    confirmBuy()
                }}>{ModificationOfCopyRightType.BtnCopy}</BcButton>
                {this.isExtraCopy ? this.buyExtraCopy() : null}
                {modalType ? this.showModalHtml.bind(this)() : ''}
                <BottomColumn type='long' />
            </div>
        )
    }

}
export default Buy
