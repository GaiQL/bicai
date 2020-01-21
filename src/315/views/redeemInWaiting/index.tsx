import React from 'react'
import PgInWaiting from 'Common/pages/PgInWaiting'


const RedeemWaiting = Component =>{
    return class extends PgInWaiting {
        render(): any {
            return <Component {...this.props} status={5}/>
        }
    }
}

export default RedeemWaiting(PgInWaiting)
