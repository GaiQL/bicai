import { observable, action, computed, runInAction } from "mobx";
import Lrz from 'lrz'
import { Modal, Toast } from 'antd-mobile';
import { Images } from "Common/config/index";
import { Native } from "Common/utils/appBridge"
import { StoreExtends } from 'Common/Plugins/store.extends'
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'
import { INNER_CODE } from "Common/config/params.enum";
import { log } from "util";
import realNameApi from 'Common/api/realname'

export class updateIdCard extends StoreExtends {

    @observable emblemImg = Images.guohui   //国徽
    @observable figureImg = Images.renxiang //人像
    @observable emblemImgBase = ""          //获取国徽照片
    @observable figureImgBase = ""          //获取人像照片
    @observable birthday: any = []          //出生日期
    @observable realName = ""               //名字
    @observable userCardId = ""             //身份证号
    @observable nationVal = ['']            //民族
    @observable gender = ['']               //性别
    @observable signOrg = ""                //签发机关
    @observable address = ""                //地址
    @observable pickerValueStart: any = []  //身份证有效期前
    @observable pickerValueEnd: any = []    //身份证有效期后
    @observable dateOfIssue: any = ''       //签发日期
    @observable confirm = true
    @observable longRange = ['']
    @observable validityPeriod = ''
    @observable isShowFace: any = ''            //是否需要活体
    @observable isLiveStatus: 0 | 1 = 0          //是否做过活体
    @observable alertText = '更新失败'

    @observable sexList = [
        {
            label: '女',
            value: '女',
        },
        {
            label: '男',
            value: '男',
        },
    ]

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
    /**
     * 初始化数据
     */
    initData = () => {
        runInAction(() => {
            this.realName = ''          //名字
            this.userCardId = ''        //身份证号
            this.signOrg = ''           //签发机关
            this.gender = ['']          //性别
            this.address = ''           //地址
            this.nationVal = ['']       //名族
            this.pickerValueStart = []  //身份证有效期前
            this.pickerValueEnd = []    //身份证有效期后
            this.dateOfIssue = ''       //签发日期
            this.emblemImgBase = ""     //获取国徽照片
            this.figureImgBase = ""     //获取人像照片
            this.emblemImg = Images.guohui
            this.figureImg = Images.renxiang
            this.birthday = ''
        })

        // this.formtBirthday(res.birthday)  //出生日期
        // this.formtDate(res.cardExpireDate) //
    }
    imgToBase = (e, type) => {
        if (!e.target.files[0]) return
        let quality = 1
        let ind = 1024
        // console.log(e.target.files[0].size / 1024, "size")
        let size = e.target.files[0].size / 1024
        quality = ((e.target.files[0].size / 1024) / ind) > 3 ? (ind / (e.target.files[0].size / ind)) : 0.3
        // console.log(quality, 'quality')
        Lrz(e.target.files[0], { quality })
            .then((rst) => {
                // console.log(rst, "身份证大小")
                if (type == 'emblem') {
                    this.getEmblemImg(rst.base64)
                } else {
                    this.getfigureImg(rst.base64)
                }
            })
    }
    //获取国徽照片

    getEmblemImg = (val) => {
        runInAction(() => {
            this.emblemImg = val
            this.emblemImgBase = val.split(',')[1]
        })

        this.uploadImg()
    }
    //获取人像照片

    getfigureImg = (val) => {
        runInAction(() => {
            this.figureImg = val
            this.figureImgBase = val.split(',')[1]
        })
        this.uploadImg()
    }

    uploadImg = () => {
        if (this.figureImgBase != '' && this.emblemImgBase != '') {
            this.uploadCardImg({
                idcardFrontPhoto: encodeURIComponent(this.figureImgBase),
                idcardBackPhoto: encodeURIComponent(this.emblemImgBase),
                transcoding: "1"
            })
        }
    }
    //修改名字
    changeName = (val) => {
        runInAction(() => {
            this.realName = val
        })
    }
    //修改身份证号
    changeIdCard = (val) => {
        runInAction(() => {
            this.userCardId = val
        })
    }
    //修改签发机关
    changeIssuingAuthority = (val) => {
        runInAction(() => {
            this.signOrg = val
        })
    }
    //修改性别
    onChangeSex = (val) => {
        runInAction(() => {
            this.gender = val
        })
    }
    //修改地址
    changeAddress = (val) => {
        runInAction(() => {
            this.address = val
        })
    }
    //修改民族
    changeNation = (val) => {

        runInAction(() => {
            this.nationVal = val
        })
    }
    //修改出生日期
    changeBirthday = (val) => {
        runInAction(() => {
            this.birthday = val
        })
    }

