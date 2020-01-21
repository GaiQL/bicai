import { observable, action, runInAction } from "mobx";
import { session } from "Common/utils/store";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { commonStore } from "Common/pages/store"
import apiRealName from "Common/api/realname"
export class PgRiskQuestions extends StoreExtends {
    @observable riskAnswer = {}
    @observable riskQuestionsArr = []
    @observable riskQuestionsData = []
    @observable result = {}
    @observable gradeName = ''
    @observable text = ''
    @observable isAnswers = false
    // 获取风险测评问题
    getRiskQuestionFn = async () => {
        let res = await this.apiBank.getRiskAppraisalQuestions()
        runInAction(() => {
            this.riskQuestionsArr = res.listSubject
        })
    }

    // 风险问题提交按钮
    riskQuestionBtn = async () => {
        let { riskQuestionsArr } = this
        let answer = []
        // 提交完成，并删除本地保留的选中项
        for (let item in window.sessionStorage) {
            if (item.includes('itemNum')) {
                answer.push({ [item]: JSON.parse(window.sessionStorage[item]) })
            }
        }

        // 排序
        answer.sort((a, b) => {
            return parseInt(Object.keys(a)[0].slice(7)) - parseInt(Object.keys(b)[0].slice(7))
        })

        let text = [];
        let sum = [];
        answer.map((item, ind) => {
            text.push(Object.keys(item)[0].substr(7))
            sum.push(Object.values(item)[0])
        })

        let sumArr = [];
        text.map((ele, k) => {
            sumArr.push(riskQuestionsArr[ele - 1].options[sum[ele - 1]].score)
        })

        let answers = answer.map(item => Object.values(item)[0]) // 答案的下标[1,3,2,...]
        let riskOptions = '';
        // 遍历答案下标的数组，返回对应的选项ABCD
        if (this.isAnswers) {
            answers.map((item, ind) => {
                console.log(ind)
                switch (item) {
                    case '0':
                        return riskOptions += 'A';
                    case '1':
                        return riskOptions += 'B';
                    case '2':
                        return riskOptions += 'C';
                    case '3':
                        return riskOptions += 'D';
                    case '4':
                        return riskOptions += 'E';
                }
            })
            var riskQuestionAnswer = riskOptions.split("").join(",")
        } else {
            answers.map((item, ind) => {
                console.log(ind)
                switch (item) {
                    case '0':
                        return riskOptions += (ind + 1) + '_A,';
                    case '1':
                        return riskOptions += (ind + 1) + '_B,';
                    case '2':
                        return riskOptions += (ind + 1) + '_C,';
                    case '3':
                        return riskOptions += (ind + 1) + '_D,';
                    case '4':
                        return riskOptions += (ind + 1) + '_E,';
                }
            })
            let newRiskOptions = riskOptions.split(",")
            var riskQuestionAnswer = newRiskOptions.splice(0, newRiskOptions.length - 1).join(",") // 得到结果，然后发起请求
        }

        // 传递参数（答案）
        let { idName, idNumber }: any = await apiRealName.BcSuccessIdcard({ isShowIdPhoto: false })
        await this.apiBank.riskAppraisalAnswer({
            "riskAnswer": riskQuestionAnswer,
            "score": sumArr.join(','),
            username: idName,
            idNo: idNumber
        }).then(data => {
            runInAction(() => {
                this.result = data
                this.gradeName = data.gradeName
                this.text = data.text
                //gradeName
                //text
                commonStore.Hash.history.push('/assessmentLevel?gradeName=' + this.gradeName + "&text=" + `${this.text ? this.text : ""}` + "&grade=" + data.grade)
            })

        })


    }


}
export default new PgRiskQuestions()
