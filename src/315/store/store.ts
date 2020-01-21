import {observable} from 'mobx'

import ComStore from "Common/pages/store"

class store extends ComStore {
    @observable Hash = null

}

export default new store()
