import React from 'react'
import './style.scss'
import { observer, inject } from 'mobx-react'
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import { imgSrc } from "Common/config/index";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import { Modal } from 'antd-mobile'
@observer
class BoundBank extends React.Component<any, any> {
    Store = Store

    Config = {
        bottomText: true, //
        confirmTit: '更换绑定银行卡', // 配置底部按钮文字
        unbindFlag: false,
        BoundBankState: false//carList为空的显示（目前只有中关村有显示）
    }

    componentDidMount(): void {
        let { apiBandCardFn } = this.Store
        apiBandCardFn()
    }

    //设置卡的状态(默认卡)
    cardStatus(bank) {
        if (bank.supportFlag == 1) {
            return bank.defaultCardFlag == 1 ? <p className='BoundBank-item-default'>默认卡</p> : null
        } else {
            return <p className='BoundBank-item-default'>暂不支持</p>
        }
    }
    //carList为空的显示（目前只有中关村有显示）
    BoundBankView() {
        return (<div className='BoundBank-title'>
            <img src={require("../../../../public/static/images/kong@3x.png")} alt="" />
            <div className="Bound-tit">目前您还未绑定银行卡</div>
            <div>可点击下方按钮进行快速绑定</div>
        </div>)
    }
    //弹框封装
    renderState() {
        let { setDefaultBindCard, defaultCardPop, flag, isShow, popupList } = this.Store
        return <Modal
            popup
            visible={flag}
            onClose={() => {
                isShow(false)
            }}
            animationType="slide-up"
        >
            <div className="popupList">
                {popupList.map((i, index) => {
                    // 0是设为默认卡
                    // 1是解绑卡
                    // 2是取消
                    return <div key={index} className="popupList-child"
                        onClick={() => {
                            switch (i.type) {
                                case 0:
                                    setDefaultBindCard()
                                    isShow(false)
                                    break;
                                case 1:
                                    isShow(false)
                                    defaultCardPop()
                                    break;
                                case 2:
                                    isShow(false)
                                    break;
                                default:
                                    break;
                            }
                        }}>{i.typeName}</div>
                })}

            </div>
        </Modal>
    }
    //渲染
    render() {
        let { bandCardInfo } = this.Store
        let { changeBankCard, isShow, unBindCar, cardList } = this.Store
        let { confirmTit, unbindFlag, bottomText, BoundBankState }: any = this.Config
        let bandCardList = bandCardInfo.cardList
        console.log(bandCardList,"bandCardList")
        return <div className='BoundBank'>
            {/* 头部 */}
            <Headers>绑定银行卡</Headers>
            {this.renderState()}
            {
                bandCardList && bandCardList.length <= 0
                    ?
                    BoundBankState ?
                        this.BoundBankView() : null
                    :
                    bandCardList && bandCardList.map((bank, index) => {
                        return <div className='BoundBank-list' key={index}
                            onClick={() => {

                                !unbindFlag ? null : isShow(true)
                                unBindCar(bandCardList, bank)
                            }}>
                            <div className='BoundBank-list-item' style={{ opacity: bank.supportFlag == 1 ? 1 : 0.5 }}>
                                <img src={imgSrc + bank.bankBgUrl} alt="" />
                                <p className='BoundBank-item-logo'>
                                    <img src={imgSrc + bank.bankLogoUrl} alt="" />
                                </p>
                                <p className='BoundBank-item-text'>{bank.bankCardName}</p>
                                {
                                    this.cardStatus(bank)
                                }
                                <p className='BoundBank-item-num'>
                                    <span>****</span>
                                    <span>****</span>
                                    <span>****</span>
                                    <span>{bank.bankCardNum && bank.bankCardNum.substr(-4)}</span>
                                </p>
                            </div>
                        </div>
                    })
            }

            <BcButton wrapperClassName='BoundBank-confirm' onClick={() => changeBankCard()}>{
                cardList.length == 0 ? "添加新绑定银行卡" : confirmTit
            }</BcButton>

            {/* 继承组件中传 bottomText = false 不提示 '提示' 这段话 */}
            {
                bottomText && confirmTit == '更换绑定银行卡' ?
                    <p className='BoundBank-tip'>提示：更换绑定银行卡前，请确认已转出所有的投资资金并提现</p> : null
            }
            <BottomColumn type='long' />
        </div>
    }
}

export default BoundBank
