import React from 'react'
import './style.scss'
import { observer, inject } from 'mobx-react'
import { Headers } from 'Common/publicCommon/index'
import { BcButton, BcInput } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Tool from 'Common/utils/Tool'
import Store from './store'
import { commonStore } from 'Common/pages/store'


@observer
class ChangePhone extends React.Component<any, any> {
    state = {
        flag: false,
        phoneErr: {
            val: "新手机号错误",
            flag: "phone"
        },
        idCardErr: {
            val: "身份证号错误",
            flag: "idCard"
        },
        nameErr: {
            val: "姓名格式错误",
            flag: "name"
        },
        oldPhoneErr: {
            val: "姓名格式错误",
            flag: "name"
        }
    }
    Store = Store
    UNSAFE_componentWillMount(): void {
        let query: any = commonStore.query()

        if (query) {
            let bandCardInfo = JSON.parse(query.bandCardInfo)
            console.log(bandCardInfo);

            let { initData } = this.Store
            initData(bandCardInfo)
        }
    }
    changePhoneTitle = () => {
        return <p className='ChangePhone-tip'>
            <span className="ChangePhone-title">温馨提示：</span>
            <span>更换手机号之前，请您确认新手机号与绑定银行卡的预留手机号相同，如果不同请先更换绑定银行卡的预留手机号。</span>
        </p>
    }
    render() {
        let { phoneErr, idCardErr, nameErr, oldPhoneErr } = this.state
        let { next, name, idCard, newPhone, oldPhone, handelName, handelIdCard, handelNewPhone, handelOldPhone, showNote } = this.Store
        return <div className='ChangePhone'>
            {/* 头部 */}
            <Headers>更换手机号</Headers>
            <div className='ChangePhone-identity'>
                <BcInput
                    title='真实姓名'
                    errMsg={nameErr}
                    placeholder='真实姓名'
                    isDisabled={true}
                    onFocus={() => true}
                    value={name}
                    max={18}
                    type='text'
                    className='BcInput_style'
                    onChange={(val) => handelName(val)}
                > </BcInput>
                <BcInput
                    title='原手机号'
                    errMsg={oldPhoneErr}
                    placeholder='原手机号'
                    onFocus={() => true}
                    isDisabled={true}
                    value={oldPhone}
                    type='number'
                    max={11}
                    className='BcInput_style'
                    onChange={(val) => handelOldPhone(val)}
                > </BcInput>
                <BcInput
                    title='身份证号'
                    errMsg={idCardErr}
                    placeholder='请输入身份证号'
                    onFocus={() => true}
                    value={idCard}
                    max={18}
                    type='text'
                    className='BcInput_style'
                    onChange={(val) => handelIdCard(val)}
                    allPlaceFocus={true}
                > </BcInput>
                <BcInput
                    title='新手机号'
                    errMsg={phoneErr}
                    placeholder='请输入新手机号'
                    onFocus={() => true}
                    value={newPhone}
                    type='number'
                    className='border BcInput_style'
                    max={11}
                    onChange={(val) => handelNewPhone(val)}
                    allPlaceFocus={true}
                > </BcInput>
            </div>
            <BcButton isDisabled={!new RegExp(Tool.Regular.bcphone).test(newPhone) || !new RegExp(Tool.Regular.cardID).test(idCard)} className='ChangePhone-confirm' onClick={() => next()}>下一步</BcButton>
            {
                showNote ?
                    this.changePhoneTitle()
                    : null
            }

            <BottomColumn type='long' />
        </div>
    }
}
export default ChangePhone