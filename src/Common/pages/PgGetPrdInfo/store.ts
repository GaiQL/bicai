
import { observable, action, runInAction } from "mobx";
import apiBicai from 'Common/api/bicai2.0'
import { session } from "Common/utils/store";
import {StoreExtends} from 'Common/Plugins/store.extends'

interface Props {
    [propName: string]: any
}
export class GetPrdInfo extends StoreExtends{
    @observable result: Props = {}

    initData = async (params) => {
        const res = await apiBicai.getPrdInfo(params)
        if (res) {
            runInAction(() => {
                this.result = res
            })
            session.set('proInfo', res)
            return Promise.resolve()
        } else {
            return Promise.reject()
        }
    }
}
export default GetPrdInfo