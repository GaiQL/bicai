import React from 'react'
import MobileInput from 'Common/publicCommon/MobileInput'
import { createForm } from 'rc-form'
import '../MobileInput/style.scss'
import Tool from 'Common/utils/Tool'
import './style.scss'
import Lrz from 'lrz'
import IconSvg from './IconSvg'
/**
 * @param defaultValue 默认参数
 * @param getImgBase 获取图片base64
 * @param className 类名
 * @param onChange 获取value的回调
 * @param title 提示title
 * @param tip 提示信息
 */
interface Props {
    className?: String,
    form?: any,
    change: Function,
    placeholder?: String,
    title?: String,
    getImgBase?: Function,
    defaultValue?: string,
    tip?: { flag: Boolean, show:Boolean,errTip?: String | any, logo?: String | any, value?: String, value1?: String,value2?: String }
}

class BcBankInput extends React.Component<Props, any>{
    state = {
        bankTit: false,
        defaultVal: ""
    }
    imgToBaseFan(e) {
        let { getImgBase } = this.props
        if (e.target.files[0]){
            if (e.target.files[0].size / 1024 / 1024 > 0.5) {
                Lrz(e.target.files[0], { quality: 0.3 })
                    .then((rst) => {
                        getImgBase(rst.base64)
                    })
            } else {
                Lrz(e.target.files[0], { quality: 0.6 })
                .then((rst) => {
                    getImgBase(rst.base64)
                })
            }
        }
    }
    handleValidator = (rule, value, callback) => {
        const { tip } = this.props
        callback(tip.flag)
    }
    setVal(val){
        const { change} = this.props
        change(Tool.Regular.trimSpace(val))
    }
    UNSAFE_componentWillReceiveProps(props){
        const { change} = this.props
        // change(Tool.Regular.trimSpace(props.defaultValue))
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { bankTit } = this.state
        const {defaultValue} = this.props
        {console.log(defaultValue,'=================')}
        const { className, placeholder = '请输入本人储蓄卡卡号', title = '储蓄卡号', tip } = this.props
        return <div className={'BcBankInput' + " " + className}>
            <div className='addNewBank-card-bank'>
                <span className='bank-tit' style={{ display: bankTit || defaultValue? 'block' : "none" }}>{title}</span>
                <div className='addNewBank-card-input'>
                    <span>
                        <MobileInput
                            {...getFieldProps('bankCard', {
                                rules: [{ validator: this.handleValidator }],
                                initialValue: defaultValue && Tool.Regular.splitBank(defaultValue),
                            })}

                            placeholder={placeholder}
                            type="bankCard"
                            error={defaultValue}
                            onErrorClick={defaultValue}
                            onChange={this.setVal.bind(this)}
                            onFocus={() => { this.setState({ bankTit: true }) }}
                            onBlur={() => { this.setState({ bankTit: false }) }}
                            mold='bank'
                            bankstatus={tip}
                        >
                        </MobileInput>
                    </span>
                    <span className='upload'>
                        <input
                            type="file"
                            capture='camera'
                            accept='image/*'
                            onChange={(e) => {this.imgToBaseFan(e)}}
                        />
                        <IconSvg color='#508CEE' wid='14' hte='14'></IconSvg>
                    </span>
                </div>
            </div>
        </div>

    }
}
export default createForm()(BcBankInput)
