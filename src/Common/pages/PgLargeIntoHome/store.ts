import { observable, runInAction } from "mobx";
import { publicStore, commonStore } from "Common/pages/store"
import { StoreExtends } from 'Common/Plugins/store.extends'
import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile';
import Help from 'Common/utils/Tool'

export class PglargeAmountsTransfer extends StoreExtends {

    @observable bindCardData:any = {};

    // 1 - 电子账号可绑定多张银行卡  添加
    // 2 - 电子账号只能绑定1张银行卡  更换
    // 3 - 电子账号只能绑定1张银行卡且不可更换银行卡
    @observable tiedcardType = 1;

    changeTiedcardType = ( typeNum ) => {
        runInAction(()=>{
            this.tiedcardType = typeNum
        })
    }

    didMountInitialize = async () => {
        let { apiBandCardFn,bandCardInfo } = publicStore;``
        await apiBandCardFn({bizType:'2',queryType:'0'});
    }

    supBank = () => {
        commonStore.Hash.history.push("/bankList")
    }

    changeCard() {
        Help.StorageAddressBar()
        commonStore.Hash.history.push('/boundBank?page=largeAmountsTransfer')
    }

    goLargeIntoGuide = () => {
        let { bandCardInfo } = publicStore;
        commonStore.Hash.history.push( `/largeIntoGuide?accountNum=${ bandCardInfo.bankElecAccountNum }&orgName=${ bandCardInfo.orgName }` )
    }

    copyAccountNum = ( accountNum? ) => {
        let { bandCardInfo } = publicStore;
        let prepareCopyNum = accountNum?accountNum:bandCardInfo.bankElecAccountNum;
        console.log( accountNum,prepareCopyNum )
        if( prepareCopyNum ){
            copy( prepareCopyNum );
            Toast.info('复制成功',1);
        }else{
            Toast.info('没有可复制的内容',1);
        }
    }

}

export default new PglargeAmountsTransfer()