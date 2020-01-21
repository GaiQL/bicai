import React from 'react'
import Help from 'Common/utils/Tool'


interface IProps {
    wid?: string,
    hte?: string,
    color?: string
}

export default (props: IProps) => {
    let { wid = 15, hte = 15, color = '#999999' } = props
    return <svg className="icon" width={wid+"px"} height={hte+"px"} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M281.664 909.888l406.464-399.616L256 85.376 310.272 32l486.4 478.272L336 963.2l-54.336-53.376z" />
    </svg>
}

