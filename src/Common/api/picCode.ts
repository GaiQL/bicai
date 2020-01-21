import Http from "../service/http";
import {BICAI_HOST} from '../config'
const fetch = new Http({
    baseUrl: BICAI_HOST + '/finsuit',
    interceptors:{
        /**
         * 响应拦截器 返回Promise
         * @param response
         */
        response(response) {
            return new Promise((resolve, reject) => {
                resolve(JSON.parse(response))
            })
        }
    }

})





export const getImgCode = () => {
    return fetch.post('/finsuitSafeCode/outer');
};












