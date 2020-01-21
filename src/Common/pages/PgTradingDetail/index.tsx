/*
 * @Author: 张政
 * @Date: 2019-06-06 17:27:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 14:21:46
 * @Description: 交易明细页面
 * @params  otherTemplate 其他模板     defaultTemplate 默认模板【！！！默认模板！！！】 
 *         单个明细传递模板即可，但是必须配合自己的模板
 *         当然如果修改样式的话，需要在私有里面配置css
 */
import React from 'react'
import { observer, inject } from 'mobx-react'
import { DatePicker, ListView } from 'antd-mobile';
import checkuserAgent from 'Common/utils/util.checkuserAgent'
import Headers from 'Common/publicCommon/Headers'
import { Native } from "Common/utils/appBridge"
import BottomColumn from 'Common/publicCommon/BottomColumn'
import './style.scss'
import Store from './store'
import IconSvg from './IconSvg'

declare var document
const months = ['近一个月', '近两个月', '近三个月']
interface headrProps {
    headerArr:string[],
    isTabdsiable:boolean
}
@inject('store')
@observer
class DepositDetail extends React.Component<any, any>{
    Store = this.props.Store || Store
    screenDate = null
    screenMonth = null
    lv = null
    head = null
    state = {
        detailedTabSelect: 0, // tab默认选中为0
        isShow: false
    }
    Config = {
        headerArr:['交易明细'],
        isTabdsiable:false
    }
    UNSAFE_componentWillMount(): void {
        let isE = checkuserAgent()
        if (isE.isApp || isE.isWeixin || isE.isWeibo || isE.isDingTalk || Native.isApp()) {
            this.setState({
                isShow: false
            })
        } else {
            this.setState({
                isShow: true
            })
        }
    }

    // 头部模板切换
    headTempFn = (props:headrProps) => {
        /**
         * 明细tab切换
         * @param item 点击的tab
         */
        let detailedTab = (item, index) => {
            document.title = item
            let { detailedTab } = this.Store
            Native.apiNavBarStyleClose('back')
            Native.updateTitle(this.props.children || ' ')
            this.setState({
                detailedTabSelect: index
            })
            detailedTab(index)
        }
        let { headerArr = ['交易明细','处理中'], isTabdsiable = true } = props
        let { detailedTabSelect, isShow  } = this.state
        if (isTabdsiable) {
            return <div className='header' ref={(el) => this.head = el}>
                {!isShow ? <Headers refs={(el) => this.head = el} type='empty'>明细</Headers> : null}
                <div className='headers-barers'>
                    <p
                        className='headers-bar-backer'
                        onClick={() => {
                            this.props.history.go(-1)
                        }}>
                        <IconSvg/>
                    </p>
                    {headerArr.map((item, index) => {
                        return <p className={index == detailedTabSelect ? 'tard-actived' : 'tard-active'} onClick={() => {
                            detailedTab(item, index)
                        }} key={index}>{item}</p>
                    })}
                </div>
            </div>
        } else {
            return <Headers refs={(el) => this.head = el}>{headerArr[0]}</Headers>
        }
    }
    defaultTemplate = (data) => {
        return {}
    }
    otherTemplate = (data) => {
        return {}
    }
    render() {
        let {
            selectMonths,
            handleSort,
            selectedDate,
            confirmDatePicker,
            cancelDatePicker,
            onEndReached,
            dataSource,
            isLoading,
            height,
            dateArr,
            date,
            minDate,
            maxDate,
            monthInd,
            isShowNav,
            isShowDate,
            nextPageFlag,
            pageList,
            switchingTemplate,
            currentPageStatus
        } = this.Store
        let otherTemplate = this.props.otherTemplate ? this.props.otherTemplate : this.otherTemplate
        let defaultTemplate = this.props.defaultTemplate ? this.props.defaultTemplate : this.defaultTemplate
        return (
            <div className="deposit-detail">
                {this.headTempFn({
                    headerArr:this.props.headerArr ? this.props.headerArr : this.Config.isTabdsiable,
                    isTabdsiable:this.props.isTabdsiable ? this.props.isTabdsiable: this.Config.isTabdsiable
                })}
                <ul className={`screen-month border-line`} ref={(el) => this.screenMonth = el}>
                    {
                        months.map((item, index) => {
                            return <li className={index == monthInd ? 'current' : ''} key={index} onClick={() => { selectMonths(index) }}>{item}</li>
                        })
                    }
                    <li className={`${isShowNav ? 'screen-icon-selected' : 'screen-icon'}`} onClick={() => { handleSort(this.head, this.screenDate, this.screenDate) }}></li>
                </ul>
                <ol className={`screen-date ${isShowNav ? '' : 'none-opacity'}`} ref={(el) => this.screenDate = el}>
                    {
                        dateArr.map((ele, index) => {
                            return <li key={index} onClick={selectedDate.bind(this, index, this.head, this.screenMonth, this.screenDate)}>{ele}<i></i></li>
                        })
                    }
                </ol>
                <DatePicker
                    visible={isShowDate}
                    mode="date"
                    value={date}
                    minDate={new Date(minDate)}
                    maxDate={new Date(maxDate)}
                    onOk={confirmDatePicker}
                    onDismiss={cancelDatePicker}
                >
                </DatePicker>
                <ListView
                    className={!pageList.length ? 'bg-color' : ''}
                    ref={el => this.lv = el}
                    dataSource={dataSource}
                    renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
                        {isLoading ? '正在加载中...' : currentPageStatus && !pageList.length ? '暂无数据' : '已全部加载完成'}
                    </div>)}
                    renderRow={switchingTemplate ? otherTemplate : defaultTemplate} // 控制每一行的样式 以及结构
                    style={{ height: height, overflow: 'auto', }}
                    onEndReached={onEndReached} // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足这个距离时候请求接口
                    onEndReachedThreshold={25} // 距离底部滑动的距离
                >
                    <BottomColumn type='long'></BottomColumn>
                </ListView>
            </div>
        )
    }
    // 清除缓存
    componentWillUnmount() {
        let { initState } = this.Store
        initState()
    }
    componentDidMount() {
        let { getNowFormatDate, getDetailData, setHeight, useTestTime, testTime, initListType} = this.Store
        let { monthInd } = this.Store
        setTimeout(() => {
            // console.log(this.head.offsetHeight)
            // console.log(this.screenMonth.offsetHeight)
            let head = this.head ? this.head.offsetHeight : 0
            let screen = this.screenMonth ? this.screenMonth.offsetHeight : 0
            const TopHeight = head + screen
            const hei = document.documentElement.clientHeight - TopHeight; // 获取到当前可适高度
            setHeight(hei)
            console.log(initListType, '========initListType')
            let dateObj: any = getNowFormatDate(monthInd + 1) // 获取日期
            console.log(dateObj)
            let defaultDate = {
                ...dateObj,
                currentPage: '1',
                queryType: initListType,
                pageSize: "10"
            }
            getDetailData(useTestTime ? testTime : defaultDate)
        }, 50)
    }
}
export default DepositDetail
