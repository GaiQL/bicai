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

export const IconCheck = (props: IProps) => {
    let { wid = 20, hte = 20, color = '#14B796' } = props
    return <svg className="icon" width={wid+"px"} height={hte+"px"} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M751.616 344.064c8.192 8.192 8.192 20.48 0 28.672l-307.2 307.2c-4.096 4.096-9.216 6.144-14.336 6.144s-10.24-2.048-14.336-6.144l-153.6-153.6c-8.192-8.192-8.192-20.48 0-28.672s20.48-8.192 28.672 0L430.08 636.928l292.864-292.864c8.192-8.192 20.48-8.192 28.672 0zM972.8 512c0 253.952-206.848 460.8-460.8 460.8S51.2 765.952 51.2 512 258.048 51.2 512 51.2s460.8 206.848 460.8 460.8z m-40.96 0C931.84 280.576 743.424 92.16 512 92.16S92.16 280.576 92.16 512s188.416 419.84 419.84 419.84 419.84-188.416 419.84-419.84z" />
    </svg>
}

