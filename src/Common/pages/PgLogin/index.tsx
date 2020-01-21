import React from 'react'
import {observer, inject} from 'mobx-react'
import {Toast} from 'antd-mobile';//ui组件
import {getImgCode} from 'Common/api/picCode'
import {session} from 'Common/utils/store'
import {token} from 'Common/utils/user'
import {watchApi} from 'Common/api/watch'
import {InputItem, Button, List, Modal} from 'antd-mobile';
import apiBicai from "Common/api/bicai2.0"
import {apiFactory, apiVersion} from 'Common/api/bank'
import Store from './store'
import {BcBanner, BcButton} from 'Common/publicCommon/index'
import {realNameUpdateBtn} from 'Common/Plugins/recordLogInfo'
import Headers from 'Common/publicCommon/Headers'
import WxMiniFly from 'Common/publicCommon/WxMiniFly'
import goBC from 'Common/utils/goBC'

import './style.scss'

// import {BcHeader} from 'bc-bank-design'
// import {TradeRequestMethod} from 'Common/pages/store'
// let {init} = TradeRequestMethod
// init()

interface Props {
    IMG?: any,
    SESSION_ID?: any,
    mark?: any,
    PHONE_TOKEN?: any,
    hasOpenBank?: any
}

@observer
export default class Hello extends React.Component<any, any> {
    /*=========控制api版本 start page里建议不要进行apiBank请求数据，统一到store里 ========*/
    apiVersion: apiVersion = 'v2'
    apiBank: any = apiFactory(this.apiVersion)
    /*=========控制api版本 end========*/
    Store:any = Store

    constructor(props) {
        super(props)
        this.state = {
            telephone: props.telephone || "",
            smsCode: props.smsCode || "",
            safeCode: '',
            IMG: '',
            show: false,
            backShow: '',
            proId: props.proId || '',
            modal2: false
        }
    }

    async componentDidMount() {
        let {imitateParams,isImitateParams} = this.props
        if(isImitateParams){
            session.set("imitateParams",imitateParams) // 增加额外联调参数，直接通过memberId登录。不用token。需要的话在个别银行登录页进行参数配置
        }
        let { telephone,smsCode,proId } = this.state;
        this.setState({
            telephone: this.Store.telephone || telephone,
            smsCode: this.Store.smsCode || smsCode,
            proId: this.Store.proId || proId
        })

        // this.getImgCode()
        // this.getBackShow()
        // console.log(TradeRequestMethod.init())
    }

    async getSmsCode(canLogin: boolean) {
        let {mark}: Props = await apiBicai.getLoginTelCode({
            PHONE_NUM: this.state.telephone + '',
            SAFT_CODE: this.state.safeCode + ''
        })

  
        this.setState({
            safeCode: ''
        })
        if (mark == 0) {

        } else {
            if (canLogin) { // 用于拦截第一次
                // 成功！
                this.setState({
                    show: false
                })

            } else {
                this.getImgCode()
                this.setState({
                    show: true
                })
            }
        }
    }

    Config = {
        isTempApiOpen: 0
    }

    // 登录
    async login() {
        // 默认值0是不掉起挡板
        let {isTempApiOpen = 0} = this.props
        session.set('openTem', isTempApiOpen)
        let {telephone} = this.state
        console.log(telephone)
        session.set('userTel', telephone)
        let {PHONE_TOKEN, OPEN_API_CHANNEL_ID}: any = await apiBicai.apiBicaiLogin({
            PHONE_NUM: this.state.telephone,
            PHONE_CODE: this.state.smsCode,
            SAFT_CODE: this.state.safeCode
        })
        token.set(PHONE_TOKEN)
        session.set('userChannel', OPEN_API_CHANNEL_ID)
        // let userChannel = session.get('userChannel') || '1' // 登录时获得。或者小程序sessionStorage传人
        Toast.info('登录成功')
    }

    // 去购买
    async goBuy(proId) {
        if (!token.get()) return Toast.info('请先登录')
        // let { initData } = Store
        // await initData({ ID: proId })
        session.set('buyParams', {
            amount: ''
        })
        session.set('expandJson', JSON.stringify({
            teamId: '', investId: ''
        }))
        this.props.history.push("/buy?proId=" + proId)
    }

    // 去银行首页
    goBankDetail() {
        if (!token.get()) return Toast.info('请先登录')
        this.props.history.push('/bankDetail')
    }

    // 身份证过期去更新身份证
    goUpdataIdCard() {
        // if (!token.get()) return Toast.info('请先登录')
        this.props.history.push('/updateIdCard')
    }

    // 获取图形验证码
    async getImgCode() {
        let {SESSION_ID, IMG}: Props = await getImgCode()
        this.setState({IMG})
        session.set('sessionId', SESSION_ID)
    }

    // 获取图形验证码
    async goOpenFlow() {
        if (!token.get()) return Toast.info('请先登录')
        this.props.history.push('/openFlow')
    }

    async checkOpenStatus() {
        let res = await this.apiBank.apiQryLoginStatus()
        console.table(res);
        // hasLogin  是否需要登录银行 0：不需要登录 1：已登录 2：未登陆
        // hasOpenBank 是否已开户  前端用该字段判断用户，是否已开户(1：已开户 2：未开户 3：处理中)
        // openBankStatusDesc 开户状态描述
    }

    async getRealNameStatus() {
        //
        let res = await this.apiBank.openAccountCheck()
        // console.log()
        //    用户实名状态 1：已实名 0：未实名
        if (res.userAuthStatus == '0') {
            Toast.info('未实名')
        }
        if (res.userAuthStatus == '1') {
            Toast.info('已实名')
        }
    }

