import {IConfig, PgOpenPerfection} from 'Common/pages/PgOpenPerfection/store'
import {apiBank} from "315/api/bank"
import {commonStore} from "Common/pages/store"
import { perfectOpenInfoBtn } from 'Common/Plugins/recordLogInfo'
import { observable } from "mobx"
import { session } from "Common/utils/store";

class OpenPerfection extends PgOpenPerfection {
  @observable alterTitle = '提示'
    
  Config:IConfig = { // 配置项目
      nextType:'faceDiscern',
      ifUploadIDCardImgBase64:false,
  }
  Store = commonStore
  apiBank = apiBank
  nextStep = async () => {
      try {
          perfectOpenInfoBtn()
      } catch (err) {}
      this.Store.Hash.history.push('/faceDiscern')
  }
}

export default new OpenPerfection()
