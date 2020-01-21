import PgHoldProductList from 'Common/pages/PgHoldProductList'
import Store from './store'
import React from "react";
import './style.scss'
import HoldRow from './navHold'
import NavDraw from './navDraw'
class Recharge extends PgHoldProductList {
    Store = Store
    Config = {
        navList: ['持有中','已支取'],
        template:[HoldRow,NavDraw]
    }
}

export default Recharge
