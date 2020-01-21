/*
 * @Author: mikey.刘佳旭
 * @Date: 2019-07-24 18:01:09
 * @Last Modified by: mikey.刘佳旭
 * @Last Modified time: 2019-08-06 13:43:47
 */
import {observable, runInAction} from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import {commonStore} from "Common/pages/store"
import {Toast, ActionSheet} from 'antd-mobile'
import {session} from 'Common/utils/store'
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import Help from 'Common/utils/Tool'

export class PgBoundBank extends StoreExtends {
    Config = {
        minBankCardNum: 1,// 允许留存最低卡数
        maxBankCardNum: 5, // 允许绑定最多卡数
        onePopupList: [ //当一张卡时底部展示当选项
            {
                type: 1,
                typeName: '解绑银行卡',
            }, {
                type: 2,
                typeName: '取消',
            }
        ],
        defaultPopupList: [ // 当多张卡时底部展示当选项
            {
                type: 0,
                typeName: '设为默认卡',
            },
            {
                type: 1,
                typeName: '解绑银行卡',
            }, {
                type: 2,
                typeName: '取消',
            }
        ]
    }
    @observable result = {}
    @observable bandCardInfo: any = {}
    @observable inspectBankCardBalance = false;   // 接口校验：是否校验银行卡
    @observable popupList = []
    @observable flag = false
    @observable len = 0
    @observable bankInformation = {}//银行信息
    @observable bankCardNum = ""//银行卡
    @observable accountNo = ""//一类银行卡
    @observable phone = ""//手机号
    @observable isTodoCode = false
    @observable cardList = []
    @observable bankCardPhone = ''//携带手机号
    @observable bankName = '' // 银行名称
    /**
     * 查询登录用户某机构绑定卡信息
     * @param data
     */
    apiBandCardFn = async () => {
        const data = {
            bizType: BIZ_TYPE.moreService,
            transAmt: "",
            queryType: '0',
            prdIndexId: ""
        }
        const res = await this.apiBank.apiBandCard(data)
        this.bankCardPhone = res.bankCardPhone
        if (res) {
            runInAction(() => {
                // res.cardList=[]
                this.cardList = res.cardList || []
                this.bandCardInfo = res
                console.log(this.bandCardInfo.cardList, "bandCardInfo")

            })
        }
        return Promise.resolve(res)
    }
    //判断弹框显示隐藏
    isShow = (state) => {
        runInAction(() => {
            this.flag = state
        })
    }
    /**
     * 解绑银行卡（wsq）(判断是一张卡还是多张卡  提示框显示不同)
     * @param len
     * @param item
     */
    unBindCar = async (len, item) => {
        runInAction(() => {
            this.len = len.length//银行卡张数
            this.bankInformation = item//银行信息
            this.phone = item.bankCardPhone//预留手机号
            this.bankCardNum = item.bankCardNum//银行卡
            this.bankName = item.bankName//银行卡
        })
        if (len.length == 1) {
            runInAction(() => {
                this.popupList = this.Config.onePopupList
            })
        } else {
            runInAction(() => {
                this.popupList = this.Config.defaultPopupList
            })
        }
    }
    /**
     * 设置默认卡
     */
    setDefaultBindCard = async () => {
        let {bankCardNum}: any = this.bankInformation
        await this.apiBank.setDefaultBindCard({
            bankCardNum//银行卡
        })
        // 刷新
        this.apiBandCardFn()
    }
    /**
     * 解绑银行卡
     */
    untieBindCard = async () => {
        let {bankCardNum, bankCardPhone, bankNo, bankName}: any = this.bankInformation
        await this.apiBank.untieBindCard({
            bankCardNum,//银行卡
            bankCardPhone, //预留手机号
            bankNo,
            bankName
        })
        //刷新
        this.apiBandCardFn()

    }
    // 设为默认卡弹窗
    defaultCardPop = () => {
        const {openAlert} = commonStore
        if (this.len <= this.Config.minBankCardNum) {
            openAlert('绑定银行卡', '最少需要绑定一张一类户银行卡', [
                {text: '确定', onPress: () => console.log('确定')},
            ])
        } else {
            this.isTodoCode ?
                commonStore.Hash.history.replace(`/serviceInputSmsCode?bindFlg=${"2"}&queryData=` + JSON.stringify(this.bankInformation))
                :
                this.untieBindCard()
        }
    }

    /**
     * 银行卡操作：前中台校验，校验账户是否能够去进行银行卡的操作。如：卡内有余额
     */
    changeBankCheck = async () => {
        const {openAlert} = commonStore
        let {page}: any = commonStore.query() || {}
        if (!page) page = 'service'
        if (this.inspectBankCardBalance) { // 是否需要开启中台校验
            try {
                // 校验接口
                await this.apiBank.changeBankCardFlag({})
                return Promise.resolve()
            } catch (err) {
                // alert(err)
                if (err.innerCode == INNER_CODE.CancelAndDoWithdraw) {
                    session.set('withdrawType', 'boundBank')
                    // 去提现
                    openAlert('提示', err.popMsg, [
                        {text: '取消', onPress: () => console.log('取消'), style: {color: "#999999"}},
                        {text: '去提现', onPress: () => {
                                commonStore.Hash.history.push('/withdraw?page=boundBank&type=' + page)
                            }},
                    ])
                }
                if (err.innerCode == INNER_CODE.CancelAndDoRedeem) {
                    // 支取 去持有中支取吧
                    openAlert('提示', err.popMsg, [
                        {text: '取消', onPress: () => console.log('取消'), style: {color: "#999999"}},
                        {text: '去支取', onPress: () => {
                                commonStore.Hash.history.push('/bankDetail?page=boundBank&type=' + page)
                            }},
                    ])
                }
                return Promise.reject()
            }
        } else {
            return Promise.resolve()
        }

    }

    /**
     * 点击换绑卡
     */
    changeBankCard = async () => {
        const {openAlert} = commonStore
        await this.changeBankCheck()
        let {cardList} = this.bandCardInfo
        if (cardList.length >= this.Config.maxBankCardNum) {
            openAlert('提示', '您当前绑定的银行卡数量已达到上限，请解绑银行卡后再进行绑定', [
                {text: '确定', onPress: () => console.log('确定')},
            ])
        } else {
            // page
            commonStore.Hash.history.push('/changeBank?page=boundBank&bankCardPhone=' + `${this.bankCardPhone}` + "&showFlag=" + true );
        }
    }

}

export default new PgBoundBank()
