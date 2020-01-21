import { PgChangePhone } from 'Common/pages/PgChangePhone/store'
import {observable} from "mobx";


class ChangePhone extends PgChangePhone{
    @observable phoneType:'bankCardPhone'|'loginPhoneNum' = 'bankCardPhone' // 短信验证码发送类型

}
export default new ChangePhone()
