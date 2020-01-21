import React from 'react'
import './style.scss'
import {Headers, BcButton, BottomColumn} from 'Common/publicCommon/index'
import { Images } from "Common/config/index";

export default class TransferRecord extends React.Component<any, any>{
    render() {
        return (
            <>
                <Headers>转让记录</Headers>
                <div className="record-list">
                    <div className="pro-status pro-default">
                        <div>
                            <span className="pro-name">众力存</span>|&nbsp;武汉众邦银行
                        </div>
                        <div className="cancel-transfer transfer-success transfer-err">取消转让</div>
                    </div>
                    <ul className="records">
                        <li>
                            <span>转让金额(元)</span>
                            <span>80,000.00</span>
                        </li>
                    </ul>
                </div>
            </>
        )
    }
}

