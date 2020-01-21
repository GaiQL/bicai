import React from 'react'
import '../BcHoldRow/style.scss'

const DrawRow = (list) => {
    const {dynamicList, prdIndexName, orgName} = list.list;
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b>{prdIndexName}</b>
                    </p>
                    <p>{orgName}</p>
                </div>
                {
                   dynamicList.map((ele, index) => {
                       return (
                        <p key={index} className={ `item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`} >
                            <span>{ele.fieldName}</span>
                            <span>{ele.fieldValue}</span>
                        </p>
                       ) 
                   }) 
                }
            </li>
        </ul>
    )
}
export default DrawRow