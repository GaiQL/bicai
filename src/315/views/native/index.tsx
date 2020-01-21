import React from 'react'
import PgNative from 'Common/pages/PgNative'

const Native = Component =>{
    return class extends PgNative {
        render(): any {
            return <Component {...this.props}/>
        }
    }
}
export default Native(PgNative)