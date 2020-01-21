/**
 * @author  Mr.ma
 * @use     四大交易的收银台
 * @date    2019-05-28
 * @params  visible 控制显示/隐藏(必要条件)
 *          cardList 银行的列表情况(必要条件)
 *          history 父亲的props.history  (必要条件)
 *          curPage 父亲当前的路由 (必要条件)
 *          closeModal 关闭弹框 (必要条件)
 *          telList 银行热线 (必要条件)
 * @params  字段解释 isSupport（1：支持，0：不支持）
 *                  availableDesc   不支持银行卡信息
 */
import React from 'react'
import './style.scss'
import { imgSrc } from "Common/config/index";
import { Modal, ActionSheet } from 'antd-mobile';
import IconSvg, { IconRight } from './IconSvg'
import { commonStore } from "Common/pages/store"
import { descFn } from '../util'
import { session } from "Common/utils/store";
import Help from 'Common/utils/Tool'

interface Rules {
    visible: boolean,
    title?: string,
    selectedIndex?: any,
    transparent?: boolean,
    animationType?: string,
    maskClosable?: boolean,
    cardList: Array<any>,
    name?: string,
    idCard?: any,
    defaultPhone?: any, // 用户的默认手机号
    isShowHandleBtn?: boolean, // 是否显示可操作的按钮（添加/更换银行卡）
    bindMutiCardsFlag?: any, // 决定是否可以绑定多张卡
    isShowDesc?: boolean, // 默认显示银行卡详情信息
    isShowMonthDesc?: boolean, // 默认显示银行卡月扣款信息
    closeModal?: Function,
    history?: any,
    curPage?: string, // 当前是在那个页面的
    telList?: Array<any>,
    notifyBankInfo?: Function,
    bizType?: number
    upperLimitOfBankCard?: number, // 最多绑定银行卡数
    extraCardListCopy?: JSX.Element, // 额外文案
    specialSource?: String, // 特殊页面调用【华兴购买】
}
export default class BcUpSelect extends React.Component<Rules, any> {
    constructor(props) {
        super(props)
    }
    state = {
        selectedIndex: null
    }
    // 银行卡是否禁用
    isDisabledCard = (isSupport) => {
        return isSupport == 0 ? 'disabled' : ''
    }
    // 是否显示当天的扣款信息
    isShowDayDesc = (isSupport, dayDesc, isShowDesc) => {
        if (!isShowDesc) return 'none'
        return isSupport == 1 && dayDesc ? '' : 'none'
    }
    // 是否显示当月的扣款信息
    isShowMonthDesc = (isSupport, monthDesc, isShowMonthDesc) => {
        if (!isShowMonthDesc) return 'none'
        return isSupport == 1 && monthDesc ? '' : 'none'
    }
    // 是否显示不可用的银行卡信息
    isShowUnavailable = (isSupport, elecAccountFlag, availableDesc) => {
        if (elecAccountFlag == 1) return availableDesc
        return isSupport == 0 && availableDesc ? '' : 'none'
    }
    // 设置是否选中的icon,传进来的优先级最高
    setClassName = (index) => {
        let { selectedIndex } = this.state
        let ind = this.props.selectedIndex != null ? this.props.selectedIndex : selectedIndex
        return ind == index ? 'current-icon' : 'none'
    }

    // 点击选中的银行卡
    switchCard(bank, index) {
        // 当前银行是否支持该卡(1：支持，0：不支持)    绑卡状态(1成功，2已解绑，3处理中)
        if (bank.supportFlag == "0" || bank.bindStatus == "3") return false
        this.setState({
            selectedIndex: index
        })
        this.props.notifyBankInfo ? this.props.notifyBankInfo(index, bank) : ''
    }
    componentWillUnmount() {
        this.setState({ selectedIndex: null })
    }
    // 不支持卡的事件处理
    eventHandle(type, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        switch (type * 1) {
            case 1:
                Help.StorageAddressBar()
                this.props.history.push(`/addNewBank?name=${this.props.name}&idCard=${this.props.idCard}&defaultPhone=${this.props.defaultPhone}&page=${this.props.curPage}`);
                break;
            case 2:
                Help.StorageAddressBar()
                this.props.history.push(`/boundBank?page=${this.props.curPage}`);
                break;
            case 3:
                let telList = this.props.telList
                if (telList.length) { // 保证电话热线是存在的
                    const BUTTONS = [...telList, '取消'];
                    ActionSheet.showActionSheetWithOptions({
                            options: BUTTONS,
                            cancelButtonIndex: BUTTONS.length - 1,
                            destructiveButtonIndex: BUTTONS.length,
                            maskClosable: true,
                        },
                        (buttonIndex) => {
                            if (buttonIndex >= 0 && BUTTONS[buttonIndex] != '取消') {
                                window.location.href = `tel:${BUTTONS[buttonIndex]}`;
                            }
                        });
                }
                break;
            case 4:
                this.props.history.push('/largeAmountsTransfer');
                break;
        }
    }
    // 去大额转入页面
    goLarge() {
        this.props.history.push('/largeAmountsTransfer');
    }
    // 点击添加/更换卡进行的跳转
    changeCard(bindMutiCardsFlag) {
        let { curPage, cardList, upperLimitOfBankCard = 5 } = this.props
        Help.StorageAddressBar()
        let len = curPage == 'buy' ? cardList.length - 1 : cardList.length
        if (bindMutiCardsFlag == 1) {
            
            if (len >= upperLimitOfBankCard) {
                this.props.history.push(`/boundBank?page=${this.props.curPage}`)
                return
            }
            this.props.history.push(`/changeBank?name=${this.props.name}&idCard=${this.props.idCard}&defaultPhone=${this.props.defaultPhone}&page=${this.props.curPage}`);
        } else {
            this.props.history.push(`/boundBank?page=${this.props.curPage}`)
        }
    }

