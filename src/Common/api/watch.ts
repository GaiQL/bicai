import Http from "../service/http.log";
import {session} from "Common/utils/store"
import {Toast} from "antd-mobile";
import {BICAI_HOST, ORG_ID} from '../config'
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
            let AdapterData = ({type, params}) => {
                let channelId = session.get('channelId') || `${ENVIRONMENT == 'development' ? 1 : ''}`  // 渠道id 外部传人 h5默认传1
                let deviceId = session.get('deviceId') || 'h5' // 设备id 外部传人
                let token = session.get('_MX_BICAI_TOKEN') || '' // 登录获取。或者小程序sessionStorage传人
                let appFlag = session.get('appFlag') || 'BC' // 登录时获得。或者小程序sessionStorage传人
                let systemType = session.get('systemType') || 'h5' // 系统
                let channelType = session.get('channelType') || '2' // h5 默认2
                let sessionId = session.get('sessionId') || ''
                let orgId = ORG_ID
                let data = {
                    head: {
                        TYPE: "BATCH_RECORD_FUNCTION_LOG_INFO",
                        TOKEN: token,
                        SESSION_ID: sessionId + '',
                        DEVICE_ID: deviceId + '',
                        CHANNEL_TYPE: channelType +'',
                        SYSTEM_TYPE: systemType + '',
                        CHANNEL_ID: channelId + '',
                        APP_FLAG: appFlag,
                    },
                    param: {
                        CHANNEL_ID: channelId + '',
                        FUNCTION_LOG_LIST:
                            [{
                                FUNCTION_ID: '', // 点位
                                REMARK_DATA: '', // 中文备注
                                CORP_CHANNEL_ID: channelId, // 渠道id
                                APP_PLACE: "99", // 日志位置
                                FROM_TYPE: '', // 日志分类
                                FROM_ID: orgId || '', // 产品ID、机构ID
                                FROM_PR1: '', //
                                FROM_PR2: '',
                                // MEMBER_ID: '',
                                // CREATE_TIME: '',
                                NETWORK_TYPE: '1', // 网络类型
                                SOURCE_ID: '', //
                                SOURCE_URL: '',
                                ITEM_VALUE: '',
                                FUNCTION_STATUS: '',
                                // FUNCTION_DATE: '',
                                ITEM_VALUE1: '',
                                ITEM_VALUE2: '',
                                ...params
                            }]
                    }
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
                    // Toast.info(response.head.MSG)
                    reject(response.head.MSG)
                }
            })

        }
    }
})

/**
 * 获取产品详情
 * @param params
 * @returns {axios执行后返回的是一个promise}
 */
export const watchApi = (params?) => {
    let options = {
        params
    }
    return fetch.post( '/finsuitPhone/deal', options);
};