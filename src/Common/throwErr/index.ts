import {Modal} from "antd-mobile";
import {INNER_CODE} from "Common/config/params.enum";

const alert = Modal.alert;

const errCodeArr = new Map([
    [INNER_CODE.SubmitOnly
        ,(e,title)=>{
        alert(title || '更新失败', e.popMsg, [
            {
                text: '确定',
                onPress: () =>
                    console.log('确定')
            }
        ])
    }]
])
export const throwErr = (e,title) => {
    errCodeArr.get(e.innerCode)(e,title)
}
