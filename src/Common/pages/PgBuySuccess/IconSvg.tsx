import React from 'react'
import Help from 'Common/utils/Tool'


interface IProps {
    wid?: string,
    hte?: string,
    color?: string
}

export default (props: IProps) => {
    let { wid = 28, hte = 28, color = '#508CEE' } = props
    return <svg className="icon" width={wid+"px"} height={hte+"px"} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M512.000284 0.009638a478.866081 478.866081 0 0 0-481.877818 481.877817c0 268.466179 213.411638 481.877818 481.877818 481.877818s481.877818-213.411638 481.877817-481.877818-213.411638-481.877818-481.877817-481.877817z m254.732661 351.108224L449.958514 667.771823a33.249569 33.249569 0 0 1-48.187781 0l-144.563346-151.490339a33.249569 33.249569 0 0 1 0-48.187781 33.249569 33.249569 0 0 1 48.187782 0L429.478707 592.117006l289.126691-296.053684a33.249569 33.249569 0 0 1 48.187782 0c13.733518 13.793753 13.733518 41.321023 0 55.114775z" />
    </svg>
}

