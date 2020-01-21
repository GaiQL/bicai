/**
 * 人脸识别。
 */
import React from 'react'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { Headers } from 'Common/publicCommon'
import apiRealName from "Common/api/realname"
import { Images } from "Common/config/index";
import { Toast } from 'antd-mobile'
import "./index.scss"
import { session } from "Common/utils/store";
import { commonStore } from "Common/pages/store"
import { faceRecognitionPage, faceRecognitionStartBtn } from 'Common/Plugins/recordLogInfo'
var u = navigator.userAgent;
export const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
// import {Native} from "Common/";

const { openAlert } = commonStore
const initState = {
    userName: '',
    identNo: '',
    btnText: '开始录制'
}
export interface IConfig {
    updateVersion: 'v1' | 'v2',
    isBottomShow: boolean,
}
type State = Readonly<typeof initState>


export default class FaceDiscern extends React.Component<any, State> {
    readonly state = initState;
    inputEle: any = null;

    Config: IConfig = {
        isBottomShow: true,
        updateVersion: 'v1'
    }
    async componentWillMount() {
        faceRecognitionPage()
       await apiRealName.BcSuccessIdcard({ isShowIdPhoto: false }).then(data => {
            let newData: any = data
            console.log(newData, "返回的数据")
            session.set('faceInfo', newData)
            this.setState({
                userName: newData.idName,
                identNo: newData.idNumber
            })
        },err=>{
            console.log(err,"err")
        })
    }
    /**
     * 上传身份证 v1版
     **/
    upLoadVideo_v1 = (file, { userName, identNo }) => {
        let file1 = file.files[0]
        let reader: any = new FileReader();
        reader.readAsDataURL(file1);//调用自带方法进行转换
        let _this = this
        reader.onload = async function (e) {
            let img: any = this.result;
            let imgNum = img.split(";base64,");
            let imgBase = imgNum[1];
            try {
                let { fileID }: any = await apiRealName.fileUploadVideo({
                    transcoding: '1',
                    uploadImageFile: encodeURIComponent(imgBase)
                })
                _this.photoContrastFn({
                    fileID,
                    userName,
                    identNo,
                    // orgId: ''
                })
            } catch (e) {
                _this.upLoadVideoFailed(e)
            }
        }
    }
    /**
     * 上传身份证
     **/
    upLoadVideo = (file, { userName, identNo }) => {
        this.upLoadVideo_v1(file, { userName, identNo })
    }
    /**
     * 视频上传成功后操作：身份信息比对
     */
    photoContrastFn = async (params: {
        fileID: string,
        userName: string,
        identNo: string
        orgId?: number | string
    }) => {
        try {
            let res: any = await apiRealName.photoContrast(params)
            this.checkContrast(res)
            this.testFn()
        } catch (e) {
            this.checkContrastFailed(e)
            this.testFn2()
        }
    }
    // 视频上传失败后操作
    upLoadVideoFailed = (e) => {
        let { userName, identNo } = this.state
        if (e.code == '10700') {
            openAlert('提示', e.msg, [
                {
                    text: '重新上传', onPress: () => {
                        this.upLoadVideo(this.inputEle, { userName, identNo })
                    }
                }
            ])
        }
        console.warn('视频上传识别失败后操作，建议重写：' + e)
    }
    // 信息比对具体业务逻辑
    checkContrast = (res) => {
        // console.log(res, "0000")
        // 可重写改方法。成功逻辑 和 失败逻辑
        // 验证状态 10=未知 20=识别验证匹配30=验证不匹配
        // txSN 交易流水号
        // traceNo CFCA交易跟踪号
        let { verification, image } = res
        //存储活体base64厦门国家更换绑定卡验证验证码的时候要用
        session.set('faceDiscernImg', image)
        if (verification == 30) {
            session.set('checkContrastSuccess', false) //
            Toast.info('活体检测失败,请重新录制后上传', 2)
        } else if (verification == 20) {
            // Toast.info('识别验证成功', 1)
            session.set('checkContrastSuccess', true) //
            this.checkContrastSuccess()
        } else {
            session.set('checkContrastSuccess', false) //
            Toast.info('未知', 1)
        }
    }
    // 识别验证成功
    checkContrastSuccess = () => {
        console.log('识别验证成功的操作，重写');
    }
    // 识别验证 不匹配 / 未知 / 接口请求失败
    checkContrastFailed = (e?) => {
        console.warn('视频上传识别失败后操作，建议重写：' + e)
        if (e) {
            // 这种情况就是接口 请求失败逻辑
        }
    }
    canvas1 = null
    images = null
    video = null
    testFn = () => {
    }
    testFn2 = () => {
    }
    public render(): React.ReactNode {
        let { userName, identNo, btnText } = this.state
        console.log(userName, identNo,"======")
        return <div className="bc-face">
            <Headers>人脸识别</Headers>
            <div className="top">
                <img src={require('Common/assets/images/headers@2x.png')} alt="" onClick={() => {
                    return false
                }} />
            </div>
            <div className="faceBar">
                <p onClick={this.testFn}>请按图示将人脸放入取景框中</p>
            </div>
            <div className="faceContent">
                <p>*请使用<span>前置摄像头</span></p>
                <p onClick={this.testFn2}>*点击<span>相机录制按钮开始</span>录制</p>
                <p>*录制视频<span>时长{isAndroid ? "3-4秒" : "4-5秒"}</span></p>
                <p>*录制结束后<span>{isAndroid ?"请点击√或完成按钮上传":"请点击使用视频按钮上传"}</span></p>
            </div>
            <div className="faceConentLook" onClick={() => {
                this.props.history.push(`/transcribe?userName=${userName}&identNo=${identNo}`)
            }}>
                录制演示
            </div>
            <label htmlFor="inputVideo1" className="labelVideo">{btnText}</label>
            <input ref={ele => this.inputEle = ele} id="inputVideo1" type="file" accept="video/*" capture="camera" onChange={(e) => {
                this.upLoadVideo(e.target, { userName, identNo })
            }} onClick={() => {
                /* 打点————人脸识别开始录制 */
                try {
                    faceRecognitionStartBtn()
                } catch (err) { }
            }} />
            <canvas ref={ref => {
                this.canvas1 = ref
                let canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 130;
                canvas.height = 150
            }} id="canvas" className="canvas" />
            {this.Config.isBottomShow ? <BottomColumn type="long" /> : null}
        </div>
    }
}
