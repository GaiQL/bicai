import { observable, action, runInAction } from "mobx";
import { Toast } from 'antd-mobile';
import { commonStore } from 'Common/pages/store'
import { StoreExtends } from 'Common/Plugins/store.extends'
import { agreeOpenBtn } from 'Common/Plugins/recordLogInfo'

declare var document

export class PgOpenFlow extends StoreExtends {
    Store = commonStore
    /*==========页面静态文字 =========*/
    @observable pgHeader = '开户流程'
    @observable pgCardBgText = '电子账户'
    @observable pgAgreeText = '本人已阅读并同意'
    @observable pgBtnText = '同意并开通账户'
    @observable selectFlag = false
    @observable openBankLimitDesc = ''
    @observable openBankLimit=""

    /*==========页面数据 =========*/


    
    @observable pageData = {
        bankBgUrl: '',
        bankLogo: '',
        bankName: '',
        title: '',
        content: '',
        logoList: [],
        agreementList: [],
        noOpenAccResult: ''
    }

    tabSelect = (selectFlag) => {
        runInAction(() => {
            this.selectFlag = !selectFlag
        })
    }
    AdapterData = (res) => {
        // 转换数据 如接口返回数据变化 进行转换
        runInAction(() => {
            this.pageData = {
                bankBgUrl: res.bankBgUrl,
                bankLogo: res.bankLogo,
                bankName: res.bankName,
                title: res.title,
                content: res.content,
                logoList: res.logoList,
                agreementList: res.agreementList,
                noOpenAccResult: res.noOpenAccResult
            }
        })
    }
    agree = () => {
        console.log(document.getElementsByTagName('body'));
        try {
            agreeOpenBtn()
        } catch (err) {}

        if (this.selectFlag) {
            if (this.pageData.noOpenAccResult) {
                this.Store.openAlert('提示', this.pageData.noOpenAccResult, [
                    { text: '确定', onPress: () => console.log(this) }
                ])
            } else {
                if (this.openBankLimit == '1') {
                    this.Store.openAlert('提示', this.openBankLimitDesc, [
                        { text: '确定', onPress: () => console.log(this) }
                    ])
                } else {
                    try {
                        this.Store.Hash.history.push('/openPerfection')
                    } catch (error) {
                        this.Store.openAlert('提示', error.msg, [
                            { text: '确定', onPress: () => console.log(this) }
                        ])
                    }
                }
            }
        } else {
            let argList = this.pageData.agreementList || [],
                msg = ''
            for (var i = 0; i < argList.length; i++) {
                msg += argList[i].agreementTitle + '、'
            }
            let argMsg = `请先同意${msg.substr(0, msg.length - 1)}`
            Toast.info(argMsg, 1);

        }
    }

    initData = async () => {
        const res: any = await this.apiBank.openAnAccountAgreement()
        if (res) {
            console.log(res.openBankLimitDesc)
            this.openBankLimitDesc = res.openBankLimitDesc || ''
            this.openBankLimit = res.openBankLimit || ''
            this.AdapterData(res)
        }
    }

    //查看协议
    goAgreement = (item) => {
        if (item.agreeAttr == '0') {
            this.Store.Hash.history.push(`/analysisText?itemAgreement=${JSON.stringify(item)}`)
        }
        else {
            this.Store.Hash.history.push(`/agreement?url=${item.agreementUrl}`)
        }
    }

}

export default new PgOpenFlow()
