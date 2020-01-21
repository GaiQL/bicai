import { observable, action, runInAction } from "mobx";
import { session } from "Common/utils/store";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { commonStore } from "Common/pages/store"
import { perfectOpenInfoBtn } from 'Common/Plugins/recordLogInfo'
import { INNER_CODE } from "Common/config/params.enum";

// 1.0 2.0 3.0

interface Person {
    [propName: string]: any;
}

export interface IConfig {
    nextType: 'faceDiscern' | 'openInputSmsCode' | 'openSuccess', // 开户下一步跳转配置
    ifUploadIDCardImgBase64: boolean, //  开户是否需要上送更新身份证得到的图片base64
}

export class PgOpenPerfection extends StoreExtends {
    Config: IConfig = { // 配置项目
        nextType: 'openInputSmsCode',
        ifUploadIDCardImgBase64: false
    }
    // @observable nextType: 'faceDiscern' | 'openInputSmsCode' | 'openSuccess' = 'openInputSmsCode' // 点击下一步需求去哪里
    @observable address = ''
    @observable residentAddress = '' // 居住地址
    @observable autoEnterResidentAddressFlag = false // 居住地址默认填入联系地址
    @observable result: any = {}
    @observable openResult: any = {}
    @observable dutyInd = null
    @observable nationList = [
        {
            label: '汉',
            value: '汉'
        },
        {
            label: '满',
            value: '满'
        },
    ];
    @observable sexList = [
        {
            label: '女',
            value: '女',
        },
        {
            label: '男',
            value: '男',
        },
    ];

    @observable loginPhoneNum = null // 登录手机号
    @observable signAndIssueDate = ''
    @observable cardExpireDate = ''
    @observable idCardDate = ''
    @observable bindCardList = []
    @observable bankInfo: any = {}
    @observable bankName = '请添加'
    @observable userCardId = ''
    @observable dutyVal = '请选择' // 职业
    @observable dutyCode = null // 职业
    @observable industryVal = '请选择' // 行业
    @observable industryCode = null // 行业
    @observable nationVal = ['']    //
    @observable nation = ''//民族
    @observable sexVal = [''] // 性别
    @observable bankCardPhone = ''//银行卡手机号
    @observable dutyList = []// 职业列表
    @observable industryList = []// 行业列表
    @observable realName = ''// 姓名
    @observable signOrg = ''// 签发机关
    @observable isHttp = "close" //防止按钮二次点击
    @observable dutyDefalutSelectStatus = {} //  默认选择职业
    @observable industryDefalutSelectStatus = {} // 默认选择行业
    @observable alterTitle = '开户失败'
    // @observable industry = ''
    // @observable ifUploadIDCardImgBase64 = false // 是否要上传更新身份证获取的新的身份证base64

    Store = commonStore

    getAddress = (val) => {
        runInAction(() => {
            this.address = val
        })
    }
    getLiveAddress = (val) => {
        runInAction(() => {
            this.residentAddress = val
            if (val != this.address) {
                this.autoEnterResidentAddressFlag = false
            }
        })
    }
    changeAutoEnterResidentAddress = () => {
        runInAction(() => {
            this.autoEnterResidentAddressFlag = !this.autoEnterResidentAddressFlag
            if (this.autoEnterResidentAddressFlag) {
                this.residentAddress = this.address
                session.set('residentAddress', this.residentAddress)
            } else {
                this.residentAddress = ''
                session.remove('residentAddress')

            }
        })
    }
    initProfessionVal = () => {
        runInAction(() => {
            this.dutyVal = '请选择'
        })
    }


