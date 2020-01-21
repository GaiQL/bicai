import React, { Component } from 'react'
import './style.scss'
import { commonStore } from "Common/pages/store"
declare var Array;
const NavHold = (props, fn, params, extraParams) => {
    const { dynamicList, orgName, prdIndexName, prdIndexId, prdName, status,bankName }: any = props
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b>{prdName && prdName}</b>
                        {/* {status == '1' ? <span className="loding">支取中</span> : (status == '2' ? <span className="loding">已支取</span> : null)} */}
                    </p>
                    <p>{orgName}</p>
                </div>
                <div className='dayList'>
                    {
                        Object.keys(dynamicList).map((item, index) => {
                                return (
                                    <p className={`item-details`}
                                        key={index}>
                                        <span>{dynamicList[item].fieldName}</span>
                                        <span>{dynamicList[item].fieldValue}</span>
                                    </p>
                                )
                        })
                    }
                    <div className='last-details1'></div>
                </div>
                {/* <div className="pro-btns ">
                    <button className="pro-lastDrow" onClick={() => {
                        fn({
                            tradeType: 30,
                            amount,
                            prdIndexId,
                            prdIndexName,
                            fieldValue: amount,
                        })
                    }}>再次存入
                    </button>
                </div> */}
            </li>
        </ul>
    )
}
export default NavHold