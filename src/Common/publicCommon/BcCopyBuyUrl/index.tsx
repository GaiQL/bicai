import React from 'react';
import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile'
import { session } from "Common/utils/store";
import './style.scss'
import { buySuccessShare } from 'Common/Plugins/recordLogInfo'

/**
 * 存入成功结果页
 * session.get("HOME_URL")为真的话，就显示这个组件
 */
class CopyBuyUrl extends React.Component<any,any> {
    handelCopy() {
        copy(window.sessionStorage.getItem('HOME_URL'));
        Toast.info('已复制，请在浏览器打开', 1)
        try {
            setTimeout(async () => {
                await buySuccessShare()
            }, 1000)
        } catch (e) {

        }

    }
    render () {
        return (
            window.sessionStorage.getItem('HOME_URL') ? <div className="copy-box">
                <p className="copy-text">为方便资金管理，点击复制链接保存页面地址</p>
                <p className={'buySuccess-copy'} onClick={this.handelCopy.bind(this)}
                >
                    <span>复制链接</span>
                </p>
            </div> : null
        )
    }
}
export default CopyBuyUrl