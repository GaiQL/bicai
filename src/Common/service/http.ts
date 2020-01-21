import {Toast} from 'antd-mobile';
import {commonStore} from 'Common/pages/store'
import {POP_TYPE, INNER_CODE} from 'Common/config/params.enum'

//
// let {headers,loadingText = '加载中···',hideToast='show'} = options

interface optionsType {
    headers?: Object,
    loadingText?: string,
    hideLoding?: 'show' | 'hide', // 隐藏loding
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

    throwErr(code, msg) {
        if (code >= 400 && code < 500) {
            return (msg || '请求错误') + ` (${code})`
        }
        if (code >= 500 && code < 600) {
            return (msg || '服务器错误') + ` (${code})`
        }
        return 'network err' + ` (${code})`
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
            const error = this.throwErr(res.status, res.statusText);
            return Promise.reject(error)
        })
    }


    /**
     * post
     * @param url
     * @param body
     * @param options
     */
    async post(url: string, body?: { [key: string]: any } | string, options?: optionsType) {
        let {headers = {}, loadingText = '加载中···', hideToast = 'show', hideAlert = 'show', toastAutomaticHide = false, hideLoding = 'show'}: optionsType = options || {}
        const {openAlert, alertTitle} = commonStore
        headers = {...this.headers, ...headers}
        if (Object.keys(this.queue).length === 0) {
            hideLoding == 'show' ? Toast.loading(loadingText, 0) : null
        }
        hideLoding == 'show' ? (this.queue[url] = url) : null;
        try {
            let res = await this.commonFetch(url, this.interceptorsRequest(body), headers, 'POST')
            return new Promise((resolve, reject) => {
                this.interceptorsResponse(res).then((result) => {
                    delete this.queue[url] // 每次请求成功后 都删除队列里的路径
                    if (Object.keys(this.queue).length === 0 && !toastAutomaticHide) {
                        Toast.hide()
                    }
                    resolve(result)
                }, err => {
                    delete this.queue[url] // 每次请求成功后 都删除队列里的路径
                    if (Object.keys(this.queue).length === 0 && !toastAutomaticHide) {
                        Toast.hide()
                    }
                    if (!err) return reject('系统异常')
                    if (err.popType == POP_TYPE.Toast) {
                        // toast
                        hideToast == 'show' ? Toast.info(err.popMsg) : null
                    } else if (err.popType == POP_TYPE.Tip) {
                        // catch单独处理
                    } else if (err.popType == POP_TYPE.Alert) {
                        // 白色弹窗，具体样式交互已码表为准
                        if (err.innerCode == INNER_CODE.SubmitOnly && hideAlert === 'show') {
                            // INNER_CODE.SubmitOnly 100000 固定白色弹窗 只有标题不一样
                            openAlert(err.popTitle || alertTitle, err.popMsg, [
                                {text: '确定', onPress: () => console.log('确定')}
                            ])
                        }
                        // 白色弹窗，具体样式交互已码表为准
                        if (err.innerCode == INNER_CODE.CancelAndCallPhone && hideAlert === 'show') {
                            // INNER_CODE.SubmitOnly 100000 固定白色弹窗 只有标题不一样
                            openAlert(err.popTitle || alertTitle, err.popMsg, [
                                {text: err.popBtn || '取消', onPress: () => console.log('取消'), style: {color: "#999999"}},
                                {
                                    text: err.popBtn1 || '立即拨打', onPress: () => {
                                        window.location.href = `tel:${err.bankPhoneNum}`
                                    }
                                }
                            ])
                        }
                        // 其他情况：样式，交互均有问题 catch单独处理

                    } else {
                        Toast.info(err.popMsg || err)
                    }
                    reject(err)
                })
            })
        } catch (e) {
            delete this.queue[url] // 每次请求成功后 都删除队列里的路径
            if (Object.keys(this.queue).length === 0 && !toastAutomaticHide) {
                Toast.hide()
            }
            let msg = e ? ((typeof e == 'string') ? e : ((JSON.stringify(e) != '{}') ? JSON.stringify(e) : 'fetch error')) : 'fetch error'
            setTimeout(() => {
                Toast.info(msg)
            }, 200)
            return Promise.reject(e)
        }
    }

}

export default HttpBasic
