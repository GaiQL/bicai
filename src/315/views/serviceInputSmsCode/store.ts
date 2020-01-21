import { PgServiceSmsCode } from 'Common/pages/PgServiceSmsCode/store'
import { observable } from "mobx";
import { BIZ_TYPE, INNER_CODE } from "Common/config/params.enum";
import PgChangeBank from '../changeBank/store'
import { commonStore } from 'Common/pages/store'
import { session } from "Common/utils/store";
import { apiBank } from "315/api/bank";

class ServiceSmsCode extends PgServiceSmsCode {
    @observable status = 0
    
    getSecurityCode = async () => {
        let bizType
        if (this.page == 'changeBank') {
            bizType = BIZ_TYPE.changeBankCard
        } else if (this.page == 'changePhone') {
            bizType = BIZ_TYPE.changePhone
        }
        this.apiSendPhoneCodeFn(bizType)
    }

    //下一步
    confirm = async () => {
        console.log('鄂尔多斯银行=====')
        if (this.page == 'changeBank') { // =======================================从换绑卡页面过来
            let newBank = JSON.parse(this.queryData.newBank)
            let oldBank = JSON.parse(this.queryData.oldCardInfo)

            let oldPhone = oldBank.bankCardPhone // 老手机号
            let oldBankCard = oldBank.bankCardNum // 老银行卡号
            let newBankNo = newBank.bankNo // 绑卡时传的银行行号
            let newBankCard = newBank.bankCardNum // 新银行卡号
            let newCardName = newBank.bankName // 新银行卡名称

            try {
                await apiBank.changeBindCard({
                    oldBindCard: oldBankCard, // 原来银行卡卡号
                    newBindCard: newBankCard, // 新卡银行卡号
                    oldTelPhone: oldPhone, // 原银行卡银行预留手机号
                    newTelPhone: this.phone, // 新卡银行预留手机号
                    newBankName: newCardName, // 新卡银行名称
                    validateCode: this.yzm, // 短信验证码
                    validateCodeSerialNum: this.validateCodeSerialNum, // 短信验证码编号
                    newBankNo: newBankNo //新银行行号
                })
                PgChangeBank.successGoBack()
            } catch (e) {
                switch (e.innerCode) {
                    case INNER_CODE.ModifyInfo:
                        this.Store.openAlert('绑卡失败', e.popMsg, [
                            {
                                text: '修改信息', onPress: () => {
                                    this.Store.Hash.history.replace('/changeBank?page=service')
                                }
                            },
                        ])
                        break;
                    case INNER_CODE.SubmitAndDoThing:
                        this.Store.openAlert('绑定失败', e.popMsg, [
                            {
                                text: '确定', onPress: () =>
                                    this.Store.Hash.history.replace('/changeBank?page=service')
                            },
                        ])
                        break;
                }
            }
        } else if (this.page == 'changePhone') { // ===================================从更换手机号页面过来
            try {
                await this.apiBank.changeBindCardPhone({
                    // status: 0, // 调用短信标识 0：银行发 1：比财发（3.0）
                    oldTelPhone: this.queryData.oldPhone, // 旧手机号
                    newTelPhone: this.queryData.phone, // 新手机号
                    validateCode: this.yzm, // 验证码
                    validateCodeSerialNum: this.validateCodeSerialNum
                })
                commonStore.Hash.history.replace('/moreService')
            } catch (e) {
                switch (e.innerCode) {
                    case INNER_CODE.ModifyInfo:
                        this.Store.openAlert('手机号更换失败', e.popMsg, [
                            {
                                text: '修改信息', onPress: () => {
                                    this.Store.Hash.history.replace(`/changePhone?bandCardInfo=${session.get('bandCardInfo')}`)
                                }
                            },
                        ])
                        break;
                    case INNER_CODE.SubmitAndDoThing:
                        this.Store.openAlert('绑定失败', e.popMsg, [
                            {
                                text: '确定', onPress: () =>
                                    this.Store.Hash.history.replace(`/changePhone?bandCardInfo=${session.get('bandCardInfo')}`)
                            },
                        ])
                        break;
                }
            }
        }
    }
}
export default new ServiceSmsCode()
