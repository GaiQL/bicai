// import React from 'react'
// import { observer, inject } from 'mobx-react'
// import './style.scss'
// import { Headers } from 'Common/publicCommon'
// import { ListView } from 'antd-mobile';
// import { commonStore } from 'Common/pages/store'
// import BottomColumn from 'Common/publicCommon/BottomColumn'
// import Store from './store'

// @observer
// class Deposit extends React.Component<any, any>{
    
//     head = null
//     importantInfo = null
//     nav = null
//     Store = Store
//     // 具体展示的内容
//     showContent = (list) => {
//         const { apiTradeCheckFn, params, navStatus }:any = this.Store
//         const { template } = this.props
//         return template[navStatus](list, apiTradeCheckFn.bind(this), params)
//     }
//     componentDidMount() {
//         const { getHoldInfo, initSetting }:any = this.Store
//         // 动态获取上部分的高度
//         setTimeout(() => {
//             const TopHeight = this.head.offsetHeight + this.importantInfo.offsetHeight + this.nav.offsetHeight
//             const hei = document.documentElement.clientHeight - TopHeight; // 获取到当前可适高度
//             initSetting(hei)
//             getHoldInfo() // 初始获取持有中的数据
//         }, 0)
//     }
//     componentWillUnmount() {
//         const { initStatus }:any = this.Store
//         initStatus()
//     }
//     render() {
//         const { dataSource, navStatus, height, isLoading, totalPage, assetsObj = {} }:any = this.Store
//         const { switchNav, onEndReached }:any = this.Store
//         const { navList = ['持有中', '已支取'] } = this.props
//         let {prdTypeName}:any = this.Store.Store.query() ? this.Store.Store.query() : {}
//         return (
//             <div className="deposit">
//                 <Headers className="head" refs={(el) => this.head = el}>{prdTypeName}</Headers>
//                 <div className="important-info" ref={(el) => this.importantInfo = el}>
//                     <div>
//                         <p>{assetsObj.totalHoldAmount}</p>
//                         <p>总资产(元)</p>
//                     </div>
//                     <p className="line"/>
//                     <div>
//                         <p>{assetsObj.totalInCome}</p>
//                         <p>累计收益(元)</p>
//                     </div>
//                 </div>
//                 <div className="nav" ref={(el) => this.nav = el}>
//                     {
//                         navList.map((item, index) => {
//                             return <span className={navStatus == index ? 'active' : ''} onClick={() => switchNav(index)} key={index}>{item}</span>
//                         })
//                     }
//                 </div>
//                 <ListView
//                     className={!totalPage && !isLoading ? 'list-box' : ''}
//                     dataSource={dataSource}
//                     renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
//                         {isLoading ? '正在加载中...' : (totalPage ? '已全部加载完成' : '暂无数据')}
//                     </div>)}
//                     renderRow={this.showContent.bind(this)} // 控制每一行的样式 以及结构
//                     style={{ height: height, overflow: 'auto', }}
//                     onEndReached={() => onEndReached()} // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足这个距离时候请求接口
//                     onEndReachedThreshold={10} // 距离底部滑动的距离
//                 >
//                     <BottomColumn type='long'/>
//                 </ListView>
//             </div>
//         )
//     }
// }
// export default Deposit