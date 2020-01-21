import {Toast} from 'antd-mobile';
import {commonStore} from 'Common/pages/store'
import {POP_TYPE,INNER_CODE} from 'Common/config/params.enum'

//
// let {headers,loadingText = '加载中···',hideToast='show'} = options

interface optionsType {
    headers?: Object,
    loadingText?: string,
    hideToast?: 'show' | 'hide', // 隐藏total
    hideAlert?: 'show' | 'hide', // 隐藏10000公共弹窗
    toastAutomaticHide?: boolean, //
}

class HttpBasic {
    constructor(config) {
        this.baseUrl = config.baseUrl
        this.headers = config.headers
        this.queue = {}
        if (config.interceptors && typeof config.interceptors.response === 'function') {
            this.interceptorsResponse = config.interceptors.response
        }
        if (config.interceptors && typeof config.interceptors.request === 'function') {
            this.interceptorsRequest = config.interceptors.request
        }
    }

    private baseUrl // 请求host
    private queue // 请求host
    private interceptorsResponse(response) {
        return new Promise((resolve, reject) => {
            resolve(response)
        })
    } // 相应拦截器
    private interceptorsRequest(body) {
        return body
    } // 请求拦截器
    /**
     * 判断请求头
     */
    private async compilerHeader(contentType: string, res: any) {
        // console.log(res.json());
        if (contentType && contentType.indexOf('json') > -1) {
            return await res.json()
        }
        if (contentType && contentType.indexOf('text') > -1) {
            return await res.text()
        }
        if (contentType && contentType.indexOf('form') > -1) {
            return await res.formData()
        }
        if (contentType && contentType.indexOf('video') > -1) {
            return await res.blob()
        }
        return await res.text() // contentType为null是可能出现不确定的情况。可以返回text文本，然后在拦截器单独处理。
    }

    private headers // 请求头
    private options = {
        beforEach() {
            // console.log('请求前')
            Toast.loading('loading', 0)
        },
        afterEach() {
            // console.log('请求后')
            Toast.hide()
        },
        catchEach(e) {
            // console.log('请求错误')
            Toast.hide()
        },
    }
    /**
     * 请求超时设置
     */
    timeout = 30000;

    private formtGetHttp(obj) {

        let getHttp = []
        for (let key in obj) {
            getHttp.push(
                key + "=" + (typeof obj[key] == 'object' ? JSON.stringify(obj[key]) : obj[key])
            )
        }
        return getHttp.join('&')
    }

    private commonFetch(url: string, body?: any, headers?: any, method = 'GET') {
        let initParams = {}
        if (method == 'GET') {
            url = url + "?" + this.formtGetHttp(body),
                initParams = {
                    method,
                }
        } else {
            initParams = {
                method,
                headers,
                body,
                // mode:'no-cors'
            }
        }
        return fetch(this.baseUrl + url, initParams).then((res) => {
            let contentType = res.headers.get('Content-Type')
            if (res.status >= 200 && res.status < 300) {
                return this.compilerHeader(contentType, res)
            }
            console.log(res);
            const error = new Error(res.statusText);
            throw error;
        })
    }


    /**
     * post
     * @param url
     * @param body
     * @param options
     */
    async post(url: string, body?: { [key: string]: any } | string, options?: optionsType) {
        let {headers = {}, loadingText = '加载中···', hideToast = 'show', hideAlert = 'show', toastAutomaticHide = false}: optionsType = options || {}
        const {openAlert, alertTitle} = commonStore
        headers = {...this.headers, ...headers}
        // if (Object.keys(this.queue).length === 0) {
        //     Toast.loading(loadingText, 0)
        // }
        this.queue[url] = url;
        try {
            let res = await this.commonFetch(url, this.interceptorsRequest(body), headers, 'POST')
            return new Promise((resolve, reject) => {
                this.interceptorsResponse(res).then((result) => {
                    resolve(result)
                }, err => {
                    reject(err)
                })
            })
        } catch (e) {
            return Promise.reject(e)
        }
    }

}

export default HttpBasic
