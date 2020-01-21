import React from 'react'
import './style.scss'
import { imgSrc } from "Common/config/index";

export default (props) => {
    return (
        <div className="bank-box">
            <div>
                <img src={imgSrc + props.logo} alt=""/>
            </div>
            {props.name}
        </div>
    )
}