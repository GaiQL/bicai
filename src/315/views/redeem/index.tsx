import PgRedeem from 'Common/pages/PgRedeem'
import React from "react";
import Store from './store'

class Redeem extends PgRedeem {
    Store = Store
    Config = {
        ...this.Config,
        isRequestRate: true,
        showStatus: 0, 
        isShowRate: true,
        extra: ''
    }
}
export default Redeem
