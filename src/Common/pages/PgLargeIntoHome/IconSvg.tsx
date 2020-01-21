import React from 'react';
import Help from 'Common/utils/Tool';


interface IProps {
    wid?: string,
    hte?: string,
    color?: string,
    style?:any
}

export const First =  (props: IProps) => {
    let { wid = 22, hte = 22 ,style } = props
    return (
        <svg style={style} className="icon" width={Help.px2rem(wid)} height={Help.px2rem(hte)} viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-First" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="当电子账号可绑定多张银行卡时First" transform="translate(-15.000000, -285.000000)">
                    <g id="1-First" transform="translate(15.000000, 283.000000)">
                        <g id="First" transform="translate(0.000000, 2.000000)">
                            <g>
                                <circle id="椭圆形First" fill="#508CEE" cx="11" cy="11" r="11"></circle>
                                <text fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14" fontWeight="normal" line-spacing="19" fill="#FFFFFF">
                                    <tspan x="8" y="16.5">1</tspan>
                                </text>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const Second =  (props: IProps) => {
    let { wid = 22, hte = 22,style } = props
    return (
        <svg style={style} className="icon" width={Help.px2rem(wid)} height={Help.px2rem(hte)} viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="当电子账号可绑定多张银行卡时" transform="translate(-15.000000, -709.000000)">
                    <g id="1-copy-2" transform="translate(15.000000, 707.000000)">
                        <g id="2" transform="translate(0.000000, 2.000000)">
                            <g>
                                <circle id="椭圆形" fill="#508CEE" cx="11" cy="11" r="11"></circle>
                                <text fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14" fontWeight="normal" line-spacing="19" fill="#FFFFFF">
                                    <tspan x="6.5" y="16.5">2</tspan>
                                </text>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const DarkSpot =  (props: IProps) => {
    let { wid = 3, hte = 3 } = props
    return (
        <svg width={Help.px2rem(wid)} height={Help.px2rem(hte)} viewBox="0 0 3 4" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-DarkSpot" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="当电子账号可绑定多张银行卡时DarkSpot" transform="translate(-34.000000, -326.000000)" fill="#666666">
                    <g id="1-DarkSpot" transform="translate(15.000000, 283.000000)">
                        <g id="椭圆形-DarkSpot" transform="translate(19.000000, 43.500000)">
                            <circle id="椭圆形DarkSpot" cx="1.5" cy="1.5" r="1.5"></circle>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}




