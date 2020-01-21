/**
 * 人脸识别。
 */
import React from 'react'
import apiRealName from "Common/api/realname"
import {Toast} from 'antd-mobile'
import "./index.scss"
import {commonStore} from "Common/pages/store"
import {ORG_ID} from "Common/config/index";

const {openAlert} = commonStore
import {session} from 'Common/utils/store'
import BaseFace, {IConfig} from '../PgFaceDiscern'

export default class newFace extends BaseFace {
    Config: IConfig = {
        ...this.Config,
        updateVersion: 'v2'
    }
    /**
     * 上传身份证
     **/
    upLoadVideo = (file, {userName, identNo}) => {
        if (this.Config.updateVersion == 'v2') {
            this.upLoadVideo_v2(file, {userName, identNo})
        }
        if (this.Config.updateVersion == 'v1') {
            this.upLoadVideo_v1(file, {userName, identNo})
        }
    }
    /**
     * 上传身份证 v2版本
     **/
    upLoadVideo_v2 = (file, {userName, identNo}) => {
        let file1 = file.files[0]
        // console.log(file1.size / 1024 / 1024, "多少兆")
        //判断一下视频的大小
        if (file1.size / 1024 / 1024 >= 16) return Toast.info('人脸比对得分阈值过低', 2)
        let reader: any = new FileReader();
        reader.readAsDataURL(file1);//调用自带方法进行转换
        let _this = this
        reader.onload = async function (e) {
            let img: any = this.result;
            console.log(img.split(";base64,")[0], ">>>视频格式")
            console.log(file1, "文件")
            let imgNum = img.split(";base64,");
            let imgBase = imgNum[1];
            try {
                console.log(userName,identNo,"000000000")
                let res = await apiRealName.livingCheck({
                    uploadFile: encodeURIComponent(imgBase),//活体视频(BASE64Encoder编码，URLEncoder加密)
                    orgId: ORG_ID,//银行orgId
                    userName: userName,//用户姓名
                    identNo: identNo,//身份证号
                    fileName: file1.name//文件名称
                })
                _this.checkContrast(res)
            } catch (e) {
                if (e.code == '10700') {
                    openAlert('提示', e.msg, [
                        {
                            text: '重新上传', onPress: () => {
                                let {userName, identNo} = this.state
                                this.upLoadVideo(this.inputEle, {userName, identNo})
                            }
                        }
                    ])
                    return
                }
                _this.checkContrastFailed(e)
            }
        }
    }

}
