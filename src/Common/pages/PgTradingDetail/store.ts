
import { observable, action, autorun, runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends'
import { DatePicker, ListView, Toast } from 'antd-mobile';
import { publicStore, commonStore, PgRecharge } from "Common/pages/store"
interface paramsRule {
    [propName: string]: any;
}
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export class PgTradingDetail extends StoreExtends {

    @observable additionalConditions = false    // 是否添加额外翻页条件
    @observable operaDate = ''                  // 查询下页必传，送最近一次查询结果最后一条记录的交易日期【工商】
    @observable pnRowRecord = ''                // 查询下页必传，送最近一次查询结果最后一条记录的翻页条件【工商】
    @observable tabTypes = {                    // 根据每个银行的querytype来进行赋值
        tabLeft: '0',
        tabRight: '3'
    }
    @observable initListType = '0'              // 初始化页面请求状态【初始化queryType值】
    @observable defaultType = '0'               // 默认初始化无tab切换，querytype值



    @observable dataSource = dataSource         // 列表数据源
    @observable isLoading = true                // loading
    @observable height = document.documentElement.clientHeight * 3 / 4
    @observable dateArr = []
    @observable selectedInd = null
    @observable date = new Date()               // 当前时间
    @observable minDate = ''                    // 当前日期的前两年
    @observable maxDate = ''                    // 最大日期
    @observable monthInd = 0                    // 默认筛选近一个月
    @observable isShowNav = false               // 日期的nav
    @observable isShowDate = false              // 显示日期弹框组件
    @observable currentPage = 1
    @observable pageList = []                   // 总数据源
    @observable totalPage = 1                   // 默认下一页
    @observable switchingTemplate = 0           // 切换模板
    @observable separate = false                // 是否将明细分离 true为分离 false为不分离
    @observable useTestTime = false             // 是否开启模拟请求数据
    @observable currentPageStatus = 0           // 0 ->  暂无数据   1 -> 加载完成
    @observable nextFlag = 0                    // 0 无 1 有
    @observable pageType = ''

    @observable testTime = {
        // startDate: "2030-01-01",
        // endDate: "2031-01-01",
        // queryType: "0",
        // currentPage: "1",
        // pageSize: "10"
    }

    @observable strtNum = 0;  //广州农商大数据起始笔数
    @observable coreNum = 0;  //广州农商核心记录数

    // 清除缓冲-初始化
    initState = () => {
        runInAction(() => {
            this.pageList = []
            this.dataSource = this.dataSource.cloneWithRows([])
            this.dateArr = []
            this.switchingTemplate = 0
            this.monthInd = 0
            this.currentPageStatus = 0
            this.isShowNav = false
            this.operaDate = ''
            this.pnRowRecord = ''
            this.strtNum = 0
            this.coreNum = 0
        })
    }
    // 特殊翻页条件存放【如有新的额外翻页条件，写在私有中进行替换, 可参考工商私有】
    pageTurningCondition = (dataList) => {
        return
    }

    // tab切换 type 资产0  交易1
    detailedTab = (type) => {
        if (this.switchingTemplate == type) return
        this.additionalConditions ? this.pageTurningCondition([]) : null
        runInAction(() => {
            this.switchingTemplate = type
            this.pageList = []
            this.dataSource = this.dataSource.cloneWithRows([])
            this.dateArr = []
            this.monthInd = 0
            this.isShowNav = false
            this.currentPage = 1
        })
        let dateObj: paramsRule = this.getNowFormatDate(this.monthInd + 1) // 获取日期
        let datas = {
            currentPage: dateObj.currentPage,
            startDate: dateObj.startDate,
            endDate: dateObj.endDate,
        }
        let types = type ? '2' : '1'
        this.initPush(datas, types)
    }
    // 设置高度
    setHeight = (height) => {
        runInAction(() => {
            this.height = height
        })
    }

    // 判断当前分页使用那种类型做判断
    isNextStep = (pageType, totalPage, nextFlag, list, currentPage) => {
        if (pageType == 'LIMIT' || pageType == 'NEXTPAGE') {
            // 此if的场景是后端有返回数据，但是没有下一页了，需要显示加载完成
            if (list && list.length && currentPage == 1 && nextFlag == 0) return 1
            return nextFlag == 0 ? 1 : 0 // 0 无 1 有
        } else {
            return totalPage ? 1 : 0
        }
    }
    // 点击筛选
    handleSort = (head, screenMonth, screenDate) => {
        const TopHeight = head.offsetHeight + screenMonth.offsetHeight
        if (this.isShowNav) {
            runInAction(() => {
                this.isShowNav = false,
                    this.height = document.documentElement.clientHeight - TopHeight
            })
        } else {
            let minDate = this.getLastYearYestdy(2)
            let maxDate = this.getLastYearYestdy(0)
            runInAction(() => {
                this.minDate = minDate,
                    this.maxDate = maxDate,
                    // this.pageList = [],
                    this.isShowNav = true,
                    this.height = document.documentElement.clientHeight - TopHeight - screenDate.offsetHeight
            })
        }

    }
    // 进行筛选月份的点击事件
    selectMonths = (index) => {
        if (this.monthInd == index) return
        let dateObj: paramsRule = this.getNowFormatDate(index + 1)
        runInAction(() => {
            this.monthInd = index
            this.pageList = []
        })
        let params: any = {
            currentPage: 1,
            startDate: dateObj.startDate, // "2000-01-01"
            endDate: dateObj.endDate, // "2090-12-12"
            // operaDate:1
        }
        let type = ''
        if (this.switchingTemplate) {
            type = '2'
        } else {
            type = '1'
        }
        this.initPush(params, type)
    }
    // 点击开始日期 & 结束日期
    selectedDate = (index, head, screenMonth, screenDate) => {
        const TopHeight = head.offsetHeight + screenMonth.offsetHeight
        runInAction(() => {
            this.height = document.documentElement.clientHeight - TopHeight - screenDate.offsetHeight,
                this.isShowDate = true,
                this.date = new Date(this.dateArr[index]),
                this.selectedInd = index
        })
    };
    // 取消日期选择
    cancelDatePicker = () => {
        runInAction(() => {
            this.isShowDate = false
        })
    };
    // 格式化日期
    formatDate = (val) => {
        let year = new Date(val).getFullYear()
        let month = (new Date(val).getMonth() + 1) < 10 ? '0' + (new Date(val).getMonth() + 1) : (new Date(val).getMonth() + 1)
        let day = new Date(val).getDate() < 10 ? '0' + new Date(val).getDate() : new Date(val).getDate()
        return year + '-' + month + '-' + day
    }
    // 确定日期 来筛选数据
    confirmDatePicker = (val) => {
        let { selectedInd, dateArr } = this
        let brr = JSON.parse(JSON.stringify(dateArr))
        let arr = dateArr
        runInAction(() => {
            arr[selectedInd] = this.formatDate(val)
        })
        if (new Date(arr[0]).getTime() > new Date(arr[1]).getTime()) {
            Toast.info('开始日期不能大于结束日期');
            runInAction(() => {
                this.dateArr = brr
            })
            return false
        } else {
            runInAction(() => {
                this.isShowDate = false,
                    this.dateArr = arr,
                    this.pageList = []
            })
            let params = {
                currentPage: 1,
                startDate: arr[0], // "2000-01-01"
                endDate: arr[1] // "2090-12-12"
            }
            let type = ''
            if (this.switchingTemplate) {
                type = '2'
            } else {
                type = '1'
            }
            this.initPush(params, type)
        }
    }
    // 上拉加载
    onEndReached = () => {
        let { totalPage, currentPage, isLoading, dateArr, pageType, nextFlag } = this
        if (!dateArr.length) return
        runInAction(() => {
            this.isLoading = true,
            this.currentPage = currentPage * 1 + 1
        })
        if (pageType == 'LIMIT' || pageType == 'NEXTPAGE') {
            if (nextFlag == 0) {
                runInAction(() => {
                    this.isLoading = false
                })
                return
            }
        } else {
            if (currentPage * 1 >= totalPage * 1) {
                runInAction(() => {
                    this.isLoading = false
                })
                return
            }
        }

        let datas = {
            currentPage: this.currentPage,
            startDate: dateArr[0], // "2000-01-01", //
            endDate: dateArr[1] // "2090-12-12" //
        }
        let types = this.switchingTemplate ? '2' : '1'
        this.initPush(datas, types, true)


    }
    // 获取n年前的日期
    getLastYearYestdy(n: any) {
        var date: any = new Date();
        var strYear: any = date.getFullYear() - n;
        var strDay: any = date.getDate();
        var strMonth: any = date.getMonth() + 1;
        if (strMonth < 10) {
            strMonth = "0" + strMonth;
        }
        if (strDay < 10) {
            strDay = "0" + strDay;
        }
        let datastr: any = strYear + "-" + strMonth + "-" + strDay;
        return datastr;
    }
    // 用来处理近1个月 & 近2个月 & 近3个月的日期
// 用来处理近1个月 & 近2个月 & 近3个月的日期
    getNowFormatDate = (num?: number) => {
        console.log(num)
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month: any = date.getMonth() + 1;
        var strDate: any = date.getDate();
        var startMounth: any = date.getMonth() - num + 1;
        var currentYear = year
        if (startMounth <= 0) { // 处理跨年
            year = year - 1
            startMounth = 12 - Math.abs(startMounth)
        }
        function addZero(val: any) {
            if (val >= 1 && val <= 9) {
                return "0" + val;
            } else {
                return val.toString()
            }
        }
        let obj31: any = ['01', '03', '05', '07', '08', '10', '12']
        let obj30: any = ['04', '06', '09', '11']
        month = addZero(month)
        startMounth = addZero(startMounth)
        strDate = addZero(strDate)
        var currentdate = currentYear + seperator1 + month + seperator1 + strDate
        let totalDays = null
        if (obj31.includes(startMounth)) {
            totalDays = strDate * 1 >= 31 ? 31 : addZero(strDate * 1 + 1)
        }
        if (obj30.includes(startMounth)) {
            totalDays = strDate * 1 >= 30 ? 30 : addZero(strDate * 1 + 1)
        }
        if (startMounth == '02') {
            var strData = year + seperator1 + startMounth + seperator1 + new Date(year, 2, 0).getDate();
        } else {
            var strData = year + seperator1 + startMounth + seperator1 + totalDays;
        }
        return { startDate: strData, endDate: currentdate };
    }
    // 初始化数据请求，模板切换
    initPush(datas, type, nxll?) {
        if (nxll) {
            runInAction(() => {
                this.isLoading = true
            })
        } else {
            runInAction(() => {
                this.isLoading = true,
                this.dataSource = this.dataSource.cloneWithRows([])
            })
        }
        let data = {}
        let { tabLeft, tabRight }: any = this.tabTypes
        if (this.separate) {
            if (type == '1') {
                data = {
                    ...datas,
                    queryType: tabLeft
                }
            } else {
                data = {
                    ...datas,
                    queryType: tabRight
                }
            }
        } else {
            data = {
                ...datas,
                queryType: this.defaultType
            }
        }
        this.getDetailData(data)
    }
    //  重组数据
    formatList = (arr) => {
        let newArr = []
        arr.forEach((ele, index) => {
            let ind = -1
            let isExists = newArr.some((item, j) => {
                if (item) {
                    if (ele.operaDate.substring(0, 7) == item.currentDate) {
                        ind = j
                        return true
                    }
                }
            })
            if (isExists) {
                newArr[ind].lists.push(ele)
            } else {
                let curDate = new Date()
                let curMonth = (curDate.getMonth() + 1) > 10 ? (curDate.getMonth() + 1) : '0' + (curDate.getMonth() + 1)
                let time = curDate.getFullYear() + '-' + curMonth
                newArr.push({
                    title: time == ele.currentDate ? '本月' : ele.currentDate,
                    currentDate: ele.operaDate ? ele.operaDate.substring(0, 7) : '',
                    lists: [ele]
                })
            }
        })
        return newArr
    }
    // 接口
    apiQryEleTransDetail = async (data) => {
        return this.apiBank.apiQryEleTransDetail(data)
    }
    // 接口
    getDetailData = (params) => {
        let { apiQryEleTransDetail } = this
        let data ={
            currentPage: params.currentPage,
            startDate: params.startDate, // "2000-01-01"
            endDate: params.endDate, // "2090-12-12"
            queryType: params.queryType,
            pageSize: "10",
            operaDate: this.operaDate,
            pnRowRecord: this.pnRowRecord,
            strtNum:this.strtNum,
            coreNum:this.coreNum
        }
        apiQryEleTransDetail(data).then((res: any) => {
            let brr
            if (res.retList) {
                this.additionalConditions ? this.pageTurningCondition(res.retList) : null
                brr = this.pageList.concat(res.retList)
                brr.forEach((ele, index) => {
                    ele.currentDate = ele.operaDate ? ele.operaDate.substring(0, 7) : '';
                })
            } else {
                brr = this.pageList.concat([])
                brr.forEach((ele, index) => {
                    ele.currentDate = ele.operaDate ? ele.operaDate.substring(0, 7) : '';
                })
            }
            let arr = this.formatList(brr)
            if (res.retList) {
                runInAction(() => {
                    this.pageList = this.pageList.concat(res.retList),
                    this.dateArr = [params.startDate, params.endDate],
                    this.dataSource = this.dataSource.cloneWithRows(arr),
                    this.currentPage = res.currentPage
                    this.totalPage = res.totalPage //总页数
                    this.isLoading = false,
                    this.pageType = res.pageType,
                    this.nextFlag = res.nextFlag,
                    this.currentPageStatus = this.isNextStep(res.pageType, res.totalPage, res.nextFlag, res.retList, this.currentPage)
                    this.strtNum = res.strtNum,
                    this.coreNum = res.coreNum
                })
            } else {
                runInAction(() => {
                    this.pageList = this.pageList.concat([]),
                    this.dateArr = [params.startDate, params.endDate],
                    this.dataSource = this.dataSource.cloneWithRows(arr),
                    this.currentPage = res.currentPage,
                    this.totalPage = res.totalPage,
                    this.pageType = res.pageType,
                    this.isLoading = false,
                    this.nextFlag = res.nextFlag,
                    this.currentPageStatus = this.isNextStep(res.pageType, res.totalPage, res.nextFlag, res.retList, this.currentPage)
                    this.strtNum = res.strtNum,
                    this.coreNum = res.coreNum
                })
            }
        })
    }
}
export default new PgTradingDetail()
