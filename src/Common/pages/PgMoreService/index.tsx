import React from 'react'
import './style.scss'
import { observer } from 'mobx-react'
import { Headers } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import IconSvg from './IconSvg'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { commonStore } from "Common/pages/store";

interface IProps {
    bindPhone?: boolean,
    bindBank?: boolean,
    password: Boolean,//交易密码管理

}
@observer
class Service extends React.Component<IProps | any, any>{
    Store = Store
    //配置项
    Config = {
        bindCardDescType: 1, // 1 显示绑卡数量 2 显示默认绑卡名称
        bindPhone: false, //更换绑定手机号
        isShowBankCard: true,//是否显示已绑定银行卡文案
        bindBank: false,
        bindSales: false, //销户
        isShowText: true,
        password: false,//交易密码管理
        ifGetBankInit:false, // 11.28新增。额外选项拓展接口。用于动态渲染某些选项。（1128增加针对金城动态显示更新身份证入口）

    }
    constructor(props) {
        super(props);
        this.state = {
            modal2: false,
            hotLine: '400-0088-692',
            serviceTime: '工作时间：9:00-24:00'
        };
    }
    /**
   * @param val 底部弹框电话跳转
   */
    callPhone(val) {
        window.location.href = `tel:${val}`;
    }
    cancelAccount = () => {
        commonStore.openAlert('提示', '电子账户销户请致电比财客服', [
            { text: <span style={{ color: "#999999" }}>取消</span>, onPress: () => console.log('取消') },
            { text: '立即拨打', onPress: () => this.callPhone(this.state.hotLine) },
        ])
    }

    componentDidMount(): void {
        let { apiBandCardFn ,getBankInit} = this.Store
        apiBandCardFn({
            bizType: BIZ_TYPE.moreService,
            transAmt: "",
            queryType: this.Config.bindCardDescType == 1 ? "3" : "0",
            prdIndexId: ""
        })
        this.Config.ifGetBankInit ? getBankInit() : null
    }
    renderBindCardDesc() {
        let { bankCardName, bankCardLen } = this.Store
        let { bindCardDescType } = this.Config
        if (bindCardDescType == 1) {
            return <span color='#999'>已绑定{bankCardName}</span>
        }
        if (bindCardDescType == 2) {
            return <span color='#999'>已绑定{bankCardLen}张银行卡</span>
        }
    }
    //绑定银行卡管理模块
    renderBank(flag) {
        let { handelBank, bankCardName, bankCardLen } = this.Store
        let { isShowBankCard } = this.Config
        return flag ? null : <p onClick={() => {
            handelBank()
        }}>
            <span>绑定银行卡管理</span>
            {
                bankCardName && isShowBankCard ?
                    <span className="service-lineRight" >
                        {this.renderBindCardDesc()}
                        <IconSvg color='#999' />
                    </span>
                    :
                    <span className="service-lineRight" onClick={() => {
                        handelBank()
                    }}>
                        <IconSvg color='#999' />
                    </span>
            }
        </p>
    }

    //交易密码模版
    /*
    TODO
    */
    renderPassWord(flag) {
        let {isSetPassword,isPassword}=this.Store
        console.log(isSetPassword)
        return flag ? <p onClick={() => {
            isPassword(isSetPassword)
        }}>
            <span>交易密码管理</span>
            {
                <span className="service-lineRight" >
                    {Number(isSetPassword)?"修改交易密码":"设置交易密码"}
                    <IconSvg color='#999' />
                </span>
            }
        </p> : null
    }
    //绑定销户管理模块
    renderSales(flag) {
        let { bankElecAccountNum } = this.Store
        let { isShowText } = this.Config
        bankElecAccountNum = bankElecAccountNum && bankElecAccountNum.substr(bankElecAccountNum.length - 4)
        return flag ? <p onClick={() => { this.cancelAccount() }}>
            <span>电子账户销户</span>
            <span>
                {
                    isShowText ? `已开户：${bankElecAccountNum}` : null
                }

                <i className='iconfont pdl8' >&#xe633;</i>
            </span>
        </p> : null
    }
    //更换绑定手机号
    renderPhone(flag) {
        let { handelPhone } = this.Store
        return (
            flag ? null : <p onClick={() => {
                handelPhone()
            }}><span>更换绑定手机号</span>
                <span className="service-lineRight">
                    <IconSvg color='#999' />
                </span>
            </p>)
    }

    // 新增用于某些银行多余拓展，直接重写该方法extendRenderDiv。可以参考 203 金城银行
    extendRenderDiv(){

    }
    //render()
    render() {
        let { bindPhone, bindBank, bindSales, password } = this.Config
        return <div className='Service'>
            {/* 头部 */}
            <Headers>更多服务</Headers>
            <div className='Service-list'>
                {
                    this.renderBank(bindBank)
                }
                {
                    this.renderPhone(bindPhone)
                }
                {
                    this.renderSales(bindSales)
                }
                {
                    this.renderPassWord(password)
                }
                {/*新增用于某些银行多余拓展，直接重写该方法extendRenderDiv，一直放置到底部*/}
                {
                    this.extendRenderDiv()
                }

            </div>
            <BottomColumn type='long' />
        </div>
    }
}
export default Service
