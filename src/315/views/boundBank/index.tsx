import PgBoundBank from "Common/pages/PgBoundBank"
import Store from './store'

class BoundBank extends PgBoundBank{
    Store = Store
    Config = {
        ...this.Config,
        bottomText: false
    }
}
export default BoundBank
