import { StoreExtends } from 'Common/Plugins/store.extends'
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'
import { Native } from "Common/utils/appBridge"
import PgopenSuccess from "../PgOpenSuccess/store"

export class PgCallbackNative extends StoreExtends {
    detailsPage = () => {
        Native.closeWebView()
    }

    openSuccess = () => {
        PgopenSuccess.goNext()
    }
}

export default new PgCallbackNative()