    changeValueStart = (val) => {
        runInAction(() => {
            this.pickerValueStart = val
        })
    }

    changeValueEnd = (val) => {
        runInAction(() => {
            this.pickerValueEnd = val
        })
    }
    //民族遍历出来数据
    getData = (val) => {
        runInAction(() => {
            this.nationList = val.nationList ? val.nationList.map(item => {
                return {
                    label: item.nation,
                    value: item.nation,
                    id: item.id
                }
            }) : []
        })
    }

    uploadCardImg = async (params) => {
        const res: any = await this.apiBank.apiIdCardFrontPhoneOcr(params)
        runInAction(() => {
            this.realName = res.realName //名字
            this.userCardId = res.userCardId //身份证号
            this.signOrg = res.signOrg //签发机关
            this.gender = [res.gender]  //性别
            this.address = res.address  //地址
            this.nationVal = [res.nation] //名族
            this.getData(res)  //民族
        })
        this.formtBirthday(res.birthday)  // 出生日期
        this.formtDate(res.cardExpireDate) //
        session.set('IdCardFrontPhoneOcrData', res) //  保存身份证反显信息
        return res
    }

    @action.bound
    formtBirthday(date) {
        let yearStart = Number(date.split('.')[0])
        let monthStart = Number(date.split('.')[1])
        let dayStart = Number(date.split('.')[2])

        this.birthday = [yearStart, monthStart, dayStart]
    }

    formtDate = (date) => {
        let dateStart = date.split('-')[0]
        let dateEnd = date.split('-')[1]

        let yearStart = Number(dateStart.split('.')[0])
        let monthStart = Number(dateStart.split('.')[1])
        let dayStart = Number(dateStart.split('.')[2])

        let yearEnd = Number(dateEnd.split('.')[0])
        let monthEnd = Number(dateEnd.split('.')[1])
        let dayEnd = Number(dateEnd.split('.')[2])
        runInAction(() => {
            // console.log(this.pickerValueEnd, "000000000000")
            this.longRange = [dateEnd]
            this.dateOfIssue = new Date(dateStart)
            this.pickerValueStart = [yearStart, monthStart, dayStart]
            this.pickerValueEnd = this.longRange[0] == '长期' ? ['长期'] : [yearEnd, monthEnd, dayEnd]
        })
    }

    @computed get observeConfirm() {
        if (this.realName != '' && this.userCardId != '' && this.signOrg != "" && this.pickerValueStart.length != 0 && this.pickerValueEnd.length != 0 && this.dateOfIssue != '') {
            return false
        } else {
            return true
        }
    }

    getdate = () => {
        var now = new Date(),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
    }
    addZero = (arr) => {
        return arr.map(item => item < 10 ? "0" + item : item)
    }
    formatDuring = (mss) => {
        var days = parseInt(mss / (1000 * 60 * 60 * 24) + '');
        return days
    }
    /**
     * 点击更新身份证
     */
    submitFn = async () => {
        let endTime = +new Date(this.pickerValueEnd.join('.').replace(/\.|-|,/g, '/'))//获取返显的时间戳
        let nowDate = +new Date(this.getdate().replace(/\.|-|,/g, '/'))
        let times = this.formatDuring(endTime - nowDate)
        if (times <= 30 && times >= 0) {
            commonStore.openAlert('更新失败', '身份证即将过期，请更换身份证后再更新', [
                {
                    text: '确定',
                    onPress: () =>
                        console.log('确定')
                }
            ])
        } else if (endTime < nowDate || times < 0) {
            commonStore.openAlert('更新失败', '身份证已过期，请更换身份证后再更新', [
                {
                    text: '确定',
                    onPress: () =>
                        console.log('确定')
                }
            ])
        } else {
            let { openErr }: any = commonStore.query() || {}//
            if (openErr && openErr == INNER_CODE.CancelAndUpdateIdCard) {
                this.noUpdateCardId()
            } else {
                this.updateFaceFn()
            }
        }

    }
    updateFaceFn() {
        this.apiUpdateIdCardFn()
    }

