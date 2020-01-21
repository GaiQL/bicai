import React from 'react'
import { observer, inject, propTypes } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import help from 'Common/utils/Tool'
import { BcButton, BcInputMoney, BcSelectCard, BcBankInfo } from 'Common/publicCommon/index'
import { imgSrc , Images } from 'Common/config/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import {BcDealInput} from 'bc-bank-design'
import { BIZ_TYPE } from "Common/config/params.enum";
import { largeintoBtn,rechargeMoneyInputBtn } from 'Common/Plugins/recordLogInfo'


@observer
class Recharge extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    Store = Store
    dealInputRef = null;
    upperLimitOfBankCard = 5 // 最大绑定银行卡数，可配置
    UNSAFE_componentWillMount() {
        let { apiBandCardFn,getChargeAgreement,showRechargeOnoff }: any = this.Store
        apiBandCardFn();
        if( showRechargeOnoff ){ getChargeAgreement() }
    }
    componentDidMount () {
        this.dealInputRef.onInputFocus = () => {
            try {
                rechargeMoneyInputBtn()
            } catch(err) {}
        }
    }
    componentWillUnmount() {
        const { initStatus }: any = this.Store
        initStatus()
    }
    // 显示错误信息
    showErrHtml() {
        let { showErrType, bankInfo }: any = this.Store
        let errInfo = ['', '充值金额大于付款账户每笔限额规定，请调整充值金额', `充值金额需大于等于${bankInfo.chargeMinLimitAmt}元，请调整充值金额`,`请添加一张银行卡，作为充值的付款账户`]
        return (
            <div className='err-info'>
                <span />
                <div>{errInfo[showErrType]}</div>
            </div>
        )
    }
    // 是否禁用充值按钮
    isDisabledFn() {
        let { money, showErrType, defaultCard }: any = this.Store
        if (money == '' || money * 1 == 0 || money == null || showErrType || defaultCard.supportFlag == 0 && defaultCard.bankCardQuotaDescDto.availableType != 4) {
            return true
        } else {
            return false
        }
    }

    // 底部大额转入文案
    TopUpTransferIn(res): JSX.Element {
        return (
            <>
                {
                    (res.cardList ? res.cardList.length : 0) > 0 ? 
                    <p className="info-tip">单笔额度太小?
                    <span
                        className='gobig' 
                        onClick={() => {
                            try {
                                largeintoBtn() 
                            } catch(err) {}
                            this.props.history.push('/largeAmountsTransfer')}}
                    >
                        试试大额转入吧
                    </span></p> : ''
                }
            </>
        )
    }
    
    isShowArrow = true
    placeholder = '请输入充值金额'
    render() {
        let {
            money,
            isShowSelectCard,
            defaultCard,
            bankInfo,
            showErrType,
            selectedIndex,
            isShowMonthDesc,
            isRead,
            tabIsRead,
            agreementList,
            showRechargeOnoff,
            isShowHandleBtn,
            selectCardTitle
        }: any = this.Store
        let { changeMoney, nextStep, modalHandle, switchBankCard }: any = this.Store
        let res: any = bankInfo
        return (
            <div className='recharge'>
                <Headers>充值</Headers>
                <div className='info'>
                    <img src={imgSrc + res.orgBgUrl} className="img" alt="" />
                    <h4>
                        <i><img src={imgSrc + res.orgLogo} alt="" /></i>
                        <span>{res.orgName}</span>
                    </h4>
                    <p>{res.orgName}电子账户(尾号{help.fromatCardFour(res.bankElecAccountNum)})</p>
                    <p>余额{res.balanceDesc}元</p>
                </div>
                <div className='info-cash'>
                    <div className="input-box">
                        <p className="buy-words">充值金额</p>
                        <BcDealInput
                            value={money}
                            placeholder = {this.placeholder}
                            handleChange={(val) => changeMoney(val)}
                            refs={(el) => this.dealInputRef = el}
                        />
                    </div>
                    {showErrType ? this.showErrHtml.bind(this)() : ''}
                    <BcBankInfo
                        bizType={BIZ_TYPE.recharge}
                        className={showErrType ? 'is-border-top' : ''}
                        isShowArrow={this.isShowArrow == false ? false : true}
                        isShowMonthDesc={false}
                        defaultBank={defaultCard}
                        name={res.realName}
                        curPage="recharge"
                        telList={res.custServiceHotLine}
                        history={this.props.history}
                        idCard={res.userCardId}
                        defaultPhone={res.bankCardPhone}
                        onClick={this.isShowArrow == false ? false : () => modalHandle(true)}>
                    </BcBankInfo>
                </div>
                <BcSelectCard
                    title={selectCardTitle}
                    isShowHandleBtn={isShowHandleBtn}
                    isShowMonthDesc={isShowMonthDesc}
                    bizType={BIZ_TYPE.recharge}
                    name={res.realName}
                    idCard={res.userCardId}
                    bindMutiCardsFlag={res.bindMutiCardsFlag}
                    cardList={res.cardList}
                    visible={isShowSelectCard}
                    telList={res.custServiceHotLine}
                    closeModal={() => modalHandle(false)}
                    curPage="recharge"
                    selectedIndex={selectedIndex}
                    history={this.props.history}
                    defaultPhone={res.bankCardPhone}
                    notifyBankInfo={(index, selectedBank) => switchBankCard(index, selectedBank)}
                    upperLimitOfBankCard={this.upperLimitOfBankCard}
                >
                </BcSelectCard>
                {/* 下一步按钮 */}

                {
                    showRechargeOnoff?
                        <div className={'recharge-agree'}>
                            <div>
                                <i onClick={() => tabIsRead()}><img src={isRead ? Images.selected : Images.select} alt="" /></i>
                                <p>本人已阅读并同意
                                    {agreementList.length && agreementList.map(ele => {
                                        return <span key={ele} onClick={() => { this.props.history.push('/agreement?url=' + ele.agreementUrl) }}>{ele.agreementTitle}</span>
                                    })}
                                </p>
                            </div>
                        </div>
                    :
                        null
                }
                <BcButton isDisabled={this.isDisabledFn()} onClick={() => nextStep()}>充值</BcButton>
                {this.TopUpTransferIn(res)}
                <BottomColumn type='long' />
            </div>
        )
    }
}
export default Recharge
