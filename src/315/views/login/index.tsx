import React from 'react'
import PgLogin from 'Common/pages/PgLogin'

const Login = Component => {
    return class extends PgLogin {
        render(): any {
            let Config = {
                imitateParams: { // 在公共头加入额外参数，用于开发
                    // memberId: '1128',
                },
                ifImitateParams: false, // 是否开启额外参数，仅限开发使用。测试或者生产关闭
                smsCode: '123456',
                proId: "221133",
                telephone:'15711349873'
            }
            return <Component {...Config} {...this.props} isTempApiOpen={0}/>
        }
    }
}

export default Login(PgLogin)

