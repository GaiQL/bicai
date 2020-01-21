import {fetch} from '../bank'
import {ApiCom} from './bank.api.com'
export class ApiBankV1 extends ApiCom{
    apiOrgHotLineAndServerTime = (params?) => {
        return fetch.post('/openapi/comm/v2/apiOrgHotLineAndServerTime', params)
    }
}
