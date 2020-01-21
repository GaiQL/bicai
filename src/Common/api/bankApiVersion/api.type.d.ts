import {BIZ_TYPE} from "Common/config/params.enum";

interface IapiSendPhoneCode {
    bankCardPhone:string,
    bizType:string | number
    status: '0' | '1'
    reqSerial:string
}
export type apiSendPhoneCodeParams = IapiSendPhoneCode
