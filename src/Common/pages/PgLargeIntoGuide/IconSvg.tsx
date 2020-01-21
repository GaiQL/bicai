import React from 'react'
import Help from 'Common/utils/Tool'


interface IProps {
    wid?: string,
    hte?: string,
    color?: string,
    style?:any,
    className?:string,
    onClick?:any
}

export const PhoneImage = (props: IProps) => {
    let { wid = 26, hte = 26 } = props
    return (
        <svg width={Help.px2rem(wid)} height={Help.px2rem(hte)} viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <polygon id="path-1" points="5.46298603e-17 0 12 0 12 19 5.46298603e-17 19"></polygon>
            </defs>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="大额转入_操作指引" transform="translate(-24.000000, -78.000000)">
                    <g id="分组-2" transform="translate(24.000000, 78.000000)">
                        <g id="手机转账-">
                            <g id="手机转账">
                                <circle id="椭圆形" fill="#508CEE" cx="13" cy="13" r="13"></circle>
                                <g id="shouji-(1)" transform="translate(13.000000, 13.000000) scale(-1, 1) translate(-13.000000, -13.000000) translate(7.000000, 3.500000)">
                                    <mask id="mask-2" fill="white">
                                        <use xlinkHref="#path-1"></use>
                                    </mask>
                                    <g id="Clip-2"></g>
                                    <path d="M10.3582234,0.000639917682 L1.56253234,0.000639917682 C1.56253234,0.000639917682 -0.00261273949,-0.0780813291 3.27569526e-06,1.51072403 L3.27569526e-06,17.5332115 C3.27569526e-06,17.5332115 3.27569526e-06,18.8948061 1.48491589,18.9998992 L10.3181912,18.9998992 C10.3181912,18.9998992 11.9996889,19.0445713 11.9970729,17.253257 L11.9970729,1.80951222 C11.9969769,1.80951222 12.1444578,0.0969423976 10.3582234,0.000639917682 Z M4.25928399,1.26444761 L7.98979364,1.26444761 L7.98979364,0.515807158 L4.25928399,0.515807158 L4.25928399,1.26444761 Z M6.0000381,17.9074041 C5.5353234,17.9074041 5.15861721,17.5432778 5.15871321,17.0941677 C5.15880921,16.6451273 5.5355154,16.2810937 6.0002301,16.2811865 C6.46484879,16.2811865 6.84153098,16.6453128 6.84145898,17.0944229 C6.84145898,17.5434633 6.46465679,17.9074969 6.0000381,17.9074041 Z M1.1938182,15.2011931 L10.7721298,15.2011931 L10.7721298,1.79086405 L1.1938182,1.79086405 L1.1938182,15.2011931 Z" id="Fill-1" fill="#FFFFFF" mask="url(#mask-2)"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const Arrows = (props: IProps) => {
    let { wid = 14, hte = 8, style } = props
    return (
        <svg style={style} width={Help.px2rem(wid)} height={Help.px2rem(hte)} viewBox="0 0 14 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <polygon id="path-Arrows" points="4.30381049e-17 0.5 14 0.5 14 8.5 4.30381049e-17 8.5"></polygon>
            </defs>
            <g id="Page-Arrows" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="大额转入_操作指引_Arrows" transform="translate(-121.000000, -301.000000)">
                    <g id="手机银行_Arrows" transform="translate(15.000000, 128.000000)">
                        <g id="xiangxia_Arrows" transform="translate(106.000000, 172.500000)">
                            <g>
                                <mask id="mask-Arrows" fill="white">
                                    <use xlinkHref="#path-Arrows"></use>
                                </mask>
                                <g id="Clip-Arrows"></g>
                                <path d="M7.44848784,8.29915038 L13.8173592,1.64190634 C14.0608803,1.3873621 14.0608803,0.958734023 13.8173592,0.690908181 C13.5739139,0.43636394 13.1638289,0.43636394 12.9075448,0.690908181 L6.9871423,6.87922477 L1.09245522,0.717708553 C0.848934209,0.463164312 0.438868198,0.463164312 0.182640758,0.717708553 C-0.0608802526,0.972252795 -0.0608802526,1.40088087 0.182640758,1.66870671 L6.52581568,8.29907133 C6.79488191,8.56697622 7.19218476,8.56697622 7.4486391,8.29907133 L7.44848784,8.29915038 Z" id="Fill-Arrows" fill="#4B6197" mask="url(#mask-Arrows"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const BackTop = (props: IProps) => {
    let { wid = 40, hte = 40, style ,className,onClick } = props
    return (
        <svg onClick={onClick} style={style} className={className} width={Help.px2rem(wid)} height={Help.px2rem(hte)} viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <polygon id="path-BackTop" points="0.00140077821 0.0118333333 17.992249 0.0118333333 17.992249 1.98786667 0.00140077821 1.98786667"></polygon>
            </defs>
            <g id="Page-BackTop" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="大额转入_操作指引_详情_BackTop" transform="translate(-321.000000, -2996.000000)">
                    <g id="返回顶部按钮-BackTop" transform="translate(322.000000, 2997.000000)">
                        <g id="返回顶部按钮">
                            <circle id="椭圆形" stroke="#999999" fill="#FFFFFF" cx="19" cy="19" r="19"></circle>
                            <g id="fanhuidingbu" transform="translate(10.000000, 10.000000)">
                                <g id="分组">
                                    <mask id="mask-BackTop" fill="white">
                                        <use xlinkHref="#path-BackTop"></use>
                                    </mask>
                                    <g id="Clip-BackTop"></g>
                                    <polygon id="Fill-BackTop" fill="#999999" mask="url(#mask-BackTop)" points="0 1.5 17.9908482 1.5 17.9908482 0 0 0"></polygon>
                                </g>
                                <polygon id="Fill-BackTop" fill="#999999" points="9.49985686 2.91764606 8.49995229 2 1 8.88304605 1.99990458 9.80069211 7.79283363 4.48432627 7.79283363 18 9.20707095 18 9.20707095 4.48432627 15.0000954 9.80069211 16 8.88304605"></polygon>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}