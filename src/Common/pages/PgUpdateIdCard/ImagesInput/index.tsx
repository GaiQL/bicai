import {Native} from "Common/utils/appBridge"
import React from "react";
import './style.scss'
import {ActionSheet,Modal,Toast} from 'antd-mobile'

export default class ImagesInput extends React.Component<any, any> {
    state = {
        show: false,
        flag: Native.isApp() && Native.isAndroid
        // flag: true
    }
    // showChange=()=>{
    //     this.setState({
    //         show:!this.state.show
    //     })
    // }
    componentDidMount(): void {
    }

    camera = null
    showSelect = () => {
        this.setState({
            show: true
        })
    }
    hideHandle = () => {
        this.setState({
            show: false
        })
    }

    render(): React.ReactNode {
        let {onChange} = this.props
        let {show} = this.state
        return <>
            {
                this.state.flag ? <>
                        <input
                            type="file"
                            accept='image/*'
                            onClick={(e) => {
                                this.showSelect()
                                e.preventDefault()
                            }}
                        />

                    </>
                    : <input
                        type="file"
                        accept='image/*'
                        onChange={(e) => onChange(e)}
                    />
            }
            {
               ImageSelect(onChange, this.hideHandle,show)
            }
        </>
    }

}

export function ImageSelect(onChange, hideHandle,show) {
    return (
        <Modal
            popup
            visible={show}
            onClose={() => {
                hideHandle()
            }}
            animationType="slide-up"
        >
            <span className="bottomImage">
            <span className="img-select">
                <label htmlFor="imp-camera">拍照<input id="imp-camera" type="file" accept="image/*" hidden
                                                     onChange={(e) => {
                                                         Toast.loading('加载中',1)
                                                         hideHandle()
                                                         onChange(e)
                                                     }}/></label>
            </span>
                <span className="img-select">
                <label htmlFor="imp-al">相册<input id="imp-al" type="file" accept="image/bmp" hidden onChange={(e) => {
                    hideHandle()
                    onChange(e)
                }}/></label>
            </span>
            <span className="img-select-cancel" onClick={()=>{hideHandle()}}>
                取消
            </span>

            </span>
            {/*<span className="bottomImageBg" onClick={() => {*/}
                {/*hideHandle()*/}
            {/*}}/>*/}
        </Modal>
    )
}
