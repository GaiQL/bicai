import {updateIdCard} from 'Common/pages/PgUpdateIdCard/store'
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'

class PgUpdateIdCard extends updateIdCard {
    noUpdateCardId = () => {
        session.set("carIdBase64", { // 更新成功统一将base64保存，开户时需要
            idcardFrontPhoto: encodeURIComponent(this.figureImgBase),   //正面base64
            idcardBackPhoto: encodeURIComponent(this.emblemImgBase),    //反面base64
        })
        commonStore.Hash.history.push('/openPerfection')
    }
}

export default new PgUpdateIdCard()
