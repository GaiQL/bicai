/**
 * @author  Mr.ma
 * @use     四大交易的输入金额的输入框 & 键盘
 * @date    2019-07-25
 * @params  extra 是否显示全部按钮(可配置文案)
 *          value 初始外界传的参数 / 点击全部金额传入的参数
 *          handleChange 输入input框的change事件
 *          handleExtra 右侧信息的按钮事件
 *          isEdit  内容是否可编辑
 * 还有的api未开放，如需看antd mobile的文档
 */
import React from 'react'
import { createForm } from 'rc-form';
import './style.scss'
import { InputItem, List } from 'antd-mobile'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

interface Props {
    extra?: boolean,
    value: any,
    handleChange?: Function,
    handleExtra?: Function,
    placeholder?: string,
    isEdit?: boolean,
    haveValueHaveClear?: boolean
}

class DealInput extends React.Component<Props, any> {
    // change 改变值
    boxRef = null;
    inputRef = null;
    cloneNode = null;
    inputFocus = false;
    change(val) {
        if (val && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) {
            if (val === '.') {
            return '0.';
            }
            return '';
        }

        this.props.handleChange(val);

        if( this.cloneNode ){ this.cloneNode.style.display = val?"block":"none" }    

    }
    componentDidMount(){

        // 改输入框里的小叉叉，又不改了...

        // if( this.props.haveValueHaveClear ){

            // this.boxRef.getElementsByClassName("am-list-line")[0].addEventListener("DOMNodeInserted",(e) => {

            //     let hasClear = Array.from( this.boxRef.getElementsByClassName("am-list-line")[0].getElementsByClassName("am-input-clear") );
    
            //     let createOnff = true;
    
            //     hasClear.forEach(( e:any )=>{ console.log( e.type );if( e.type == "clone" ){ createOnff = false } });
    
            //     if( e.target.className == "am-input-clear" &&  e.target.type != "clone" && createOnff ){
    
            //         let clearDom = e.target;

            //         let cloneClearDom = clearDom.cloneNode(true);
    
            //         cloneClearDom.addEventListener('click', (event) => {
            //             if( this.inputFocus ) this.inputRef.focus();
            //             this.props.handleChange(""); 
            //             this.cloneNode.style.display = "none";
            //         });
    
            //         clearDom.style.display = "none";
            //         clearDom.style.position = "absolute";
    
            //         cloneClearDom.style.display = this.props.value?"block":"none";
    
            //         cloneClearDom.type = "clone";
    
            //         clearDom.parentNode.insertBefore( cloneClearDom,clearDom.parentNode.getElementsByClassName("am-input-clear")[0] );

            //         this.cloneNode = cloneClearDom;
    
            //     }else if( e.target.className == "am-input-clear" && e.target.type != "clone" && !createOnff ){
            //         e.target.style.display = "none";
            //         e.target.style.display = "absolute";
            //     }
    
            // });    

        // }

    }
    // 处理右侧内容的点击事件
    handleExtra() {
        let {extra , handleExtra} = this.props
        extra ? handleExtra() : ''
    }
    render () {
        let { placeholder = '请输入金额', extra = '', isEdit = true, value } = this.props
        console.log(extra)
        return (
           <div className="box" ref={ el => this.boxRef = el }>
                <List>
                    <InputItem
                        ref={ el => this.inputRef = el }
                        className="input-money"
                        type={'money'}
                        labelNumber={1}
                        moneyKeyboardAlign={'left'}
                        placeholder={placeholder}
                        value={value}
                        editable={isEdit}
                        onBlur={()=>{ this.inputFocus = false }}
                        onFocus={()=>{ this.inputFocus = true }}
                        onChange={(val) => this.change(val)}
                        clear
                        extra={extra}
                        onExtraClick={() => this.handleExtra()}
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                    >¥</InputItem>
                </List>
           </div>
       )
   }
}
export default createForm()(DealInput);