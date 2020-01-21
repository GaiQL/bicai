import {PgProductList} from 'Common/pages/PgHoldProductList/store'
import {apiBank} from "315/api/bank";
class ProductList extends PgProductList{
    apiBank = apiBank
}
export default new ProductList()