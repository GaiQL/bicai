/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-02 16:57:07
 * @LastEditTime: 2019-08-19 10:56:36
 * @LastEditors: Please set LastEditors
 */
// 静态值定义： 【应用配置】
import { session } from "Common/utils/store"
import { images } from './static'
// import {orgId, orgName} from './bank.sys'
let { orgId, orgName ,openTem} = require('../../web.config.json')
const { imgHost, hostOptions, envType, staticHost } = require('../../web.config.json')

let envKey = process.env.apiENV || session.get('env')
const API_HOST = envKey ? hostOptions[envKey]
    : (
        process.env.NODE_ENV == 'development'
            ? hostOptions[envType.dev] : hostOptions[envType.pro]
    )
/**
 * 抛出改项目机构orgId
 */
export const ORG_ID = orgId
export const ORG_NAME = orgName


/**
 * 比财2.0 HOST 老版本银行 郑州，客商
 */
export const BICAI_HOST = API_HOST.bcHost

/**
 *  新的银行api接口
 */
export const BANK_HOST = API_HOST.bankHost
/**
 * 实名认证接口地址
 */
export const REAL_NAME_HOST = API_HOST.realNameHost

/**
 * 图片地址。区分生产环境和开发环境的图片地址
 */
export const imgSrc = API_HOST.imgSrcHost
    // imgHost.imgSrcHost_DEV : imgHost.imgSrcHost_PRO

export const imgSrcIcon = API_HOST.bankHost

/**
 * staticHost静态资源地址
 */
export const STATIC_HOST = staticHost
export const Images = images

/**
 * 项目前缀
 */
export const STORE_PREFIX = '' // 存储库的命名前缀。勿动！与其他站点进行交互时注意该处

/**
 *  外部参数默认设置
 */
export const PRO_PARAMS = {
    DEVICE_ID: 'H5' + Math.random().toString().substr(6),
    CHANNEL_ID: '1', //  默认渠道id
    APP_FLAG: 'BC'
}


export const ComParams = {
    eyeIsHide: 'eyeIsHide' + orgId
}

// 是否开启调试模式
export const tempApiOpen: 0 | 1 = openTem


export const h5openapibanks = BICAI_HOST + '/h5openapibanks'
export const BanksH5URL = {
    yiyeH5Url:BICAI_HOST + '/h5api',
    bankUrl:h5openapibanks,
    realNameUrl:h5openapibanks + '/000/realName.html#/openFirst',
    bcUpdateIDCardUrl:h5openapibanks + '/-3/#/updateIdCard',
    bcFaceDiscern:h5openapibanks + '/-3/#/faceDiscern',
    bcLoginUrl:h5openapibanks + '/000/#/bcLogin'
}



