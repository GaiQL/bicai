import {PgChangeBank} from 'Common/pages/PgChangeBank/store'
import {observable} from "mobx";

export type bankType = 'changeBank' | 'addBank'

class ChangeBank extends PgChangeBank {
    @observable bankHandleType: bankType = 'changeBank'
}

export default new ChangeBank()
