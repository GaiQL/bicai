import React from 'react'
import './style.scss'
import { createForm } from 'rc-form'
import { InputItem,List } from 'antd-mobile'
import Tool from 'Common/utils/Tool'


/**
* @param onFocus 获取焦点默认给true () => true
* @param onChange 获取动态value
* @param value 设置默认值
* @param type input类型
* @param errMsg 报错信息 {val: "身份证号错误",flag: "idCard"}
* @param isDisabled 文本框是否可用
*/

interface Props {
    className?: string,
    title: string,
    placeholder?: string,
    onFocus: Function,
    form?: any,
    onChange?: Function,
    value?: any,
    type?: any
    errMsg?: Object,
    max?: Number,
    isDisabled?: Boolean,
    allPlaceFocus?:Boolean
}


interface errProps {
    flag?: any,
    val?: any
}
export default createForm()(
    class BcInput extends React.Component<Props, any>{
        state = {
            isShowTit: false
        }
        inputRef = null;
        renderError() {
            let { errMsg = {} } = this.props
            let errObj: errProps = errMsg
            if (errObj.flag == 'phone') {
                return {
                    pattern: Tool.Regular.bcphone, message: errObj.val
                }
            } else if (errObj.flag == 'idCard') {
                return {
                    pattern: Tool.Regular.cardID, message: errObj.val
                }
            }
            return {}
        }
        componentDidMount() {
            const { setFields, } = this.props.form;
            const { value } = this.props;
            setFields({ BcInput: { value } })
        }
        render() {
            let { className,title,placeholder,onFocus,form,onChange,value,type,max = null,isDisabled,allPlaceFocus = false } = this.props
            let { isShowTit } = this.state
            const { getFieldProps, setFields, validateFields, getFieldError } = form;
            return <div className='BcInput'>
                <div className={'BcInput-item' + " " + className} onClick={()=>{ allPlaceFocus?this.inputRef.focus():null }}>
                    <span className='BcInput-item-tit'>{isShowTit && title || value && title}</span>
                    <InputItem
                        {...getFieldProps('BcInput', {
                            rules: [this.renderError()]
                        })}
                        ref={el => this.inputRef = el}
                        type={type}
                        maxLength={max && max}
                        error={!!getFieldError('BcInput')}
                        className='BcInput-item-input'
                        placeholder={placeholder}
                        style={{ color: isDisabled?"#999999":"#666666", fontSize: '16px' }}
                        disabled={isDisabled}
                        onChange={(val) => {
                            onChange(val)
                            setFields({ BcInput: { value: val } })
                            validateFields({ BcInput: { value: val } })
                        }}
                        onFocus={() => this.setState({ isShowTit: onFocus() })}
                        onBlur={() => this.setState({ isShowTit: value ? true : false })}
                    > </InputItem>
                    <div className="am-list-item" style={{ height: 'auto', minHeight: 0 }}>
                        <div className="am-input-control">
                            <div style={{
                                color: '#f5222d',
                                padding: '5px 0px',
                                textAlign: 'left',
                                position: 'relative',
                                fontSize: 12,
                            }}>
                                {getFieldError('BcInput')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    })