    // 获取回显状态
    async getBackShow() {
        if (!token.get()) return Toast.info('请先登录')
        console.log(this.apiBank);
        let {hasOpenBank}: Props = await this.apiBank.apiQryLoginStatus({})
        console.log(hasOpenBank);
        // hasOpenBank 是否已开户(1：已开户 2：未开户 3：处理中)
        if (hasOpenBank == 1) {
            Toast.info('已开户')
        } else if (hasOpenBank == 2) {
            Toast.info('未开户')

        } else if (hasOpenBank == 3) {
            Toast.info('处理中')
        }

    }

    goBackProductList() {
        goBC({
            name: 'ProductList',
            type: 'push',
            params: {
                CHANNEL_ID: session.get('channelId')
            }
        })
    }

    goRealName() {
        let toRealName = {
            head: {
                channelId: "", // 必传。渠道id 外部传人。数字
                userChannel: "1", // 登录状态下必传。用户注册渠道 。小程序登录要传。登录时的OPEN_API_CHANNEL_ID
                appFlag: "PMP", //  必传。BC / PC / PMP  必传 不传默认BC
                channel: "", // 不知道是啥，h5传空
                clientId: "30", // 不知道是啥。传30。
                deviceId: "h5", // 设备号。 获取不到可不传。
                deviceName: "", // 设备名称。获取不到可不传。
                systemType: "h5", // 系统。'h5' 浏览器内获取不到，传h5
                token: "", // 登录时必传
                version: "", // 版本号，获取不到可不传。
                channelType: "2" // h5传2
            },
            // common:{}, // 占位不用填写
            type: "realName",
            params: {
                targetHref: "" // 跳转
            }
        };
        // 统一通过url问号拼接传参数。
        //传参数前将参数先进行JSON.stringify，然后进行encodeURIComponent
        window.location.href = `https://app-test3.bicai365.com/h5openapibanks/000/realName.html#/openFirst?toRealName=1&data=${encodeURIComponent(JSON.stringify(toRealName))}`
    }

    doNative() {
        let data = {}
        let {sendParam}: any = window
        sendParam(data)
    }

    onClose = (key): any => () => {
        this.setState({
            [key]: false,
        });
    }

    doWatch(prdIndexId) {
        realNameUpdateBtn()
    }

    render() {
        return (
            <div className='login'>
                <Headers type="back">{require('src/web.config.json').orgName}登录</Headers>
                {/*<BcHeader>{require('src/web.config.json').orgName}登录</BcHeader>*/}
                {/*<Header/>*/}
                {/*<BcBanner/>*/}
                <Modal
                    popup
                    visible={this.state.modal2}
                    onClose={this.onClose('modal2')}
                    animationType="slide-up"
                >
                    <List className="popup-list">

                    </List>
                </Modal>
                {/*<img src="https://openapih5test1.bicai365.com/images/wait.png" alt="" width="60" height="60"/>*/}
                <InputItem
                    type="text"
                    placeholder=""
                    onChange={(e) => {
                        this.setState({telephone: e})
                    }}
                    value={this.state.telephone}
                >手机号码</InputItem>
                <InputItem
                    type="text"
                    onChange={(e) => {
                        this.setState({smsCode: e})
                    }}
                    value={this.state.smsCode}
                    placeholder=""
                >验证码 </InputItem>

                <Button type="ghost" size="small" onClick={this.getSmsCode.bind(this, false)}>获取验证码</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.login.bind(this)}>登录</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.goOpenFlow.bind(this)}>去开户首页</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.goBankDetail.bind(this)}>去银行详情页</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.goBuy.bind(this, this.state.proId)}>去购买</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.goUpdataIdCard.bind(this)}>去更新身份证</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.getRealNameStatus.bind(this)}>校验是否在比财实名认证</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.checkOpenStatus.bind(this)}>校验是否开户状态</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.getBackShow.bind(this)}>获取回显信息</Button>
                <div className="line"></div>
                <Button type="primary" onClick={this.goRealName.bind(this)}>去实名注册</Button>
                <div className="line"></div>

                <InputItem
                    type="text"
                    onChange={(e) => {
                        this.setState({proId: e})
                    }}
                    value={this.state.proId}
                    placeholder=""
                >产品id </InputItem>

                <div className="line"></div>
                <Button type="primary" onClick={() => this.props.history.push('/test')}>去原生页面测试</Button>
                <div className="line"></div>

                <Button type="primary" onClick={this.doWatch.bind(this, this.state.proId)}>打点测试</Button>
                <div className="line"></div>

                <Button type="primary" onClick={this.goBackProductList.bind(this)}>返回产品列表</Button>
                <div className="line"></div>
                <Button type="primary" onClick={() => this.props.history.push('/faceDiscern')}>去活体识别测试页面</Button>
                 <div className="line"></div>
                 <Button type="primary" onClick={() => {
                    // this.apiBank.getApi('apiText')()
                    this.Store.ptClick()
                }}>模拟拼团跳转链接购买</Button>

                <WxMiniFly> </WxMiniFly>
                <div className="list-box"></div>
                {
                    this.state.show ?
                        <section className="safe-code">
                            <div>
                                <p>请填写图形验证码</p>
                                <section className="middle">
                                    <input type="tel" placeholder="请输入图形验证码" onChange={(val) => {
                                        console.log(val.target.value);
                                        this.setState({safeCode: val.target.value})
                                    }}
                                           value={this.state.safeCode}/>
                                    <img src={'data:image/png;base64,' + this.state.IMG} alt=""
                                         onClick={this.getImgCode.bind(this)}/>
                                </section>
                                <section className="btn">
                                    <button onClick={() => {
                                        this.setState({show: false})
                                    }}>取消
                                    </button>
                                    <button onClick={this.getSmsCode.bind(this, true)}>确定</button>
                                </section>
                            </div>
                        </section>
                        : null
                }
            </div>
        )

    }
}
