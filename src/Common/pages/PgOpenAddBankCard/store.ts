import { observable, action, runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'


export class OpenAddNewNank extends StoreExtends{
    @observable result:any = {}
    @observable bankCardNum = ''
    @observable flag = false
    @observable show = false
    @observable errTip = ''
    @observable timeEnd = null
    @observable userName = ''
    @observable userCardId = ''
    @observable phone = ''
    @observable bottomNoteOnoff = false
    updatePhone = (el) =>{
        runInAction(()=>{
            this.phone = el
        })
    }
    getImgData = async (val) => {
        let res: any = await this.apiBank.apiBankCardScan({
            bankCardNum: '',
            bankCardPhoto: encodeURIComponent(val.split(',')[1]),
            transcoding: "1"
        })

        runInAction(() => {
            this.flag = true
            this.show = true
            this.result = res
            this.bankCardNum = res.bankCardNum
            this.getCard(res.bankCardNum)
        })
    }
    getCard = (val) => {
        console.log(val,"99999999999")

        if (val == '') {
            runInAction(() => {
                this.result = {}
                this.bankCardNum = ''
                this.flag = false
                this.show = false
                this.errTip = ''
            })
        }
        runInAction(() => {
            this.bankCardNum = val
        })
        if (val.length >= 10) {
            clearTimeout(this.timeEnd)
            this.timeEnd = setTimeout(async () => {
                try {
                    if (this.bankCardNum != '' ) {
                        let result: any = await this.apiBank.apiBankCardScan({
                            bankCardNum: this.bankCardNum,
                            bankCardPhoto: ''
                        })
                        runInAction( async () => {
                            this.flag = true
                            this.show = true
                            this.result = result
                            console.log(this.result,"66666666666666")
                            this.bankCardNum = result.bankCardNum
                        })
                    }
                } catch (e) {
                    runInAction(() => {
                        this.flag = false
                        this.show = true
                        this.errTip = e.popMsg
                    })
                }
            }, 800)
        }
    }
}

export default new OpenAddNewNank()
