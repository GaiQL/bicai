import PgOpenPerfection from 'Common/pages/PgOpenPerfection'
import Store from './store'

class OpenPerfection extends PgOpenPerfection {
    Store = Store
    Config = {
        ...this.Config,
        ISignDate: false, // 签发日期
        ISingOffice: false, // 签发机关
        ISex: false, // 性别
        INation: false, // 民族
        Industry: true // 行业
    }

}
export default OpenPerfection
