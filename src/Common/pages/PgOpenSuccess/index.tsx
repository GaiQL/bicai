import React from 'react'
import { Toast } from "antd-mobile";
import goBC from "Common/utils/goBC";
import { session } from "Common/utils/store";
import { Images } from "Common/config/index";
import { ORG_ID } from "Common/config/index";
import { observer, inject } from 'mobx-react';
import { Native } from "Common/utils/appBridge";
import Headers from 'Common/publicCommon/Headers';
import { BcButton } from 'Common/publicCommon/index';
import { BottomColumn } from 'Common/publicCommon/index';
import { openSuccessPage, openSuccessSubmitBtn } from 'Common/Plugins/recordLogInfo'
import './style.scss';
import Store from "./store"
/**
 *  SuccessName             ：职业
 *  successAddress          ：联系地址
 *  successOpenbank         ：银行卡
 *  successCardInDate       ：身份证有效期
 *  successrBankCardPhone   ：联系电话
 *  successUserCardId       ：身份证号
 * successUserName          ：名字
 * successText              ：按钮文案
 */

@observer
class OpenSuccess extends React.Component<any, any> {
    Store=Store
    //配置项
    Config = {
        successName: false,
        industryName: false,// 行业
        successAddress: true,
        successOpenbank: true,
        successCardInDate: true,
        successrBankCardPhone: true,
        successUserCardId: true,
        successUserName: true,
        successText: "完成"
    }
    componentDidMount() {
        try {
            openSuccessPage()
        } catch (err) { }
    }

   

    //姓名模块
    renderUserName(realname, flag = true) {
        return flag ? <p><span>姓名</span><span>{realname ? ('*' + realname.substr(1)) : ''}</span></p> : null
    }

    //身份证号模块
    renderUserCardId(userCardId, flag = true) {
        return flag ? <p>
            <span>身份证号</span><span>{userCardId ? (userCardId.substr(0, 1) + '****************' + userCardId.substr(-1)) : ''}</span>
        </p> : null
    }

    //身份证有效期模块
    renderCardInDate(cardExpireDate, flag = true) {
        return flag ? <p><span>身份证有效期</span><span>{cardExpireDate ? cardExpireDate : ''}</span></p> : null
    }

    //联系方式模块
    renderBankCardPhone(bankCardPhone, flag = true) {
        return flag ? <p>
            <span>联系方式</span><span>{bankCardPhone ? (bankCardPhone.substr(0, 3) + '******' + bankCardPhone.substr(-2)) : ''}</span>
        </p> : null
    }

    //联系地址模块
    renderAdress(address, flag = true) {
        return flag ?
            <p className='openPerfection-info-address'><span>联系地址</span><span>{address ? address : ''}</span></p> : null
    }

    //银行卡模块
    renderOpenBank(openBank, bankAccountNo, flag = true) {
        return flag ?
            <p><span>银行卡</span><span>{openBank ? openBank + `(${bankAccountNo.substr(-4)})` : ''}</span></p> : null
    }

    //职业模块
    renderOccupation(occupation, flag = false) {
        return flag ? <p><span>职业</span><span>{occupation ? occupation : ''}</span></p> : null
    }

    //职业模块
    renderIndustry(industry, flag = false) {
        return flag ? <p><span>行业</span><span>{industry ? industry : ''}</span></p> : null
    }

    render() {
        let { successName, successAddress, successOpenbank, successCardInDate, successrBankCardPhone, successUserCardId, successUserName, industryName, successText } = this.Config
        let openSuccessData: any = session.get('openSuccessData')
        let {
            address,
            bankCardNum,
            bankCardPhone,
            bankElecAccountNum,
            bankName,
            cardExpireDate,
            memberId,
            orgId,
            realName,
            reqSerial,
            userCardId,
            occupation,
            industry
        }: any = openSuccessData || {}
        let {goNext}=this.Store
        return <div className='openSuccess'>
            {/* 头部 */}
            <Headers type="empty">开户成功</Headers>
            <div className='openSuccess-finish'>
                <p className='openSuccess-finish-img'><img src={Images.success} alt="" /></p>
                <p className='openSuccess-finish-txt'>开户成功</p>
                <p className='openSuccess-finish-tit'>请妥善保管好您的电子账户信息</p>
                <BcButton className='openSuccess-finish-confirm'
                    onClick={goNext.bind(this)}
                >
                    {successText}
                </BcButton>
                <p className='openSuccess-finish-bankNum'>
                    <span>电子账户卡号</span>
                    <span>{bankElecAccountNum ? bankElecAccountNum.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ') : ''}</span>
                </p>
            </div>
            <div className='openSuccess-info'>
                {/* 姓名 */}
                {
                    this.renderUserName(realName, successUserName)
                }
                {/*身份证号  */}
                {
                    this.renderUserCardId(userCardId, successUserCardId)
                }
                {/* 身份证有效期 */}
                {
                    this.renderCardInDate(cardExpireDate, successCardInDate)
                }
                {/* 联系方式 */}
                {
                    this.renderBankCardPhone(bankCardPhone, successrBankCardPhone)
                }
                {/* 联系地址 */}
                {
                    this.renderAdress(address, successAddress)
                }
                {/* 行业 */}
                {
                    this.renderIndustry(industry, industryName)
                }
                {/* 职业 */}
                {
                    this.renderOccupation(occupation, successName)
                }
                {/* 银行卡 */}
                {
                    this.renderOpenBank(bankName, bankCardNum, successOpenbank)
                }

            </div>
            <BottomColumn type='long' />
        </div>
    }
}

export default OpenSuccess
