import { observable,runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import { session } from "Common/utils/store";
import apiBicai from 'Common/api/bicai2.0'
import { commonStore} from "Common/pages/store"
import { any } from 'prop-types';
import {Native} from "Common/utils/appBridge"


export class PgLogin extends StoreExtends{
    @observable result: any = {}
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
    doClick(){
        this.Store.openAlert('提示','212121',[   {
            text: '确定',
            onPress: () =>
                console.log('确定')
        }])
    }
    ptClick(){
        let res:any={
            amount:"10000",
            buyResult:{
                amountDesc:'成功存入1,000.00元',
                succDateDesc:"今天",
                revenueDate:"2019-08-09%20星期五",
                revenueDesc:"预计产生收益",
                redeemDate:'可随时支取，按提前支取利率计息',
                redeemDateDesc:'到账时间一般在24小时以内，实际到账时间以银行最终处理为准'
            },
            prdType:'4',
            prdTypeName:"定期存款",
            depositTypeId:"4",
            bankData:{
                orgId:'203',
                custServiceHotLine:["400-616-1888"],
                custServiceTime:"周一至周五9:00-12:00 13:30:17:30",
                orgName:"金城银行",
                orgLogo:'open_api_bank/admin/org/message/203/1564127833899bankLogo.jpg'
            },
            buyParams:{
                amount:'',
                teamId:'',
                investId:"",
                activityId:"",
                couponId:"",
                couponDetailId:""
            }
        }
        // 判断是否是拼团过来的
        if(session.get('JUMP_LINK')){
            let jump=session.get('JUMP_LINK');
            jump.indexOf('?')!= -1 ? jump=jump+'&' : jump=jump+'?';
            let bankData:any=session.get('bankData') || '';
            let buyParams:any= JSON.stringify(session.get('buyParams')) || '' ;
            let proId:any= session.get('proId') || ''
            let url1:any=jump+`stepList=${JSON.stringify(res.buyResult)}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}&bankData=${bankData}&buyParams= ${buyParams}&proId= ${proId}&hideRightShare=1&amount=${res.amount * 1}`
            Native.apiNavBarStyleClose('back')  //针对ios做的头部标题
            // 外链针对安卓做跳转 
            Native.goBannerUrl({
                url: url1 , closeState: "0" 
            })
            return;
        }else{
            alert('不是拼团')
            return;
        }
    }

}
export default new PgLogin()