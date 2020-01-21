import React from 'react'
import PgInWaiting from 'Common/pages/PgInWaiting'


const RechargeWaiting = Component =>{
    return class extends PgInWaiting {
        render(): any {
            return <Component {...this.props} status={2}/>
        }
    }
}

export default RechargeWaiting(PgInWaiting)
