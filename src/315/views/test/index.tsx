import React from 'react'
import PgNativeTest from 'Common/pages/PgNativeTest'

const NativeTest = Component =>{
    return class extends PgNativeTest {
        render(): any {
            return <Component {...this.props}/>
        }
    }
}
export default NativeTest(PgNativeTest)