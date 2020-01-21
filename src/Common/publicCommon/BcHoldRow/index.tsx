import React from 'react'
import './style.scss'

const HoldRow = (props) => {
    const {dynamicList, prdIndexId, prdIndexName, expire, reqSerial, orgName, buyDate, expireDate, rate, remarks} = props.list
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b>{prdIndexName && prdIndexName}</b>
                        <span>{remarks}</span>
                    </p>
                    <p>{orgName}</p>
                </div>
                {
                    dynamicList.map((item, index) => {
                        return (
                            <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                               key={index}>
                                <span>{item.fieldName}</span>
                                <span>{item.fieldValue}</span>
                            </p>
                        )
                    })
                }
                <div className="pro-btns">
                    <button
                        onClick={
                            props.drow.bind(this,
                            prdIndexId, reqSerial,
                            dynamicList[0].fieldValue,
                            buyDate, expireDate)}>
                            {expire || props.depositTypeId == 1 ? '支取' : '提前支取'}
                    </button>
                    <button onClick={props.buy.bind(this, prdIndexId, prdIndexName, rate)}>再次存入</button>
                </div>
            </li>
        </ul>
    )
}
export default HoldRow