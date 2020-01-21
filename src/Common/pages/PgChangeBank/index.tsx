import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import { BcButton, BcPhoneInput, BcBankInput } from 'Common/publicCommon/index'
import { imgSrc } from "Common/config/index";
import Tool from 'Common/utils/Tool'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'

@observer
class ChangeBank extends React.Component<any, any> {
    state = {
        phone: "",
        usePhone: ''//为手机号设置初始值
    }
    //配置项
    Config = {
        Idisabled: Boolean //手机号校验
    }
    Store = Store
    componentDidMount() {
        let { initData } = this.Store
        initData()
    }

    componentWillUnmount() {
        let { getCard } = this.Store
        getCard('')
    }
    //手机号input框封装函数
    BcPhoneInput() {
        let {
            updatePhone,
            defaultPhone,
            bottomNoteOnoff
        } = this.Store
        return <BcPhoneInput
            defaultPhone={defaultPhone}
            bottomNoteOnoff={bottomNoteOnoff}
            onChange={(e) => updatePhone(e)}
        > </BcPhoneInput>
    }
    render() {
        let {
            getImgData,
            result,
            getCard,
            phone,
            cardNo,
            flag,
            show,
            errTip,
            realName,
            userCardId,
            next,
        } = this.Store

        let { Idisabled } = this.Config

        return <div className='addNewBank'>
            {/* 头部 */}
            <Headers>绑定银行卡</Headers>
            {/*个人信息  */}
            <p className='addNewBank-tit'>
                <span>{realName && ('*' + realName.substr(1))}</span>
                <span>{(() => {
                    let useId = userCardId
                    if (!useId) return ''
                    return useId.substr(0, 1) + '****************' + useId.substr(-1)
                })()}</span>
            </p>
            {/* 绑定银行卡 */}
            <div className='addNewBank-card'>
                <BcBankInput tip={{
                    flag,//设置当前文本框是否输入正确
                    errTip,
                    show,//设置当前提示信息是否显示
                    logo: imgSrc + result.bankLogoUrl,
                    value: result.bankName,
                    value1: result.bankCardQuotaDescDto ? result.bankCardQuotaDescDto.singleDedctDesc : '',
                    value2: result.bankCardQuotaDescDto ? result.bankCardQuotaDescDto.dayDedctDesc : ''
                }}
                    className='border'
                    getImgBase={(val) => getImgData(val)}
                    defaultValue={cardNo}
                    change={(e) => {
                        getCard(e)
                    }}> </BcBankInput>
                {this.BcPhoneInput()}
            </div>
            <p className='addNewBank-check-bank'><span onClick={() => {
                this.props.history.push('/bankList')
            }}>查看支持银行</span></p>
            {/* 下一步 */}
            <div className='AddNewBank-confirm'>
                <BcButton
                    isDisabled={Idisabled ? !flag || !Tool.Regular.bcphone.test(phone) : !flag}
                    onClick={() => {
                        next()
                    }}
                >下一步</BcButton>
            </div>
            <BottomColumn type='long' />
        </div>
    }
}

export default ChangeBank
