import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import { BcButton, BcPhoneInput, BcBankInput } from 'Common/publicCommon'
import { imgSrc } from "Common/config";
import Tool from 'Common/utils/Tool'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import { commonStore } from 'Common/pages/store'
import { bindingCardBtn } from 'Common/Plugins/recordLogInfo'

@observer
class AddNewBank extends React.Component<any, any> {
    state = {
        phone: "", // 默认手机 比财开户手机
        userName: '',
        userCardId: '',
        bankCardPhone: ''// 银行卡预留手机
    }
    Store = Store
    componentWillUnmount() {
        let { getCard } = this.Store
        getCard('')
    }

    async next(result) {
        try {
            bindingCardBtn()
        } catch(err) {}
        this.props.history.replace({
            pathname: '/openPerfection', state: {
                bankCardPhone: this.state.bankCardPhone,
                bankInfo: result
            }
        })
    }
    componentDidMount() {
        let obj: any = commonStore.query()
        console.log(obj)
        this.setState({
            userName: obj.name,
            userCardId: obj.idCard,
            phone: obj.loginPhoneNum
        })
    }
    render() {
        let { phone, bankCardPhone } = this.state
        let { getImgData, result, getCard, bankCardNum, flag, show, errTip, bottomNoteOnoff } = this.Store
        return <div className='addNewBank'>
            {/* 头部 */}
            <Headers>绑定银行卡</Headers>
            {/*个人信息  */}
            <p className='addNewBank-tit'>
                <span>{this.state.userName && ('*' + this.state.userName.substr(1))}</span>
                <span>{(() => {
                    let useId = this.state.userCardId
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
                    value1: result.bankCardQuotaDescDto ? result.bankCardQuotaDescDto.singleDedctDesc : result.singleDedctDesc,
                    value2: result.bankCardQuotaDescDto ? result.bankCardQuotaDescDto.dayDedctDesc : result.bankCardQuotaDescDto
                }}
                    className='border'
                    getImgBase={(val) => getImgData(val)}
                    defaultValue={bankCardNum}
                    change={(e) => {
                        getCard(e)
                    }}> </BcBankInput>

                <BcPhoneInput
                    bottomNoteOnoff={bottomNoteOnoff}//显示隐藏的状态
                    defaultPhone={phone}//默认手机号
                    onChange={(e) => this.setState({ bankCardPhone: e })}
                > </BcPhoneInput>
            </div>
            <p className='addNewBank-check-bank'><span onClick={() => this.props.history.push('/bankList')}>查看支持银行</span></p>
            {/* 下一步 */}
            <div className='AddNewBank-confirm'>
                <BcButton isDisabled={!flag || !Tool.Regular.bcphone.test(bankCardPhone)}
                    onClick={this.next.bind(this, result)}>下一步</BcButton>
            </div>
            <BottomColumn type='long' />

        </div>
    }
}

export default AddNewBank
