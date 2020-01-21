import newFace from 'Common/pages/PgNewFace'
import { session } from "Common/utils/store";
import PgOpenPerfection from "../openPerfection/store"
import { commonStore } from "Common/pages/store"
import { apiBank } from '../../api/bank'
export default class FaceDiscern extends newFace {
    apiOpenAccountSubmit = apiBank.apiOpenAccountSubmit
    // 识别验证成功
    checkContrastSuccess = () => {
        PgOpenPerfection.apiOpenAccountSubmit = apiBank.apiOpenAccountSubmit
        PgOpenPerfection.submit()
        PgOpenPerfection.Config.nextType = "openInputSmsCode"
    }
}
