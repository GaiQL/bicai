import React from 'react'
import './style.scss'
import {Headers, BcButton, BottomColumn} from 'Common/publicCommon/index'
import { Images } from "Common/config/index";

export default class TransferResult extends React.Component<any, any>{
    render() {
        return (
            <>
                <Headers>取消转让结果</Headers>
                <div className="cancel-transfer">
                    <img src={Images.success1} alt="" width="60" height="60" />
                    <p className="result-tip">取消转让成功</p>
                    <p className="cancel-time">取消时间： 2019-21-21 10:00</p>
                </div>
                <BcButton>完成</BcButton>
                <BottomColumn/>
            </>
        )
    }
}

