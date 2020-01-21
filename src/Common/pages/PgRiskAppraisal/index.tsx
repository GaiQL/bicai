import React from 'react'
import './style.scss'
import { Headers } from 'Common/publicCommon'
import { BcButton } from 'Common/publicCommon'
import { session } from "Common/utils/store";
import { BottomColumn } from 'Common/publicCommon/index'
class RiskAppraisal extends React.Component<any, any> {
    startAnswerBtn() {
        for (let item in window.sessionStorage) {
            if (item.includes('itemNum')) {
                session.remove(item)
            }
        }
        this.props.history.push('/riskQuestions/1')
    }
    riskTextRender=()=>{
        return <div className='riskText'>
            <div>
                1.以下一系列问题可在您选择合适的理财产品前，协助评估您的风险承受能力、理财方式及投资目标。
            </div>
            <div>
                2.您需认知、了解并同意，如您提供不准确及或不完整的资料，及/或不提供特定资料，则可能对您投资风险承受能力的评估以及理财产品推荐带来影响。
            </div>
            <div>
                3.风险提示：投资需承担各类风险，可能遭受资金损失。同时，投资还要考虑市场风险、信用风险、流动性等风险。
            </div>
            <div>
                4.您应在理财产品购买过程中注意核对自己的风险承受能力和理财产品风险的匹配情况，选择适合自己风险承受能力的理财产品。
            </div>
        </div>
    }
    render() {
        return (
            <div className='riskContent'>
                {/* 头部 */}
                <Headers>风险测评</Headers>
                {/* 风险内容 */}
                <section>
                    <div className='riskAppraisal'>
                        <div className='titleStart'>尊敬的客户：</div>
                        {this.riskTextRender()}
                        {/* 开始答题 */}
                        <div className='startAnswer-confirm'>
                            <BcButton isDisabled='' onClick={this.startAnswerBtn.bind(this)}>开始答题</BcButton>
                        </div>
                    </div>
                </section>
                <BottomColumn type="long" />
            </div>
        )
    }
}
export default RiskAppraisal
