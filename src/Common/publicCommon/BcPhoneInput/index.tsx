import React from 'react'
import '../MobileInput/style.scss'
import MobileInput from 'Common/publicCommon/MobileInput'
import { createForm } from 'rc-form';
import Tool from 'Common/utils/Tool'
import './style.scss'


interface Props {
    className?: String,
    form?: any,
    onChange: Function,
    placeholder?: String,
    title?: String,
    defaultValue?: String,
    errTip?: String,
    defaultPhone?:String,
    bottomNoteOnoff?:boolean,
    flagState?:boolean,
}

class BcPhoneInput extends React.Component<Props, any>{
    state = {
        phoneTit: false
    }
    getInitValue() {
        const { setFields } = this.props.form;
        const { defaultValue = '' } = this.props
        setFields({ phone: { value: Tool.Regular.splitPhone(defaultValue) } })
    }
    componentDidMount() {
        this.getInitValue()
    }
    render() {
        const { getFieldProps, getFieldError, getFieldValue, setFields, validateFields } = this.props.form;
        const { phoneTit } = this.state
        const { bottomNoteOnoff = false,flagState,className,defaultPhone, onChange, placeholder = '请输入银行预留手机号', title = '银行预留手机号', errTip = '手机号格式有误'} = this.props
        console.log(defaultPhone,"phone")
        return <div className={'BcPhoneInput' + " " + className}>
            <div className='addNewBank-card-phone'>
                <span className='bank-tit' style={{ display: phoneTit || !!getFieldValue('phone') ? 'block' : "none" }}>{title}</span>
                <div className='addNewBank-card-input'>
                    <span>
                        <MobileInput
                            {...getFieldProps('phone', {
                                rules: [{
                                    transform: (val) => Tool.Regular.trimSpace(val),
                                    pattern: Tool.Regular.bcphone, message: errTip
                                }
                                ]
                            })}
                            type="phone"
                            disabled={flagState}
                            placeholder={placeholder}
                            error={!!getFieldError('phone')}
                            onErrorClick={getFieldError('phone')}
                            onChange={(val) => {
                                onChange(Tool.Regular.trimSpace(val))
                                setFields({ phone: { value: val } }),
                                validateFields({ phone: { value: val } })
                            }}
                            onFocus={() => { this.setState({ phoneTit: true }) }}
                            onBlur={() => { this.setState({ phoneTit: false }) }}
                            mold='phone'
                        >
                        </MobileInput>
                        {
                            bottomNoteOnoff?
                            defaultPhone ? <p className='BcPhoneTit'>
                            应众邦银行政策要求，预留手机号必须为
                            <span onClick={()=>{
                                 setFields({ phone: { value: Tool.Regular.splitPhone(defaultPhone) } })
                                 onChange(defaultPhone)
                            }}>{defaultPhone}（点击填入）</span>
                            </p>:null
                            :null
                        }
                    </span>
                </div>
            </div>
        </div>
    }
}
export default createForm()(BcPhoneInput)