/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-30 16:56:59
 * @LastEditTime: 2019-08-22 10:31:27
 * @LastEditors: Please set LastEditors
 */
import Http from "../service/http";
import {session} from "Common/utils/store"
import {Toast} from "antd-mobile";
import {BICAI_HOST} from '../config'
import {Native} from "Common/utils/appBridge"
const ENVIRONMENT = process.env.NODE_ENV

const fetch = new Http({
    baseUrl: BICAI_HOST + '/finsuit',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    interceptors:{
        /**
         * --请求拦截器--请求参数组装
         * @param body
         * @constructor
         */
        request(body:any) {
            /**
             *
             * @param type 请求接口的标示
             * @param params 具体参数
             * @param needToken 是否需要token
             * @returns {string}
             * @constructor
             */
            let AdapterData = ({type, params, needToken = true}) => {
                let channelId =session.get('channelId') || `${ENVIRONMENT == 'development' ? 1 : ''}`  // 渠道id 外部传人
                let deviceId = session.get('deviceId') || 'H5121212131' // 设备id 外部传人
                let token = session.get('_MX_BICAI_TOKEN') || '' // 登录获取。或者小程序sessionStorage传人
                let userChannel = session.get('userChannel') || '' // 登录时获得。或者小程序sessionStorage传人
                let appFlag = session.get('appFlag') || 'BC' // 登录时获得。或者小程序sessionStorage传人
                let sessionId = session.get('sessionId') || ''
                let systemType = Native.getSystemType() // ios清除token // 系统
                let data = {
                    head: {
                        TYPE: type,
                        TOKEN: needToken ? token : '', // 登录不需要token
                        SESSION_ID: sessionId,
                        DEVICE_ID: deviceId,
                        CHANNEL: '',
                        SCREEN_SIZE: '',
                        SYSTEM_TYPE: systemType,
                        CHANNEL_ID: channelId,
                        APP_FLAG: appFlag,
                        USER_CHANNEL: userChannel, // 新增 USER_CHANNEL
                    },
                    param: {
                        ...params
                    },
                }
                return 'param_key=' + JSON.stringify(data)
            }
            return AdapterData(body)
        },
        /**
         * 响应拦截器 返回Promise
         * @param response
         */
        response(response) {
            response = JSON.parse(response)
            return new Promise((resolve, reject) => {
                if (response.head.CODE == 0) {
                    resolve(response.data)
                } else {
                    Toast.info(response.head.MSG)
                    reject(response.head.MSG)
                }
            })

        }
    }
})





export class ApiBicai {
    /**
     * mock测试
     * @param params
     * @returns {axios执行后返回的是一个promise}
     */
    mock = (params) => {
        let options = {
            type: 'test',
            needToken: false,
            params
        }
        return fetch.post('/finsuitPhone/deal',options);
    };
     /**
     * 登录
     * @param params
     * @returns {axios执行后返回的是一个promise}
     */
    apiBicaiLogin = (params) => {
        let options = {
            type: 'LOGIN',
            needToken: false,
            params
        }
        return fetch.post('/finsuitPhone/deal',options);
    };

/**
     * 比财登录获取验证码
     * @param params
     * @returns {axios执行后返回的是一个promise}
     */
    getLoginTelCode = (params) => {
        let options = {
            type: 'REQ_NO_VALIDATE',
            needToken: false,
            params
            }
            return fetch.post('/finsuitPhone/deal',options);
        };

        getProListByChannel = (params) => {
        let options = {
            type: 'GENERALIZE_INFO_H5',
            needToken: false,
                params
            }
            return fetch.post( '/finsuitPhone/deal', options);
        };
    getAuthStatus = (params) => {
        let options = {
            type: 'GET_AUTH_STATUS',
            needToken: false,
            params
        }
        return fetch.post( '/finsuitPhone/deal', options);
    };


/**
     * 获取产品详情
     * @param params
     * @returns {axios执行后返回的是一个promise}
     */
    getPrdInfo = (params) => {
        let options = {
            type: 'GET_PRD_INFO',
            params
        }
        return fetch.post( '/finsuitPhone/deal', options);

    };


    /**
     * 获取微信初始状态
     * @param params
     */
    getWXinit = (params) => {
        let options = {
            type: 'GET_WEIXIN_SIGN',
            params
        }
        return fetch.post( '/finsuitPhone/deal', options);
    };


        /**
     * 获取banner
     * @param params
     */
    getBanner = (params) => {
        let options = {
            type: 'REQ_GET_SUCCES_BUY_ADV_LIST',
            params
        }
        return fetch.post( '/finsuitPhone/deal', options);
    };


    /**
     * 获取banner链接
     广告类型为1时
    * @param params
    */
    getBannerLink = (params) => {
        let options = {
            type: 'GET_RESOLVED_URL_INFO',
            params
        }
        return fetch.post( '/finsuitPhone/deal', options);
    };

}

export default new ApiBicai()
