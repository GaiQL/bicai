import { Button } from 'antd-mobile';
import React from 'react'
import './style.scss'

interface disProps {
    isDisabled?: any | Boolean,
    onClick?: Function,
    className?: String,
    wrapperClassName?:String,
    textColor?:string,
    primary?:any
}
// 节流函数
function throttle(func, wait) {
    let previous = 0;
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}
export default class BcButton extends React.Component<disProps, any>{
    componentDidMount(){
        let res = this.btn.innerHTML.replace(/\s/g,'')
        this.btn.innerHTML = res
    }

    btn = null
    render() {
        let { isDisabled, onClick, textColor = '#fff',primary ='ghost'} = this.props
        return <div className={`btn-box ${this.props.wrapperClassName}`}>
            <Button
                type={primary}
                style={{ color:textColor }}
                disabled={isDisabled && isDisabled}
                className={`btn ${this.props.className} `}
                onClick={throttle(onClick,2000)}
            ><span ref={(v)=>this.btn = v}>{this.props.children}</span></Button>
        </div>
    }
}