    noUpdateCardId() {
        // 需不需要判断是从开户过来的  做不通的操作
        this.apiUpdateIdCardFn(INNER_CODE.CancelAndUpdateIdCard)
    }
    /**
     * 更新身份证需要的参数
     */
    apiUpdateIdCardParams(openErr?: INNER_CODE.CancelAndUpdateIdCard, yzm?) {
        this.validityPeriod = this.addZero(this.pickerValueStart).join(',').replace(/\,/g, '.') + "-" + (this.longRange[0] == "长期" ? "长期" : this.addZero(this.pickerValueEnd).join(',').replace(/\,/g, '.'))
        return {
            isMakeUp: (openErr && openErr == INNER_CODE.CancelAndUpdateIdCard) ? '0' : '1', // 新安更新身份证标示 开户传 0 ，其他传 1。
            idcardFrontPhoto: encodeURIComponent(this.figureImgBase),   //正面base64
            idcardBackPhoto: encodeURIComponent(this.emblemImgBase),    //反面base64
            userCardId: this.userCardId,          //身份证号
            realName: this.realName,              //名字
            signOrg: this.signOrg,               //签发机关
            cardExpireDate: this.validityPeriod,                       //身份证有效期
            transcoding: '1',
            validateCode: yzm || '123456',    // 广州农商必传
            nation: this.nationVal[0] //哈密会传的字段
            //frontImgId: '',   // 身份证正面图片id
            //backImgId: '',   // 身份证反面图片id
            //ocrFlag: '', // 是否做银行ocr 0 - 未做过，上送正反面图像 1 - 做过，上送正反面图片ID
        }
    }

    // 调更新身份证api
    newApiUpdateIdCard = this.apiBank.apiUpdateIdCard

    apiUpdateIdCardFn = async (openErr?, yzm?) => {
        commonStore.changeAlertTitle(this.alertText)
        try {
            const params = this.apiUpdateIdCardParams(openErr, yzm) //
            const res = await this.newApiUpdateIdCard(params, 'hide')
            const { proId, fromApp }: any = commonStore.query() || {}
            session.set('updateIdCardResult', res) // 将更新成功后的数据保存，返回开户第一步可能需要
            session.set("idcardUploadFlag", "1") //判断是不是开户第一次
            if (openErr == INNER_CODE.CancelAndUpdateIdCard) { // 开户失败过来的
                session.set("carIdBase64", { // 更新成功统一将base64保存，开户时需要
                    idcardFrontPhoto: encodeURIComponent(this.figureImgBase),   //正面base64
                    idcardBackPhoto: encodeURIComponent(this.emblemImgBase),    //反面base64
                })
            }
            // alert(Native.isApp())
            // alert(proId)
            // alert(fromApp)
            if (proId) { // 购买成功更新身份证
                commonStore.Hash.history.push('/buy?proId=' + proId)
            } else {

                if (Native.isApp() && fromApp == 1) { // 说明应该时从app直接跳转来的
                    try {

                        await Native.closeWebView() // app端更新完直接关闭
                    } catch (e) {
                        Toast.info(e)
                    }
                } else {
                    if (openErr && openErr == INNER_CODE.CancelAndUpdateIdCard) { // 开户过来的
                        commonStore.Hash.history.push('/openPerfection')
                    } else {
                        this.gobackPage(openErr)
                    }
                }
            }

        } catch (err) {
            const { type }: any = commonStore.query() || {}
            session.remove('IdCardFrontPhoneOcrData') //  保存身份证反显信息 开户时需要

            await this.catchErr(openErr, err) // 拦截
            if (err.innerCode == INNER_CODE.CancelAndUpdateIdCard) {
                commonStore.openAlert('更新失败', err.popMsg, [
                    {
                        text: '更新身份证',
                        onPress: () =>
                            commonStore.Hash.history.replace(`/updateIdCard?type=${type}`)
                    }
                ])
            }
            if (err.innerCode == INNER_CODE.SubmitOnly) {
                commonStore.openAlert('更新失败', err.popMsg, [
                    {
                        text: '确定',
                        onPress: () =>
                            commonStore.Hash.history.replace(`/updateIdCard?type=${type}`)
                    }
                ])
            }
        }
    }

    catchErr = (openErr, err) => {
        // if(false){
        //     return Promise.reject()
        // }
        // 默认成功的
        return Promise.resolve()
    }

    gobackPage = (openErr?) => {
        commonStore.Hash.history.go(-1)
    }

    // 请认证跳人脸页面
    attestationInfo = async () => { }
}

export default new updateIdCard()
