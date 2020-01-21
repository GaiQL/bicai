import PgMoreService from 'Common/pages/PgMoreService'
import Stroe from './stroe'
class MoreService extends PgMoreService{
    Store = Stroe
    Config = {
        ...this.Config,
        bindSales: true, //销户
        bindCardDescType: 1
    }
}
export default MoreService
