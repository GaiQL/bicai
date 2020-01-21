import { observable , runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends';

export class PgLargeIntoGuide extends StoreExtends {

    @observable backTopOnoff = false;
    @observable accountInfo:any = {};
    @observable guidPageData:any = {};
    
    didMountInitialize = async () => {
        let queryData = this.Store.query();
        let guidPageData = await this.apiBank.getLargeDpositGuidePage();
        this.backTop();
        runInAction(()=>{
            this.accountInfo = queryData;
            this.guidPageData = guidPageData;
        })
    }

    monitorTopNum = () => {
        window.addEventListener('scroll', ()=>{
            runInAction(()=>{
                if( document.body.scrollTop > innerHeight ){
                    this.backTopOnoff = true;
                }else{
                    this.backTopOnoff = false;
                }
            })
        })
    }

    backTop = () => { document.body.scrollTop = 0; }

}

export default new PgLargeIntoGuide()