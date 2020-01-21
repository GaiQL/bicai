import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import help from 'Common/utils/Tool'
import Headers from 'Common/publicCommon/Headers'
import { BottomColumn } from 'Common/publicCommon/index'
import { BcButton, BcSelectCard, BcBankInfo } from 'Common/publicCommon/index'
import { imgSrc } from 'Common/config/index'
import Store from './store'
import { BcDealInput } from 'bc-bank-design'
import {BIZ_TYPE} from "Common/config/params.enum";


@observer
class Withdraw extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    Store = Store
    upperLimitOfBankCard = 5 // 最大绑定银行卡数，可配置
    UNSAFE_componentWillMount() {
        let { initializeDidMount } = this.Store
        initializeDidMount();
    }
    // 显示错误信息
    showErrHtml() {
        const { bankInfo, showErrType }: any = this.Store
        let maxMoney = bankInfo.withdrawMaxLimitAmt * 1
        let errItem = ''
        if (maxMoney / 10000 >= 1 ) {
            errItem = `单笔最大限额为${maxMoney / 10000}万元，请调整提现金额`
        } else {
            errItem = `单笔最大限额为${maxMoney / 1000}千元，请调整提现金额`
        }
        const errInfo = ['', '提现金额大于卡内余额，请调整提现金额', `每笔提现最低${bankInfo.withdrawMinLimitAmt}元，请调整提现金额`, errItem,`请添加一张银行卡，作为提现的入账账户`]
        return (
            <div className="err-info">
                <span></span>
                <div>{errInfo[showErrType]}</div>
            </div>
        )
    }
    // 是否禁用提现按钮
    isDisabledFn() {
        let { money, showErrType,defaultCard}:any = this.Store
        if (money == '' || money == null || showErrType || help.clearComma(money) * 1 == 0 || defaultCard.supportFlag == 0 && defaultCard.bankCardQuotaDescDto.availableType !=4) {
            return true
        } else {
            return false
        }
    }
    componentWillUnmount () {
        let { initStatus } = this.Store
        initStatus()
    }
    render() {
        let {tipShow, tipShow1, isShowDesc, isShowMonthDesc, isShowArrow, isShowTip, money, bankInfo, showErrType, isShowSelectCard, defaultCard,selectedIndex,selectCardTitle }: any = this.Store
        let { changeMoney, getAllMoney, nextStep, modalHandle,switchBankCard,getBalanceOnoff,balanceData,accRestDoc } = this.Store
        return (
            <div className='withdraw'>
                <Headers>提现</Headers>
                <div className='info'>
                    <img src={imgSrc + bankInfo.orgBgUrl} className="img" alt="" />
                    <h4>
                        <i><img src={imgSrc + bankInfo.orgLogo} alt="" /></i>
                        <span>{bankInfo.orgName}</span>
                    </h4>
                    <p>{bankInfo.orgName}电子账户(尾号{help.fromatCardFour(bankInfo.bankElecAccountNum)})</p>
                    <p>{accRestDoc}{bankInfo.balanceDesc}元</p>
                </div>
                <div className='info-cash'>
                    <div className="input-box" >
                        <p className="buy-words">提现金额</p>
                        <BcDealInput
                            extra={'全部'}
                            value={money}
                            handleExtra={() => getAllMoney()}
                            placeholder={`可转出到卡${ ( getBalanceOnoff?balanceData.withdrawalAmountDesc:bankInfo.balanceDesc ) || '0.00' }元`}
                            handleChange={(val) => changeMoney(val)}
                        />
                    </div>
                    {showErrType ? this.showErrHtml.bind(this)() : ''}
                    <BcBankInfo
                        bizType={BIZ_TYPE.withdraw}
                        className={showErrType ? 'is-border-top' : ''}
                        title = '入账账户'
                        isShowDesc={isShowDesc}
                        isShowArrow={isShowArrow}
                        isShowMonthDesc={isShowMonthDesc}
                        onClick={() => modalHandle(true)}
                        defaultBank={defaultCard}
                        history={this.props.history}
                        telList={bankInfo.custServiceHotLine}
                        curPage='withdraw'
                        name={bankInfo.realName}
                        idCard={bankInfo.userCardId}
                        defaultPhone={bankInfo.bankCardPhone}>
                    </BcBankInfo>
                </div>
                {
                    isShowArrow ? <BcSelectCard
                        title={selectCardTitle}
                        bizType={BIZ_TYPE.withdraw}
                        visible={isShowSelectCard}
                        history={this.props.history}
                        name={bankInfo.realName}
                        idCard={bankInfo.userCardId}
                        bindMutiCardsFlag={bankInfo.bindMutiCardsFlag}
                        curPage='withdraw'
                        telList={bankInfo.custServiceHotLine}
                        selectedIndex={selectedIndex}
                        closeModal={() => modalHandle(false)}
                        cardList={bankInfo.cardList}
                        defaultPhone={bankInfo.bankCardPhone}
                        isShowDesc={isShowDesc}
                        notifyBankInfo={switchBankCard}
                        upperLimitOfBankCard={this.upperLimitOfBankCard}
                    >
                    </BcSelectCard> : ''
                }
                <BcButton  isDisabled={this.isDisabledFn()} onClick={() => nextStep()} >提现</BcButton>
                {isShowTip ? <p className='info-tip'>{tipShow}<br/>{tipShow1}</p> : ''}
                <BottomColumn type='long'></BottomColumn>
            </div>
        )
    }
}
export default Withdraw
