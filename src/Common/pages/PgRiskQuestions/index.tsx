import React from 'react'
import './style.scss'
import { observer, inject } from 'mobx-react'
import { Headers, BcButton } from 'Common/publicCommon'
import BcRadio from 'Common/publicCommon/BcRadio/index'
import { session } from "Common/utils/store";
import { BottomColumn } from 'Common/publicCommon/index'
import Store from "./store"
@observer
class Question extends React.Component<any, any> {
    Store = Store
    state = {
        radioIndex: -1,
        questionNum: this.props.location.pathname.split('/')[2],
    }
    // 获取风险问题数据
      componentWillMount() {
        let { getRiskQuestionFn } = this.Store
        let { riskQuestionsArr, riskQuestionBtn } = this.Store
        getRiskQuestionFn()
        console.log(riskQuestionsArr)
        this.getSessionStorageAnswer()
        // 监听路由的变化进行路由的跳转
        this.props.history.listen((location) => {
            this.setState({
                questionNum: location.pathname.split('/')[2]
            })
            this.getSessionStorageAnswer()
        })
    }
    // 获取sessionStorage中选中答案
    getSessionStorageAnswer() {
        let num = session.get('itemNum' + this.state.questionNum);
        if (num) {
            this.setState({
                radioIndex: num
            })
        } else {
            this.setState({
                radioIndex: -1
            })
        }
    }
    // 单选框
    redioIndexChange = (ind, checkState) => {
        if (checkState) {
            this.setState({
                radioIndex: ind
            })
            session.set('itemNum' + this.state.questionNum, ind.toString())
        }
    }
    // 上一题
    lastQuestions = () => {
        this.setState({
            questionNum: this.state.questionNum - 1
        }, () => {
            this.props.history.push('/riskQuestions/' + this.state.questionNum)
        })
    }
    // 下一题
    nextQuestions = () => {
        if (session.get('itemNum' + this.state.questionNum)) {
            this.setState({
                questionNum: this.state.questionNum - 0 + 1
            }, () => {
                this.props.history.push('/riskQuestions/' + this.state.questionNum)
            })
        } else {
            return;
        }
    }


    render() {
        let { radioIndex, questionNum } = this.state;
        let { riskQuestionsArr, riskQuestionBtn } = this.Store
        console.log(riskQuestionsArr,"riskQuestionsArr")
        return (
            <div className='riskQuestionsBox'>
                {/* 头部 */}
                <Headers>风险测评</Headers>
                {/* 风险问题 */}
                <section>
                    <div className='riskQuestions'>
                        <p className='questionNumber'>
                            <b>{questionNum}</b>
                            <span>/{riskQuestionsArr.length && riskQuestionsArr.length}</span>
                        </p>
                        {/* 风险问题选项 */}
                        <div className='questionBox'>
                            <h5 className='title'>
                                {riskQuestionsArr.length && riskQuestionsArr[questionNum - 1].questionContent}
                            </h5>
                            <div className='questionList'>
                                <ul>
                                    {
                                        riskQuestionsArr.length
                                        &&
                                        riskQuestionsArr[questionNum - 1].options.map((item, ind) => {
                                            return <li key={ind} onClick={this.redioIndexChange.bind(this, ind)}>
                                                {/* 传递默认的是否选中来控制选中状态，并传递onChange事件来得到每一个单选按钮的值 */}
                                                <BcRadio
                                                    key={ind}
                                                    defaultChecked={ind == radioIndex}
                                                    onChange={this.redioIndexChange.bind(this, ind)}
                                                />
                                                <p>
                                                    <span> {item.optionNum}</span>
                                                    {item.option}
                                                </p>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        {/* 上一题下一题 */}
                        <p className='upDown_question'>
                            <span
                                className={questionNum != 1 ? 'last' : 'none'}
                                onClick={this.lastQuestions.bind(this)}
                            >
                                上一题
                            </span>
                            {
                                questionNum == 1 || questionNum != riskQuestionsArr.length ?
                                    <span
                                        className={radioIndex != -1 ? 'next' : 'show'}
                                        onClick={this.nextQuestions.bind(this)}
                                    >
                                        下一题
                                </span> :
                                    null
                            }

                        </p>
                        {/* 提交 */}
                        <div className={`riskQuestion-confirm ${questionNum == riskQuestionsArr.length ? 'next' : 'none'}`}>
                            <BcButton isDisabled={radioIndex == -1} onClick={riskQuestionBtn.bind(this)}>提交</BcButton>
                        </div>
                    </div>
                </section>
                <BottomColumn type="long" />
            </div>
        )
    }
}
export default Question
