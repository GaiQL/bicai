import React from 'react'
import PgInWaiting from 'Common/pages/PgInWaiting'


const BuyWaiting = Component =>{
    return class extends PgInWaiting {
        render(): any {
            return <Component {...this.props} status={1}/>
        }
    }
}

export default BuyWaiting(PgInWaiting)
