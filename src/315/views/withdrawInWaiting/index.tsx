import React from 'react'
import PgInWaiting from 'Common/pages/PgInWaiting'


const WithdrawWaiting = Component =>{
    return class extends PgInWaiting {
        render(): any {
            return <Component {...this.props} status={3}/>
        }
    }
}

export default WithdrawWaiting(PgInWaiting)
