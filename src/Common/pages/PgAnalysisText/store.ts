/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 11:34:26
 * @LastEditTime: 2019-08-27 13:36:58
 * @LastEditors: Please set LastEditors
 */
import { StoreExtends } from 'Common/Plugins/store.extends'
import { publicStore, commonStore } from "Common/pages/store"
export class PgAnalysisText extends StoreExtends{
    Public = publicStore
    Store = commonStore
    openAnAccountAgreementContentFn = async (params?) => {
        return await this.apiBank.openAnAccountAgreementContent(params)
    } 
}
export default new PgAnalysisText()