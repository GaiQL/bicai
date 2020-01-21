
import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import help from 'Common/utils/Tool'
import { BcButton, BottomColumn } from 'Common/publicCommon/index'
import { BcDealInput } from 'bc-bank-design'
import { imgSrc } from 'Common/config/index'
import { Modal} from 'antd-mobile';
import Store from './store'

const Module = ({moduleFlag, onClose, activityData, goBack,goNextRedeem}) => {
    return <Modal
        popup
        visible={moduleFlag}
        onClose={() => { onClose() }}
        animationType="slide-up"
        className='interesters'
        title={<div className='top-titles '>
        提示
            <img src={require('Common/assets/images/close.png')} alt="" onClick={() => onClose()} />
          
        </div>}
    >
        <div className='interest-wrap' dangerouslySetInnerHTML = {{__html:activityData}}>
        </div>
        <div className='redeem-box'>
            <button className="btn-1" onClick={() => { goBack() }}> 取消支取</button>
            <button className="btn-2" onClick={() => { goNextRedeem() }}>继续支取</button>
        </div> 
    </Modal>
}

@observer
class Redeem extends React.Component<any, any>{
    Store = Store
    UNSAFE_componentWillMount() {
        let { apiBandCardFn, setParams, isEditInput, apiInterestCalculationFn, isRequestRate, apiQueryPrdInfoFn, isRequestProInfo }: any = this.Store
        setParams()
        apiBandCardFn() // 银行卡信息
        isRequestProInfo ? apiQueryPrdInfoFn() : null // 获取产品信息
        // 判断有没有input如果没有直接计算利息
        if (!isEditInput) {
            if (isRequestRate) { // 添加进入页面是否请求利率接口
                apiInterestCalculationFn()
            }
        }
    }
    componentWillUnmount() {
        let { initStatus }: any = this.Store
        initStatus()
    }
    // 显示提示错误的信息
    showErrHtml() {
        let { showErrType, proInfo, MIN_MONEY }: any = this.Store
        const errInfo = ['', `支取金额需大于${MIN_MONEY}元`, '请输入递增金额的整数倍', '支取金额大于存款本金，请调整支取金额', `根据行方规定，留存金额需高于${proInfo.redeemRetainedAmt - 0}元`]
        return (
            <div className="err-info">
                <span></span>
                <div>{errInfo[showErrType]}</div>
            </div>
        )
    }
    Config: any = {
        showStatus: 1, isShowRate: true, extraText: "全部", amountPayable: '可支取金额'
    }
    // 当前显示的html文件
    showHtml(showStatus) {
        let { amountPayable = '可支取金额' }: any = this.Config // 添加参数，对不确定文案自定义
        let { bankInfo, prePageParam, INCRE_AMOUNT }: any = this.Store
        if (showStatus == 1) {
            return (
                <div>
                    <p className="money">余额{bankInfo.balanceDesc}元</p>
                    <p className="money">最小递增{INCRE_AMOUNT}元</p>
                </div>
            )
        } else if(showStatus == 2){
            return (
                <div>
                    <p className="money">{amountPayable}{help.formatNum(prePageParam.amount)}元</p>
                    <p className="money">最小递增{INCRE_AMOUNT}元</p>
                </div>
            )
        } else if(showStatus == 0) {
            return (
                <div className='showMoneyState'>
                    <p className="money">{amountPayable}{help.formatNum(prePageParam.amount)}元</p>
                </div>
            )
        }
    }
    // 是否禁用支取按钮
    isDisabledFn() {
        let { money, showErrType }: any = this.Store
        if (help.clearComma(money) * 1 == 0 || money == '' || money == null || showErrType) {
            return true
        } else {
            return false
        }
    }
    // 是否显示利率的html
    showRateHtml() {
        let { showErrType, rateInfo, money,hiddenRateNum }: any = this.Store
        return (
            <div className={"info-cash1 " + (showErrType ? 'redeem-active' : '')}>
                预计收益<i className={money != '' && money != null && rateInfo.profitDesc && !showErrType ? '' : 'none'}>{'¥' + rateInfo.profitDesc}</i>
                {
                    hiddenRateNum?null:
                    <span >利率<i className={money != '' && money != null && rateInfo.rate && !showErrType ? '' : 'none'}>{rateInfo.rate + '%'}</i></span>
                }
            </div>
        )
    }
    render() {
        let { money, bankInfo, showErrType, tipText, isEditInput, isRequestRate }: any = this.Store
        let { getAllMoney, changeMoney, nextStep , moduleFlag,onClose,activityData,goBack,activityTip,goNextRedeem}: any = this.Store
        let { showStatus = 1, extraText } = this.Config
        return (
            <div className='redeem'>
                <Headers>支取</Headers>
                <div className={showStatus == 1 ? 'info' : 'info one'}>
                    <img src={imgSrc + bankInfo.orgBgUrl} className="img" alt="" />
                    <h4>
                        <i><img src={imgSrc + bankInfo.orgLogo} alt="" /></i>
                        <span>{bankInfo.orgName}</span>
                    </h4>
                    <p>{bankInfo.orgName}电子账户(尾号{help.fromatCardFour(bankInfo.bankElecAccountNum)})</p>
                    {this.showHtml.bind(this, showStatus)()}
                </div>
                <div className='info-cash'>
                    <div className="input-box">
                        <p className="buy-words">支取金额</p>
                        <BcDealInput
                            extra={isEditInput ? extraText : ''}
                            value={money}
                            isEdit={isEditInput}
                            handleExtra={() => getAllMoney(showStatus)}
                            handleChange={(val) => changeMoney(val, showStatus)}
                        />
                    </div>
                    {showErrType ? this.showErrHtml.bind(this)() : ''}
                    {isRequestRate ? this.showRateHtml.bind(this)() : ''}
                </div>
                { tipText ? <p className="tip"  dangerouslySetInnerHTML={{ __html: tipText }}>{}</p> : '' }
                <BcButton isDisabled={this.isDisabledFn()} onClick={() => nextStep()} >支取</BcButton>
                <BottomColumn type='long'></BottomColumn>

                {
                    activityTip 
                    ?<Module moduleFlag={moduleFlag} onClose={onClose} goBack={goBack} activityData={activityData} goNextRedeem={goNextRedeem} />
                    :null
                }

            </div>
        )
    }
}
export default Redeem