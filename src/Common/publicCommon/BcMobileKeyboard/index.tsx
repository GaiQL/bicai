
import React from 'react'
import './style.scss'
import { Modal  } from 'antd-mobile';
import IconSvg from './IconSvg'
const numLen = [1, 2, 3, 4, 5, 6, 7, 8, 9]
import TouchFeedback from 'rmc-feedback';

export default class BcMobileKeyboard extends React.Component<any, any>{
    constructor(props) {
        super(props)
    }
    // 获取当前点击的数字，调用父亲的方法传递过去
    getCurNum = (num) => {
        this.props.getNumber(num)
    }
    // 删除当前的数字
    delNum = () => {
        this.props.delNumber()
    }
    // 点击完成的触发
    complete = () => {
        this.props.complate()
    }
    render () {
        const { className, visible = true, maskClosable = false, animationType = 'slide-up', popup = true } = this.props
        return (
            <Modal
                className={`key-board-box ${className}`}
                popup={popup}
                maskClosable={maskClosable}
                visible={visible}
                animationType={animationType}
            >
                <div className='board-top'>
                    <button onClick={this.complete.bind(this)}>完成</button>
                </div>
                <ul className="board-num">
                    {
                        numLen.map((item, index) => {
                            return (
                                <TouchFeedback activeClassName='active' key={'item' + index}>
                                    <li onClick={this.getCurNum.bind(this, item)} key={index}>{item}</li>
                                </TouchFeedback>
                            )
                            
                        })
                    }
                    {/* 这个li单纯为了布局，让它占住位置 */}
                    <li style={{visibility: 'hidden'}}></li>
                    <TouchFeedback activeClassName='active'>
                        <li className="zero" onClick={this.getCurNum.bind(this, 0)}>0</li>
                    </TouchFeedback>
                    {/* 删除的icon， 如果复制需要替换这个成你们自己的icon */}
                    <li><i onClick={this.delNum.bind(this)}><IconSvg color="#3F434A;" /></i></li>
                </ul>
            </Modal>
        )
    }
}
