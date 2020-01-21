import React, { Component } from 'react';
import { InputItem } from 'antd-mobile';

const cls = 'trust-mobile-input';


class MobileInputItem extends Component<any, any> {
    renderState(mold) {
        const { onErrorClick = '', tipStyle = {}, bankstatus } = this.props;
        // console.log(bankstatus,'bankstatus')
        const errorTipStyle = {
            color: '#F4333C',
            padding: '3px 0px 8px',
            textAlign: 'left',
            position: 'relative',
            fontSize: 10,
            lineHeight: "16px",
            ...tipStyle
        }
        if (mold === 'phone') {
            return (
                <div className="am-list-item" style={{ height: 'auto', minHeight: 0 }}>
                    <div className="am-input-control">
                        <div style={{ ...errorTipStyle }}>
                            {onErrorClick}
                        </div>
                    </div>
                </div>
            )
        } else {
            if (bankstatus.show) {
                if (bankstatus.flag) {
                    return (
                        <div className="successtit" style={{ height: 'auto', minHeight: 0 }}>
                            <p className='successtit-logo'><img src={bankstatus.logo} alt="" /></p>
                            <p className='successtit-tit'>
                                <span>
                                    {bankstatus.value}
                                </span>
                                <span>
                                    {bankstatus.value1}
                                </span>
                                <span>{ bankstatus.value1 && bankstatus.value2 ? '，':'' }</span>
                                <span>
                                    {bankstatus.value2}
                                </span>
                            </p>
                        </div>
                    )
                } else {
                    return (
                        <div className="am-list-item" style={{ height: 'auto', minHeight: 0 }}>
                            <div className="am-input-control">
                                <div style={{ ...errorTipStyle }}>
                                    {bankstatus.errTip}
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        }
    }
    render() {
        const { type = 'text', mold = '', error = false, ...other } = this.props;
        // {console.log(this.props, 'MobileInput')}
        return (
            <div className={cls}>
                <InputItem type={type} {...other} error={false}></InputItem>
                {
                    error && this.renderState(mold)
                }
            </div>
        )
    }
}

export default MobileInputItem;
