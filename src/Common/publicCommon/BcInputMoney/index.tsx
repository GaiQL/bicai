
import React from 'react'
import {Images} from "Common/config/index";
import './style.scss'

interface Rules {
    isFormat?: Boolean,
    isShowAll?: Boolean,
    isShowDelIcon?: Boolean,
    val?: any,
    handleFormat: Function,
    handleChange?: Function,
    handleDel?: Function,
    handleAll?: Function,
    placeholder?: any,
    small?: any

}
export default class BcInputMoney extends React.Component<Rules, any>{
    constructor(props) {
        super(props)
    }
    handleChange = (e) => {
        e.target.value = e.target.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')
        this.props.handleChange(e)
    }
    handleDel = () => {
        this.props.handleDel()
    }
    handleAll = () => {
        this.props.handleAll()
    }
    handleBlur = () => {
        const { isFormat, val } = this.props
        if (isFormat && val) { // 表示需要格式化
            this.props.handleFormat('blur')
        }
    }
    handleFoucs = () => {
        const { isFormat, val } = this.props
        if (isFormat && val) { // 表示需要格式化
            this.props.handleFormat('focus')
        }
    }
    render() {
        const { isShowAll, val, placeholder, small, isShowDelIcon } = this.props
        return (
            <div className="bc-money-input-box">
                <span className="unit">¥</span>
                <input className={"money-input " + (small ? small : '')} type="text" value={ val == null ? '' : val } placeholder={ placeholder ? placeholder : '请输入金额'} onBlur={this.handleBlur} onFocus={this.handleFoucs} onChange={this.handleChange}/>
                <div className={`del-img ${isShowDelIcon ? '' : 'hidden'}`} onClick={ this.handleDel }>
                    <img src={Images.delIcon} alt="" width="16" height="17"/>
                </div>
                <div className={`all ${isShowAll ? '' : 'hidden'}`} onClick={ this.handleAll }>全部</div>
            </div>
        )
    }
}
