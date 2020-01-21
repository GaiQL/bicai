import Http from "../service/http";
import { session } from 'Common/utils/store'
import { REAL_NAME_HOST, ORG_ID } from '../config'
import { Native } from "Common/utils/appBridge"
import {API_CODE} from 'Common/config/params.enum'
const ENVIRONMENT = process.env.NODE_ENV

export const fetch = new Http({
    baseUrl: REAL_NAME_HOST,
    headers: { 'Content-Type': 'application/json' },
    interceptors: {
        /**
         * --请求拦截器--请求参数组装
         * @param body
         */
        request(body: Object) {
            let AdapterData = (params: any) => {
                let orgId = session.get('orgId') ||  ORG_ID || ''  // 暂时写死
                let channelId = session.get('channelId') || `${ENVIRONMENT == 'development' ? 1 : ''}`  // 渠道id 外部传人 h5默认传1
                let deviceId = session.get('deviceId') || 'h5' // 设备id 外部传人
                let token = session.get('_MX_BICAI_TOKEN') || '' // 登录获取。或者小程序sessionStorage传人
                let userChannel = session.get('userChannel') || '' // 登录时获得。或者小程序sessionStorage传人
                let appFlag = session.get('appFlag') || 'BC' // 登录时获得。或者小程序sessionStorage传人
                let systemType = session.get('systemType') || 'h5' // 系统
                let version = session.get('version') || '' //
                let clientId = session.get('clientId') || '30' //
                let channel = session.get('channel') || '' // 不知道是啥
                let channelType = session.get('channelType') || '2' // h5 默认2
                let deviceName = session.get('deviceName') || '' // 不知道是啥 h5 为空
                let tempApiOpen = 0 // 调试模式 0：不开启 1：开启

                // channelId  渠道id 外部传人
                // deviceId  设备id 外部传人
                // token  登录获取。或者小程序sessionStorage传人
                // userChannel  登录时获得。或者小程序sessionStorage传人
                // appFlag  登录时获得。或者小程序sessionStorage传人

                let data = {
                    head: {
                        userChannel,
                        appFlag,
                        channel,
                        channelId,
                        clientId,
                        deviceId,
                        deviceName,
                        orgId,
                        systemType,
                        token,
                        version,
                        channelType,
                        tempApiOpen
                    },
                    param: {
                        orgId: orgId,
                        ...params
                    }
                }
                return JSON.stringify(data)
            }
            return AdapterData(body)
        },
        /**
         * 响应拦截器 返回Promise
         * @param response
         */
        response(response) {
            return new Promise((resolve, reject) => {
                 response.code = response.code + '' 
                if (response.code === API_CODE.Success) {
                    resolve(response.data)
                } else if (response.code === API_CODE.Failed) {
                    if (response.result && JSON.stringify(response.result) != '{}'&& response.result.innerCode) {
                        reject(response.result)
                    } else {
                        reject(response.msg)
                    }
                } else if (response.code === API_CODE.LoginRemote || response.code === API_CODE.LoginTimeOut) {
                    // 登录超时或者被顶
                    Native.clearToken() // ios清除token
                    Native.goAppLogin()
                    reject(response.msg)
                } else {
                    if (response.result && JSON.stringify(response.result) != '{}'&& response.result.innerCode) {
                        reject(response.result)
                    } else {
                        reject(response.msg)
                    }
                }
            })
        }
    }

})


export class ApiBank {
    Fetch = fetch
    /**
     *  openapi/auth/v2.0/detection/fileUpload 活体检测
     */
    fileUpload = (params?) => {
        return fetch.post('/openapi/auth/v2.0/detection/fileUpload', params)
    }
    /**
     *  openapi/auth/v2.0/detection/fileUpload 活体检测 上传视频
     */
    fileUploadVideo = (params?) => {
        return fetch.post('/openapi/auth/v2.0/detection/fileUpload', params,{loadingText:'影像上传请等待3-5秒',toastAutomaticHide:true})
    }

    /**
     *  openapi/auth/v2.0/detection/photoContrast 活体检测
     */
    photoContrast = (params?) => {
        return fetch.post('/openapi/auth/v2.0/detection/photoContrast', params, {loadingText:'正在进行活体验证，请等待3-5秒',toastAutomaticHide:true})
    }

    /**
     *  身份证OCR
     */
    idcardOcr = (params?) => {
        return fetch.post('/openapi/auth/v2.0/idCard/ocr', params)
    }
    /**
     *  更新身份证
     */
    bcUpdateIdCard = (params?) => {
        return fetch.post('/openapi/auth/v2.0/idCard/update', params)
    }
    /**
     * 检测需不需要活体
     */
    bcDetectionFace = (params?) => {
        return fetch.post('/openapi/auth/v2.0/detection/check', params)
    }
    /**
     * 查询认证信息
     */
    bcAuthInfoInquire = (params?) => {
        return fetch.post('/openapi/auth/v2.0/user/authInfo', params)
    }
    /**
     * 查询已认证身份信息
     */
    BcSuccessIdcard = (params?) => {
        return fetch.post('/openapi/auth/v2.0/user/successIdcard', params)
    }
      /**
     * 活体新接口
     */
    livingCheck = (params?) => {
        return fetch.post('/openapi/auth/v2.0/detection/livingCheck', params)
    }
}

export default new ApiBank()
