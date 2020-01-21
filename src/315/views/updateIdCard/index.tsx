import PgUpdateIdCard from 'Common/pages/PgUpdateIdCard'
import Store from './store'

class UpdateIdCard extends PgUpdateIdCard {
    Store = Store
    
    Config = {
        ...this.Config
    }
}

export default UpdateIdCard
