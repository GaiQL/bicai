import React from 'react'
import { observer } from 'mobx-react'
import './style.scss'
import { Headers } from 'Common/publicCommon'
import Store from './store'
@observer
class RevenueList extends React.Component<any, any>{
    state = {
        totalIncome: '',
        totalYesIncome: '',
        prdIndexId: '',
        startDate: '',
        endDate: '',
        reqSerial: '',
        nextIPDate: ''
    }
    Store = Store
    render() {
        let { res }: any = this.Store
        return <div className='revenueList'>
            {/* 头部 */}
            <Headers>已派发收益列表</Headers>
            <div className="revenueList-1">

                <p>待发收益(元)<span>{res.unPayProfit}</span></p>
                <p>已派发收益(元)<span>{res.repayAmount}</span></p>
                <p>下次付息日<span>{res.nextIPDate}</span></p>
                </div>
                {
                res.retList && res.retList.map((res, index) => {
                    return <div className="revenueList-2" key={index}>
                        {
                            Object.keys(res.dynamicList).map((ress, index): any => {
                                return <p key={index}>
                                    {res.dynamicList[ress].fieldName}
                                    <span>
                                        {res.dynamicList[ress].fieldValue}  
                                    </span>
                                </p>
                            })
                        }
                    </div>
                })
            }
        </div >
    }
    componentDidMount() {
        let params = this.Store.Store.query()
        let { prdIndexId, startDate, endDate, reqSerial }: any = params
        let { comelist } = this.Store
        comelist(prdIndexId, startDate, endDate, reqSerial)
    }
}
export default RevenueList
