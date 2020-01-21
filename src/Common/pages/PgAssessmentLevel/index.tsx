import React from 'react'
import './style.scss'
import { Native } from "Common/utils/appBridge"
// import apiQryLoginStatus from 'Common/api/bankApiVersion/' // 直销银行的登录状态
import PgRiskQuestions from 'Common/pages/PgRiskQuestions/store'
import { Toast, Modal } from 'antd-mobile';
import './style.scss'
import { observer, inject } from 'mobx-react'
import { Headers, BcButton } from 'Common/publicCommon'
import { session } from "Common/utils/store";
import { BottomColumn } from 'Common/publicCommon/index'
import { apiFactory, apiVersion } from 'Common/api/bank'
import { commonStore } from "Common/pages/store"

const { openAlert } = commonStore
@observer
class AssessmentLevel extends React.Component<any, any> {
    apiVersion: apiVersion = this.props.apiVersion || 'v2'
    apiBank: any = apiFactory(this.apiVersion)
    async continueBuyBtn() {
        if (Native.isApp()) {
            try {
                // todo 需要判断app是购买开户来的还是其他情况。
                // 分三种
                // 购买开户去购买：
                // 银行资产开户去电子账户 ？
                // 二类户去开户关掉页面 ？
                Native.closeWebView()
                // Native.openInfoSuccess({closeState:1,orgId:ORG_ID})
            } catch (e) {
                Toast.info('app测评完成后跳转页')
            }

        } else {
            if (session.get('proInfo') && session.get('proInfo').ID) {
                let params = {
                    prdIndexId: session.get('proInfo').ID
                }
                console.log('成功')

                await this.apiBank.apiQryLoginStatus(params).then((res: any) => {
                    if (res.hasGrade == 101) {
                        openAlert('购买失败', '您的风险评估类型不符合该产品风险等级要求，无法购买', [
                            { text: '取消', onPress: () => { console.log("cancel") } },
                            { text: '重新测评', onPress: () => { this.props.history.replace('/riskAppraisal') } },
                        ])
                    } else {
                        if (session.get('proInfo')) {
                            this.props.history.push(`/buy?proId=${session.get('proInfo').ID}`)
                        } else {
                            if (session.get('proId')) {
                                //  本地用
                                let { initData } = this.props.store.GetPrdInfo
                                initData({ ID: session.get('proInfo') })
                                this.props.history.push(`/buy?proId=${session.get('proInfo')}`)
                            } else {
                                // 其他情况去银行资产
                                this.props.history.push(`/bankDetail`)
                            }
                        }
                    }
                })
            } else {
                this.props.history.push(`/bankDetail`)
            }
            console.log('进行中')

        }

    }
    anewAppraisalBtn() {
        for (let item in window.sessionStorage) {
            if (item.includes('itemNum')) {
                session.remove(item)
            }
        }
        this.props.history.push('/riskAppraisal')
    }

    renderState = () => {
        let { gradeName, text }: any = commonStore.query() || {}
        return <div>
            <h3 className='appraisal_type'>
                {gradeName}
            </h3>
            <div className='appraisal_text'>
                {text}
            </div>
        </div>
    }
    render() {

        return (
            <div className='riskContent'>
                {/* 头部 */}
                <Headers>风险测评</Headers>
                {/* 内容区 */}
                <section>
                    <div className='appraisalContent'>
                        <p className='appraisal_title'>您的测评级别</p>
                        {
                            this.renderState()
                        }
                        {/* 继续购买 */}
                        <div className='continue-confirm'>
                            <BcButton isDisabled='' onClick={this.continueBuyBtn.bind(this)}>继续购买</BcButton>
                        </div>
                        {/* 重新测评 */}
                        <div className='anew-confirm'>
                            <BcButton isDisabled='' className='ant-btn-dashed' onClick={this.anewAppraisalBtn.bind(this)}>重新测评</BcButton>
                        </div>
                    </div>

                </section>
                <BottomColumn type="long" />
            </div>
        )
    }
}
export default AssessmentLevel
