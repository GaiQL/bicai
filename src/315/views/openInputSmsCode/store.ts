import {IConfig, PgInputSmsCode} from 'Common/pages/PgInputSmsCode/store'
import { commonStore } from 'Common/pages/store'
import { INNER_CODE } from "Common/config/params.enum";

class InputSmsCode extends PgInputSmsCode {
  readonly Config: IConfig = {
    ...this.Config,
    phoneType: 'bankCardPhone' // 短信验证码发送类型
  }

  catchAlert = (err) => {
    switch (err.innerCode) {
      case INNER_CODE.CancelAndUpdateIdCard:
        commonStore.openAlert('开户失败', err.popMsg, [
          {
            text: '确定',
            onPress: () =>
              commonStore.Hash.history.push('/updateIdCard?openErr=' + err.innerCode)
          }
        ])
        break;
      case INNER_CODE.SubmitAndDoThing:
        commonStore.openAlert('开户失败', err.popMsg, [
          {
            text: '确定',
            onPress: () =>
              commonStore.Hash.history.push('/openPerfection')
          }
        ])
        break;
      case INNER_CODE.goBcFaceDiscern:
        commonStore.openAlert('开户失败', err.popMsg, [
          {
            text: '确定',
            onPress: () =>
              commonStore.Hash.history.push('/faceDiscern')
          }
        ])
        break;
    }
  }
}

export default new InputSmsCode()