    getNationData = (nationList) => {
        //
        runInAction(() => {
            this.nationList = nationList.map(item => {
                return {
                    label: item.nation,
                    value: item.nation,
                    id: item.id
                }
            })
        })
    }
    //  是否可以点击
    isDisabled = (IProf) => {
        return IProf ? (this.dutyVal == '请选择' || this.bankName == '请添加') : (this.bankName == '请添加')
    }
    AdapterData = (res) => {
        // 转换数据 如接口返回数据变化 进行转换
        runInAction(() => {

        })
    }
    //初始化
    initData = async () => {
        const res: Person = await this.apiBank.apiRegisterBackShow({
            showBase64Flag: "0",
        })
        // 更新身份信息： 判断是否有更新身份证数据 IdCardFrontPhoneOcrData
        const {
            address,//地址
            realName,//姓名
            userCardId,//身份证
            gender,//性别
            signOrg,//签发机关
            cardExpireDate,//有效期
            birthday,//生日
        }: any = session.get('IdCardFrontPhoneOcrData') || {}
        if (address) res.address = address //
        if (realName) res.realName = realName
        if (userCardId) res.userCardId = userCardId
        if (gender) res.sex = gender == "男" ? "0" : "1" // 重写 性别 ocr识别字段有变动
        if (signOrg) res.signOrg = signOrg //签发机关
        if (cardExpireDate) res.cardExpireDate = cardExpireDate // cardExpireDate: "2016.10.14-2026.10.14"
        if (birthday) res.birthday = birthday // 生日 现在反显没有改字段
        // 储存活体数据
        session.set("FaceDiscernData", {
            userName: res.realName, //姓名
            identNo: res.userCardId  //身份证号
        })
        runInAction(() => {
            this.getNationData(res.nationList)//民族
            this.getAddress(res.address || '')//地址
            this.realName = res.realName && ('*' + res.realName.substr(1))//名字
            this.loginPhoneNum = res.bankCardPhone //手机号
            this.signOrg = res.signOrg //签发机关
            this.dutyList = res.dutyList//职业列表
            this.industryList = res.industryList //行业列表
            this.userCardId = res.userCardId//身份证号
            this.result = res//返回的数据
            this.bindCardList = res.bindCardList || []
            this.signAndIssueDate = res.cardExpireDate ? res.cardExpireDate.split('-')[0].replace(/\./g, '-') : ""
            this.cardExpireDate = res.cardExpireDate ? res.cardExpireDate.split('-')[1].replace(/\./g, '-') : ""
            this.sexVal = [res.sex || ''] //性别
            this.nationVal = [res.nation || ''] //民族
            this.nation = res.nation
            this.dutyInd = res.userDuty || []
            this.userCardId = res.userCardId && res.userCardId.substring(0, 1) + '****************' + res.userCardId.charAt(res.userCardId.length - 1)
        })
        return res
    }

    //获取选中的银行卡
    getBank = (val) => {
        runInAction(() => {
            this.bankCardPhone = val.bankCardPhone
            this.bankName = val.bankName + `(${val.bankCardNum.substr(-4)})`
            if (val) {
                session.set('bankInfo', val)
            }
            this.bankInfo = {
                bankCardNum: val.bankCardNum,
                bankCardPhone: val.bankCardPhone,
                bankNo: val.bankNo,
            }
        })
    }
    // 获取职业或者行业
    getSelectItem = (modalType, ...agur) => {
        let { name, code } = agur[0]
        let val = agur[1]
        console.log(modalType);
        runInAction(() => {
            // PROFESSION = 'dutyFlag',
            // INDUSTRY = 'industryFlag'
            if (modalType == 'dutyFlag') {
                this.dutyDefalutSelectStatus = val
                this.dutyVal = val[name]
                this.dutyCode = val[code]
                console.log(this.dutyVal);
            }
            if (modalType == 'industryFlag') {
                this.industryDefalutSelectStatus = val

                this.industryVal = val[name]
                this.industryCode = val[code]
            }
        })
    }

    //获取新银行卡返回的信息
    getNewBank = (val) => {
        console.log(val, "新数据")
        runInAction(() => {
            if (val) {
                this.bankCardPhone = val.bankCardPhone
                session.set('bankInfo', val)
            }
            if (session.get('bankInfo')) {
                let { bankInfo, bankCardPhone } = session.get('bankInfo')//银行卡信息
                this.bankCardPhone = bankCardPhone
                if (bankInfo) {
                    this.bankName = bankInfo.bankName + `(${bankInfo.bankCardNum.substr(-4)})`
                    this.bankInfo = {
                        bankCardNum: bankInfo.bankCardNum,
                        bankCardPhone: bankCardPhone,
                        bankNo: bankInfo.bankNo || "",
                    }
                }
            }
        })
    }

    //获取民族
    onChangeNation = (val) => {
        runInAction(() => {
            this.nationVal = val
        })
    }

