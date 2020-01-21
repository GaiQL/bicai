import React from 'react'
import {observer, inject} from 'mobx-react'
import './style.scss'
import {Headers} from 'Common/publicCommon'
import {ListView} from 'antd-mobile';
import {commonStore} from 'Common/pages/store'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'

declare var window

@observer
class Deposit extends React.Component<any, any> {
    head = null
    importantInfo = null
    nav = null
    Store = Store
    // 具体展示的内容
    Config: any = {
        navList: ['持有中', '已支取'],
        template: [],
        interest: false // 是否添加利率计算弹出框
    }
    showContent = (list, sectionID, rowID) => {
        const {apiTradeCheckFn, params, navStatus, unPayProfit, totalIncome, showModule, goDetail}: any = this.Store
        const extraParams = { // 针对异样的额外的参数, 不可以删除 只可以累加参数  goDetail组合购买按钮跳转路由
            unPayProfit,
            totalIncome,
            goDetail
        }
        return this.Config.template[navStatus](list, apiTradeCheckFn.bind(this), params, extraParams, showModule, rowID)
    }

    componentWillMount() {
    }

    componentDidMount() {
        const {getHoldInfo, initSetting, height, initStatus, noteOnoff}: any = this.Store
        let flag = true
        const fv = async () => {
            if(!flag) return
            flag = false
            await initStatus()
            await getHoldInfo()
            setTimeout(() => {
                flag = true
            }, 1000)
        }
        fv()
        window.onRestart = async function () {
            fv();
        } // 安卓初始化数据
        window.appear = function () {
            fv();
        }// ios初始化数据
        window.pageAppear = function () {
            fv()
        }// ios初始化数据
    }

    componentWillUnmount() {
        const {initStatus}: any = this.Store
        initStatus()
        window.onRestart = null
        window.appear = null
        window.pageAppear = null
    }

    /**
     * 重要信息模板【特替换，可配置（通用持仓 === 回款计划）】
     * @params totalHoldAmountDesc  总资产
     * @params totalIncomeDesc  累计收益
     */
    ImportantInformationTemplate = (totalHoldAmountDesc?, totalIncomeDesc?) => {
        return (
            <div className="important-info" ref={(el) => this.importantInfo = el}>
                <div>
                    <p>{totalHoldAmountDesc}</p>
                    <p>总资产(元)</p>
                </div>
                <p className="line"/>
                <div>
                    <p>{totalIncomeDesc}</p>
                    <p>累计收益(元)</p>
                </div>
            </div>
        )
    }
    // 可配置头部样式
    headerStyle = {
        className: 'head',
        leftColor: '#fff'
    }

    render() {
        const {
            dataSource, navStatus, height, isLoading, currentPageStatus,
            totalIncomeDesc,
            totalHoldAmount,
            totalHoldAmountDesc,
            totalYesIncome,
            list,
            moduleFlag,
            onClose,
            incomeUrl,
            noteStr,
            noteOnoff
        }: any = this.Store

        const {switchNav, onEndReached}: any = this.Store
        const {navList} = this.Config
        let {prdTypeName}: any = this.Store.Store.query() ? this.Store.Store.query() : {}
        return <div className="deposit">
            <Headers className={this.headerStyle.className} refs={(el) => this.head = el}
                     leftColor={this.headerStyle.leftColor}>{prdTypeName}</Headers>
            {this.ImportantInformationTemplate(totalHoldAmountDesc, totalIncomeDesc)}
            {
                noteOnoff
                    ? <p className="list_topNote">{noteStr}</p>
                    : null
            }

            <div className={navList.length == 0 ? "nav noNav" : "nav"} id='nav' ref={(el) => this.nav = el}>
                {
                    navList.map((item, index) => {
                        return <span className={navStatus == index ? 'hold-active' : ''}
                                     onClick={() => switchNav(index)}
                                     key={index}>{item}</span>
                    })
                }
            </div>
            <ListView
                className={!list.length ? 'list-box' : ''}
                dataSource={dataSource}
                renderFooter={() => (<div style={{padding: 10, textAlign: 'center'}}>
                    {isLoading ? '正在加载中...' : (currentPageStatus ? '已全部加载完成' : '暂无数据')}
                </div>)}
                renderRow={this.showContent.bind(this)} // 控制每一行的样式 以及结构
                style={{flexGrow: 1}}
                onEndReached={() => onEndReached()} // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足这个距离时候请求接口
                onEndReachedThreshold={10} // 距`离底部滑动的距离
            >
                <BottomColumn type='long'/>
            </ListView>
            {
                this.Config.interest
                    ? this.Config.module.prototype.isReactComponent ? <this.Config.module moduleFlag={moduleFlag}
                                                                                          onClose={onClose}/> : this.Config.module(moduleFlag, onClose, incomeUrl)
                    : null
            }
        </div>
    }
}

export default Deposit
