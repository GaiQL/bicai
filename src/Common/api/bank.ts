/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 17:49:59
 * @LastEditTime: 2019-09-02 14:23:40
 * @LastEditors: Please set LastEditors
 */
import { ApiBankV1 } from './bankApiVersion/bank.api.v1'
import { ApiBankV2 } from './bankApiVersion/bank.api.v2'
import Http from "../service/http";
import { session } from 'Common/utils/store'
import { BANK_HOST, ORG_ID, tempApiOpen } from '../config'
import { Native } from "Common/utils/appBridge"
import {API_CODE} from 'Common/config/params.enum'
const ENVIRONMENT = process.env.NODE_ENV
export let fetch = new Http({
    baseUrl: BANK_HOST,
    // baseUrl:'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' },
    interceptors: {
        /**
         * --请求拦截器--请求参数组装
         * @param body
         */
        request(body: Object) {
            let AdapterData = (params: any) => {
                let appFlag = session.get('appFlag') || 'BC' // 登录时获得。或者小程序sessionStorage传人
                let channelId = session.get('channelId') || `${ENVIRONMENT == 'development' ? 1 : ''}`  // 开发环境下传1，生产环境不传
                let channel = session.get('channel') || '' // 不知道是啥
                let userChannel = session.get('userChannel') || '' // 登录时获得。或者小程序sessionStorage传人
                let clientId = session.get('clientId') || '30' //
                let deviceId = session.get('deviceId') || 'h5' // 设备id 外部传人
                let deviceName = session.get('deviceName') || '' // 不知道是啥 h5 为空
                let orgId = session.get('orgId') || ORG_ID  // 暂时写死
                let systemType = session.get('systemType') || 'h5' // 系统
                let token = session.get('_MX_BICAI_TOKEN') || '' // 登录获取。或者小程序sessionStorage传人
                let version = session.get('version') || '' //
                let channelType = session.get('channelType') || '2' // h5 默认2
                let openTem = session.get('openTem') || tempApiOpen
                let imitateParams = session.get('imitateParams') || {}
                // channelId  渠道id 外部传人
                // deviceId  设备id 外部传人
                // token  登录获取。或者小程序sessionStorage传人
                // userChannel  登录时获得。或者小程序sessionStorage传人
                // appFlag  登录时获得。或者小程序sessionStorage传人
                orgId = orgId + ''
                let data = {
                    head: {
                        userChannel,
                        appFlag,
                        channel,
                        channelId,
                        clientId,
                        deviceId,
                        deviceName,
                        orgId:orgId ,
                        systemType,
                        token,
                        version,
                        channelType,
                        tempApiOpen: openTem || 0 // 是否开启调试模式 0为不开启，1为开启
                    },
                    param: {
                        orgId: orgId,
                        ...imitateParams,
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
/**
 * api版本
 */
export declare type apiVersion = "v1" | "v2";

/**
 * api类 工厂函数暴露
 * @param version
 * @param extendsClass
 */
export function apiClassFactory(version: apiVersion) {
    if (version == 'v1') {
        return require('./bankApiVersion/bank.api.v1').ApiBankV1
    } else {
        return require('./bankApiVersion/bank.api.v2').ApiBankV2
    }
}

/**
 * api实例 工厂函数暴露
 * @param version
 * @param extendsClass
 */
export function apiFactory(version: apiVersion, extendsClass?) {
    if (version == 'v1') {
        return new ApiBankV1()
    }
    if (version == 'v2') {
        return new ApiBankV2()
    }
}