    //获取性别
    onChangeSex = (val) => {
        runInAction(() => {
            this.sexVal = val
        })
    }
    //点击下一步选择
    nextStepConfirm = async () => {
        if (this.Config.nextType == 'openInputSmsCode') {
            // 需要验证码的
            let bankCardPhone = this.bankCardPhone ? this.bankCardPhone : session.get('bankInfo').bankCardPhone
            let loginPhoneNum = this.loginPhoneNum
            this.Store.Hash.history.push(`/openInputSmsCode?bankCardPhone=${bankCardPhone}&loginPhoneNum=${loginPhoneNum}`)
        }
        if (this.Config.nextType == 'openSuccess') {
            // 不需要验证码的
            this.Store.Hash.history.push('/openSuccess')
        }
        //跳转活体也页面
        if (this.Config.nextType == 'faceDiscern') {
            this.Store.Hash.history.push('/faceDiscern')
        }
    }
    // 设置300自定义头部标题
    setAlertTitle = () => {
    }
    //接口抽离
    apiOpenAccountSubmit = this.apiBank.apiOpenAccountSubmit
    //下一步按钮
    submit = async () => {
        let idcardUploadFlag: String = session.get("idcardUploadFlag")||"0" //工商字段
        let { imageOrderNo }: any = session.get('updateIdCardResult') || {} //获取更新身份证返回信息。
        let { idcardBackPhoto = '', idcardFrontPhoto = '' }: any = session.get("carIdBase64") || {}
        let sex = this.sexVal[0] == '男' ? '0' : (this.sexVal[0] == '0' ? "0" : "1")
        let params = {
            certificateType: 0,//证件类型
            realName: this.result.realName,   // 姓名
            //TODO:
            // loginPhoneNum: this.result.loginPhoneNum || '', // 不是必须。手机号
            userDuty: this.dutyCode || this.dutyVal, //默认选中职业
            cardExpireDate: this.result.cardExpireDate, //有效期
            address: this.result.address, //地址
            residentAddress: session.get('residentAddress') || '', // 居住地址
            nation: this.nation || this.result.nation, //民族
            signOrg: this.result.signOrg,//签发机构
            sex: this.sexVal[0], //性别
            bankCardNum: this.bankInfo.bankCardNum,//银行卡号
            bankCardPhone: this.bankInfo.bankCardPhone,//银行卡预留手机号
            bankNo: this.bankInfo.bankNo, // 行号
            bankName: this.bankName.split('(')[0],//银行名称
            userCardId: this.result.userCardId,// 身份证号
            openBank: this.bankName.split('(')[0],//银行名称
            birthday: this.result.birthday || '',// 生日
            industry: this.industryCode,// 行业
            imageOrderNo: imageOrderNo || '', // 更新身份证，更新完回传，没有传空就行。还有就是，如果其他银行需要改字段，让中台统一改字段就可以。
            transcoding: '1',
            idcardBackPhoto: this.Config.ifUploadIDCardImgBase64 ? idcardBackPhoto : "",//身份证反面
            idcardFrontPhoto: this.Config.ifUploadIDCardImgBase64 ? idcardFrontPhoto : "",//身份证前面
            signStartDate: this.result.signStartDate || this.signAndIssueDate,// 签发日期
            idcardUploadFlag: idcardUploadFlag,//工商银行判断 更新没更新 身份证
            ePassword: '' // 广州农商银行需要字段
        }
        
        try {
            this.setAlertTitle ? this.setAlertTitle() : null
            runInAction(() => {
                this.isHttp = "open"
            })
            const res = await this.apiOpenAccountSubmit(params)
            runInAction(() => {
                this.isHttp = "close"

            })
            session.remove('residentAddress')
            session.set('openSuccessData', res)
            this.nextStepConfirm()
        } catch (e) {
            runInAction(() => {
                this.isHttp = "close"
            })
            session.remove('residentAddress')
            this.catchFn(e)
        }
    }
    // 点击更新按钮操作。可重写
    nextStep = async () => {
        try {
            perfectOpenInfoBtn()
        } catch (err) {
        }
        this.submit()
    }
    catchFn = (e) => {
        switch (e.innerCode) {
            case INNER_CODE.SubmitAndDoThing:
                this.Store.openAlert('开户失败', e.popMsg, [
                    { text: '确定', onPress: () => console.log('确定') },
                ])
                break;
            case INNER_CODE.ModifyOpenInfo:
                this.Store.openAlert('开户失败', e.popMsg, [
                    {
                        text: '修改开户信息', onPress: () => {
                            this.Store.Hash.history.replace('/openFlow')
                        }
                    },
                ])
                break;
            case INNER_CODE.CancelAndUpdateIdCard:
                this.Store.openAlert(this.alterTitle, e.popMsg, [
                    { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                    {
                        text: '更新身份证', onPress: () => {
                            this.Store.Hash.history.push('/updateIdCard?openErr=' + INNER_CODE.CancelAndUpdateIdCard)
                        }
                    },
                ])
                break;
        }
    }
}

export default new PgOpenPerfection()
