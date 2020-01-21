import React, { Component } from 'react'
import './style.scss'
import { commonStore } from "Common/pages/store"
declare var Array;
const NavHold = (props, fn, params, extraParams) => {
    let obj: any = extraParams || {}
    const { dynamicList, orgName, prdIndexName, prdIndexId, prdName, status, bankName, reqSerial }: any = props
    let amount = dynamicList['amount'].fieldValue
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b>{prdName && prdName}</b>
                        {status == '1' ? <span className="loding">支取中</span> : (status == '2' ? <span className="loding">已支取</span> : null)}
                    </p>
                    <p>{orgName}</p>
                </div>
                {
                    Object.keys(dynamicList).map((item, index) => {
                        if (item == 'reqSerial') {
                            return ''
                        } else if (item == 'buyDate') {
                            return ''
                        }
                        else {
                            return (
                                <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                                    key={index}>
                                    <span>{dynamicList[item].fieldName}</span>
                                    <span>{dynamicList[item].fieldValue}</span>
                                </p>
                            )
                        }   
                    })
                }
                <div className='last-details1'></div>
                {/* <div className='last-details' onClick={() => {
                    commonStore.Hash.history.push(`/revenueList?unPayProfit=${obj.unPayProfit}&totalIncome=${obj.totalIncome}&prdIndexId=${prdIndexId}&startDate=${dynamicList['profitBeginTime'].fieldValue}&endDate=${dynamicList['profitEndTime'].fieldValue}&reqSerial=${reqSerial}`)
                }}>
                    <span>已派发收益列表</span>
                    <span><img src={require('Common/assets/images/go.png')} alt="" /></span>
                </div> */}
                <div className="pro-btns ">
                    <button className={`btn-first ${status != 0 ? 'btn-first-no' : 'btn-first'}`}
                        onClick={status != 0 ? null : () => { fn({ tradeType: 40, reqSerial, amount, prdIndexId, prdIndexName, fieldValue: amount,buyDate:dynamicList['profitBeginTime']&& dynamicList['profitBeginTime'].fieldValue, expireDate:dynamicList['profitEndTime']&&dynamicList['profitEndTime'].fieldValue }) }}>提前支取
                    </button>
                    <button className="pro-last" onClick={() => {
                        fn({
                            tradeType: 30,
                            reqSerial,
                            amount,
                            prdIndexId,
                            prdIndexName,
                            fieldValue: amount,
                        })
                    }}>再次存入
                    </button>
                </div>
            </li>
        </ul>
    )
}
export default NavHold