    // 判断是那个页面的收银台，(购买页面的收银台需要存在一张二类户的卡，而其他页面的收银台只需要存在一类账户卡)
    judgeLength = (): Number => {
        if (this.props.curPage == 'buy') {
            return 1
        } else {
            return 0
        }
    }


    btnRnnder<T extends string>(availableType: T): string {
        let { specialSource } = this.props
        if (availableType == '4') {
            if (specialSource != 'buy') {
                return '查看'
            }
        }
        if (availableType == '3') {
            return '请致电银行'
        }
        return ''
    }

    availableDescRender<T extends string>(availableType: T, availableDesc: T): string {
        let { specialSource } = this.props
        if (availableType == '4') {
            if (specialSource == 'buy') {
                return availableDesc.split('，')[0]
            }
        }
        return availableDesc
    }
    render() {
        const {
            bizType,
            visible = true,
            title = '选择付款方式',
            transparent = true,
            animationType = 'slide-up',
            maskClosable = false,
            cardList,
            isShowHandleBtn = true,
            bindMutiCardsFlag = 1, // 决定是否可以绑定多张卡
            isShowDesc = true, // 默认显示银行卡详情信息
            isShowMonthDesc = true, // 默认显示银行卡月扣款信息
            upperLimitOfBankCard = 5,
            curPage
        } = this.props
        let len = cardList ? (curPage == 'buy' ? cardList.length - 1 : cardList.length) : 0
        return (
            <Modal className="up-select"
                   visible={visible}
                   transparent={transparent}
                   animationType={animationType}
                   maskClosable={maskClosable}
                   popup
                   title={<div className='top-title'><img src={require('Common/assets/images/close.png')} alt=""
                                                          onClick={() => this.props.closeModal()} />{title}</div>}
            >
                <div style={{ height: '100%' }}>
                    {this.props.extraCardListCopy ? this.props.extraCardListCopy : null}
                    <ul className="card-box">
                        {
                            cardList && cardList.map((item, index) => {
                                let { bankCardQuotaDescDto } = item
                                let {
                                    dayDesc,
                                    monthDesc,
                                    availableDesc,
                                    availableType,
                                }: any = descFn(bizType, bankCardQuotaDescDto)
                                return (
                                    <li className="item-list" onClick={this.switchCard.bind(this, item, index)}
                                        key={index}>
                                        <p className={`${this.isDisabledCard(item.supportFlag)} bank-logo`}>
                                            <img src={imgSrc + item.bankLogoUrl} alt="" />
                                        </p>
                                        <div className="item-details">
                                            <p className={`${this.isDisabledCard(item.supportFlag)} bank-name`}>{item.openBankDesc}{item.lastFourCardNo}</p>
                                            <p className={this.isShowDayDesc(item.supportFlag, dayDesc, isShowDesc)}
                                               dangerouslySetInnerHTML={{ __html: dayDesc }} />
                                            <p className={this.isShowMonthDesc(item.supportFlag, monthDesc, isShowMonthDesc)}>{monthDesc}</p>
                                            <p className={this.isShowUnavailable(item.supportFlag, item.elecAccountFlag, availableDesc)}>
                                                {
                                                    bankCardQuotaDescDto.singleDedct == '-1' ? <span
                                                            className="large" onClick={() => this.goLarge()} dangerouslySetInnerHTML={{ __html: availableDesc }}></span> :
                                                        <span
                                                            className="disabled">{this.availableDescRender(availableType, availableDesc)}{item.bankCardQuotaDescDto.availableType == 3 ? '，' : ''}</span>
                                                }
                                                <button
                                                    onClick={(e) => this.eventHandle(availableType, e)}>{this.btnRnnder(availableType)}</button>
                                            </p>
                                        </div>
                                        {
                                            availableType == 1 || availableType == 2 || availableType == 3 || availableType == 4 ||  bankCardQuotaDescDto.singleDedct == '-1' ? '' :
                                                <div className={this.setClassName(index)}>
                                                    <IconSvg color='#14B796' wid='22' hte='22' />
                                                </div>
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                    {
                        isShowHandleBtn ?
                            (
                                (cardList ? cardList.length : 0) > this.judgeLength()
                                    ?
                                    <div className="bank-btn" onClick={this.changeCard.bind(this, bindMutiCardsFlag)}>
                                        <span className="card-icon"><img src={require('Common/assets/images/bank.png')} alt="" /></span>
                                        <span className="bank-handle">{bindMutiCardsFlag * 1 ? (len >= upperLimitOfBankCard ? '更换绑定银行卡'  : '添加银行卡') : '更换绑定银行卡'}</span>
                                        <IconRight wid='16' hte='16' color='#999999' />
                                    </div>
                                    :
                                    <div className="bank-btn" onClick={this.changeCard.bind(this, 1)}>
                                        <span className="card-icon"><img src={require('Common/assets/images/bank.png')} alt="" /></span>
                                        <span className="bank-handle">{'添加银行卡'}</span>
                                        <IconRight wid='16' hte='16' color='#999999' />
                                    </div>
                            ) : ''
                    }
                </div>
            </Modal>
        )
    }
}
