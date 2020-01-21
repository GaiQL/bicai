/**
 * @author  Mr.ma
 * @use     四大交易的默认银行卡信息
 * @date    2019-05-28
 * @params  defaultBank 当前银行卡信息 (必要条件)
 *          history 父亲的props.history  (必要条件)
 *          curPage 父亲当前的路由 (必要条件)
 *          is-border-top这个className是取消borderTop值
 */

import React from 'react'
import help from 'Common/utils/Tool'
import './style.scss'
import { ActionSheet } from 'antd-mobile';
import IconSvg from './IconSvg'
import Help from 'Common/utils/Tool'
import { descFn } from '../util'
interface Rules {
    title?: string,
    defaultBank: any
    onClick?: any
    name?: any
    idCard?: any
    defaultPhone?: any,
    isShowArrow?: boolean,
    isShowDesc?: boolean,
    isShowMonthDesc?: boolean,
    className?: string
    history?: any,
    curPage?: string, // 当前是在那个页面的
    telList?: Array<any>,
    bizType?: any,
}

export default class BcBankInfo extends React.Component<Rules, any> {
    constructor(props) {
        super(props)
    }

    // 是否禁用， 银行卡信息全部灰色  availableType=4的时候大额转入上面显示日扣款
    isDisabledFn = (defaultBank, descObj) => {
        return (defaultBank.supportFlag == 0 && descObj.availableDesc && descObj.availableType != 4) ? 'disabled' : ''
    }
    // 是否显示单日扣款信息   availableType=4的时候大额转入上面显示日扣款
    isShowDayDesc = (defaultBank, descObj, isShowDesc, ) => {
        if (!isShowDesc) return 'none'
        return (defaultBank.supportFlag == 1 && descObj.dayDesc) || (defaultBank.supportFlag == 0 && descObj.dayDesc && descObj.availableType == 4) ? 'tip' : 'none'
    }
    // 是否显示月扣款信息
    isShowMonthDesc = (defaultBank, descObj, isShowDesc, isShowMonthDesc) => {
        if (!isShowDesc) return 'none'
        if (!isShowMonthDesc) return 'none'
        return defaultBank.supportFlag == 1 && defaultBank.monthDesc ? 'tip' : 'none'
    }
    // 是否显示不可用的银行卡信息
    isShowUnavailable = (defaultBank, descObj) => {
        return defaultBank.supportFlag == 0 && descObj.availableDesc && descObj.availableType != 4 ? 'tip disabled' : 'none'
    }
    // 设置不可用银行卡的提示信息
    setText = (availableType) => {
        return availableType == 1 ? '点击添加银行卡' : availableType == 2 ? '点击更换绑定卡' : availableType == 3 ? '请致电银行' : ''
    }

    // 不支持银行卡的点击事件
    eventHandle(availableType, e) {
        Help.StorageAddressBar()
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        switch (availableType * 1) {
            case 1:
                Help.StorageAddressBar()
                this.props.history.push(`/changeBank?name=${this.props.name}&idCard=${this.props.idCard}&defaultPhone=${this.props.defaultPhone}&page=${this.props.curPage}`);
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
    goLarge = () => {
        const {defaultBank} = this.props
        if (defaultBank.bankCardQuotaDescDto.singleDedct == '-1' ) {
            this.props.history.push('/largeAmountsTransfer');
        }
    }
    // 没有绑定银行卡的时候需要跳转到添加银行卡页面
    toUpdateCard = () => {
        Help.StorageAddressBar()
        this.props.history.push(`/changeBank?name=${this.props.name}&idCard=${this.props.idCard}&defaultPhone=${this.props.defaultPhone}&page=${this.props.curPage}`);
    }
    render() {
        const {
            bizType,
            title = '付款账户',
            defaultBank,
            onClick,
            className,
            isShowArrow = true, // 是否显示箭头 可点击
            isShowDesc = true, // 默认显示银行卡详情信息
            isShowMonthDesc = true // 默认显示银行卡月扣款信息
        } = this.props
        let { bankCardQuotaDescDto = {} }: any = defaultBank || {}
        let descObj = descFn(bizType, bankCardQuotaDescDto)
        let {
            dayDesc,
            monthDesc,
            availableDesc,
            availableType,
        } = descObj
        console.log(descObj)
        return (
            <div className={`${className} bank-detail`} onClick={() => onClick && onClick()}>
                <div className="detail-left">{title}</div>

                {
                    JSON.stringify(defaultBank) != '{}' ?
                        <div className="detail-content">
                            <div className="bank-info">
                                <p className={`bank-name ${this.isDisabledFn(defaultBank, descObj)}`}>{defaultBank.bankName}{defaultBank.lastFourCardNo}</p>
                                <p className={this.isShowDayDesc(defaultBank, descObj, isShowDesc)}>
                                    <em dangerouslySetInnerHTML={{ __html: dayDesc }} />
                                </p>
                                <p className={this.isShowMonthDesc(defaultBank, descObj, isShowDesc, isShowMonthDesc)}>{monthDesc}</p>
                                <p className={this.isShowUnavailable(defaultBank, descObj)} onClick={this.goLarge}>
                                    {
                                        defaultBank.bankCardQuotaDescDto.singleDedct == '-1' ? <span dangerouslySetInnerHTML={{ __html: availableDesc }}></span> : `${availableDesc}，`
                                    }
                                    {
                                        defaultBank.bankCardQuotaDescDto.singleDedct == '-1' ? '' : <b className="click-words" onClick={(e) => this.eventHandle(availableType, e)}>{this.setText(availableType)}</b>
                                    }
                                </p>
                            </div>
                            {isShowArrow ? <IconSvg /> : ''}
                        </div>
                        :
                        <div className="bankinfo-addbank" onClick={this.toUpdateCard}>请添加银行卡  <IconSvg /></div>
                }
            </div>
        )
    }
}
