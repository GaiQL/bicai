import React from 'react'
import PgTradingDetail from 'Common/pages/PgTradingDetail'
import help from 'Common/utils/Tool'
import './style.scss'
import Store from './store'

const defaultTemplate = (data) => {
    return (
        <section className="details-list">
            <h5>{help.fromatDateYear(data.title)}</h5>
            <ul>
                {
                    data.lists.map((item, index) => {
                        let transTypeStatus = item.transType == 1 || item.transType == 4 || item.transType == 5;
                        return (
                            <li key={index} >
                                <p className="titles">
                                    <span className="title">
                                        {item.transTypeName}
                                    </span>
                                    <span className="describe">
                                        { transTypeStatus ? '入金' : '出金' }
                                        {/* { item.transStatus == 1 ? '(成功)' : item.transStatus == 2 ? '(失败)' : '(处理中)' } */}
                                    </span>
                                </p>
                                <p>
                                    <span className="date">{item.operaDate}</span>
                                    {/* 1 充值 2 提现 3 购买 4赎回 5入息 */}
                                    <span className={`money ${(transTypeStatus ? 'add-money' : 'reduce-money')}`}>
                                        {
                                            (transTypeStatus ? '+' : '-' ) + item.transAmtDesc
                                        }
                                    </span>

                                </p>

                            </li>
                        )
                    })
                }
            </ul>
        </section>
    )
}
const DepositDetails = Component => {
    return class DepositDetails extends PgTradingDetail {
        render(): any {
            return <Component {...this.props}
                headerArr={['交易明细']}
                isTabdsiable={false}
                defaultTemplate={defaultTemplate}
                Store={Store}
            />
        }
    }
}

export default DepositDetails(PgTradingDetail)
