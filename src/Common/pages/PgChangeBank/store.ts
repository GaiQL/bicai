import { observable, toJS, runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { commonStore, PgBoundBank } from "Common/pages/store"
import { session, StoreKey } from "Common/utils/store";
import { BIZ_TYPE } from 'Common/config/params.enum'
import { Native } from "Common/utils/appBridge"


export type bankType = 'changeBank' | 'addBank'

export class PgChangeBank extends StoreExtends {
    @observable changeBindCardRes = {}
    @observable result: any = {}
    @observable cardNo = ''
    @observable flag: boolean = false
    @observable show: boolean = false
    @observable errTip = ''
    @observable timeEnd = null
    @observable validateCodeSerialNum = null
    @observable realName = ''
    @observable userCardId = ''
    @observable phone = ''
    @observable bankHandleType: bankType = 'addBank'
    @observable oldCardInfo: any = {}
    @observable query = {};
    @observable defaultPhone = "";
    @observable HMBank_flag = false;
    bottomNoteOnoff = false;  //  是否在输入手机号展示应众邦政策要求的UI

    initData = async () => {
        // 初始化数据 多入口进入。
        let res: any = await this.apiBank.apiBandCard({
            bizType: BIZ_TYPE.moreService,
            transAmt: "",
            queryType: "0",
            prdIndexId: ""
        })
        runInAction(() => {
            this.realName = res.realName
            this.defaultPhone = res.bankCardPhone
            console.log(this.defaultPhone, " this.defaultPhone")
            if (res.cardList[0]) {
                this.oldCardInfo = {
                    bankCardNum: res.cardList[0].bankCardNum,
                    bankCardPhone: res.cardList[0].bankCardPhone,
                    cardList: res.cardList[0]
                }
            }
            this.userCardId = res.userCardId
            this.query = commonStore.query()
        })

    }

    updatePhone = (el) => {
        runInAction(() => {
            this.phone = el
        })
    }
    // ocr识别银行卡
    getImgData = async (val) => {
        let res: any = await this.apiBank.apiBankCardScan({
            bankCardNum: '',
            bankCardPhoto: encodeURIComponent(val.split(',')[1]),
            transcoding: "1"
        })
        runInAction(() => {
            this.flag = true
            this.show = true
            this.result = res
            this.cardNo = res.bankCardNum
        })

        this.getCard(res.bankCardNum);
    }
    //获取银行卡信息
    getCard = (val) => {
        if (val == '') {
            runInAction(() => {
                this.result = {}
                this.cardNo = ''
                this.flag = false
                this.show = false
                this.errTip = ''
            })
        }
        runInAction(() => {
            this.cardNo = val
        })
        if (val.length >= 10) {
            clearTimeout(this.timeEnd)
            this.timeEnd = setTimeout(async () => {
                try {
                    if (this.cardNo != '') {
                        let result: any = await this.apiBank.apiBankCardScan({
                            bankCardNum: this.cardNo,
                            // bankCardPhoto: '',
                            // transcoding: 0
                        })
                        runInAction(async () => {
                            this.flag = true
                            this.show = true
                            this.result = result
                            this.cardNo = result.bankCardNum
                        })
                    }
                } catch (e) {
                    runInAction(() => {
                        this.flag = false
                        this.show = true
                        this.errTip = e.popMsg
                    })
                }
            }, 800)
        }
    }
    next = async () => {
        let { userCardId, phone } = this
        session.set("messagePhone", phone)
        let {page}: any = this.query || {}
        // if (page) {
        //     session.set(StoreKey.changeBankOriginPage, page)
        // }
        console.log(page, "数据源")
        let queryData = {
            page,// 从多个页面进入的字段（）
            phone,
            userCardId,
            newBank: JSON.stringify({ ...this.result }),
            oldCardInfo: JSON.stringify({ ...this.oldCardInfo })
        }
        this.goBoundBankYzm(queryData)
        runInAction(async () => {
            this.phone = ''
            this.cardNo = ''
        })
    }
    //对于单个银行跳转页面的判断
    goBoundBankYzm = (queryData) => {
        commonStore.Hash.history.push(`/serviceInputSmsCode?bizType=01&page=${this.bankHandleType}&queryData=` + JSON.stringify(queryData))
    }
    /**
     * 方便重写
     * @param queryData 数据的携带
     * @param bankCardType 对page字段的判断  是添加还是换绑
     */
    bankHandle = (queryData, bankCardType?) => {
        if (bankCardType == 'changeBank') {
            this.changeBank(queryData)
        }
        if (bankCardType == 'addBank') {
            this.addBank(queryData)
        }
    }

    // 重写 ：添加银行卡：申请添加银行卡
    addBank = async (queryData) => {
        let { phone, newBank, page }: any = queryData
        console.log(queryData,"000")
        console.log(page, "page")
        try {
            let res = await this.apiBank.addBindCard({
                bankCardNum: JSON.parse(newBank).bankCardNum, //一类银行卡号
                bankCardPhone: phone,//卡银行预留手机号
                bankName: JSON.parse(newBank).bankName,// 银行名称
                bankNo: JSON.parse(newBank).bankNo,// 开户行编号
                newBankNo: JSON.parse(newBank).bankNo,// 开户行编号
                validateCode: queryData.yzm,   // 短信验证码
                validateCodeSerialNum: session.get("reqSerial").validateCodeSerialNum, //短信验证码编
                reqSerial: session.get("reqSerial").reqSerial,  // 原请求流水号：添加银行卡后台返回reqSeria
                preBankAccountNo:session.get("reqSerial").preBankAccountNo
            })
            runInAction(() => {
                session.set("reqSerial", res)
                this.changeBindCardRes = res
            })
            this.successGoBack()
        } catch (e) {
            // Toast.info(e.popMsg)
        }
    }
    // 重写 ：更改银行卡:
    changeBank = async (queryData) => {

        let { phone, newBank, oldCardInfo }: any = queryData
        try {
            const newBindCard = JSON.parse(newBank).bankCardNum
            const newTelPhone = phone
            const newBankName = JSON.parse(newBank).bankName
            const newBankNo = JSON.parse(newBank).bankNo
            const oldBindCard = JSON.parse(oldCardInfo) && JSON.parse(oldCardInfo).bankCardNum
            const oldTelPhone = JSON.parse(oldCardInfo) && JSON.parse(oldCardInfo).bankCardPhone
            const bankNo = JSON.parse(oldCardInfo).bankNo || ''
            const validateCodeSerialNum = queryData.validateCodeSerialNum
            const validateCode =queryData.yzm
            let res = await this.apiBank.changeBindCard({
                newBindCard,//绑定新银行
                newTelPhone, //新手机号
                newBankName, //新银行名称
                newBankNo, //新银行行号
                oldBindCard,//绑定旧银行
                oldTelPhone,//旧手机号
                bankNo,// 旧银行行号
                validateCodeSerialNum,
                validateCode, //验证码
            })
            this.successGoBack()
            if (res) {
                runInAction(() => {
                    this.changeBindCardRes = res
                })
            }
        } catch (e) {
            console.log(e)
        }
    }
    //对于页面的判断 是从交易来的还是直接进入更多服务
    successGoBack = () => {
        console.log("123456789")
        let changeBankOriginPage = session.get(StoreKey.changeBankOriginPage)
        if (changeBankOriginPage == 'comBuying') {
            if (Native.isApp()) {
                Native.closeWebView()
            } else {
                alert('go comBuying !不在app内')
            }
            return
        }
        if (changeBankOriginPage) {
            commonStore.Hash.history.replace('/' + changeBankOriginPage)
            session.remove(StoreKey.changeBankOriginPage) // jie
        } else {
            commonStore.Hash.history.replace('/boundBank?page=service')
        }
    }
}

export default new PgChangeBank()
