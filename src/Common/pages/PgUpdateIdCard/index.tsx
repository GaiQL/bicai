import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import { InputItem, DatePicker, TextareaItem, List, Picker, DatePickerView } from 'antd-mobile';
import Tool from 'Common/utils/Tool'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import Store from './store'
import { ActionSheet } from 'antd-mobile'
import ImagesInput from './ImagesInput'
import IconSvg from './IconSvg'
import { session } from 'Common/utils/store'

/*
    flagName:姓名
    flagCard：身份证号
    flagAuthority：签发机关
    flagNation：民族
    flagGender：性别
    flagBirthday：出生日期
    flagPickerValueStart：签发日期
    flagPickerValueEnd：身份证有效期
    flagAdress：联系地址
*/

interface IProps {
    flagName?: boolean, // flagName:姓名
    flagCard?: boolean, // flagCard：身份证号
    flagAuthority?: boolean, // flagAuthority：签发机关
    flagNation?: boolean, // flagNation：民族
    flagGender?: boolean, // flagGender：性别
    flagBirthday?: boolean, // flagBirthday：出生日期
    flagPickerValueStart?: boolean, // flagPickerValueStart：签发日期
    flagPickerValueEnd?: boolean, // flagPickerValueEnd：身份证有效期
    flagAdress?: boolean, // flagAdress：联系地址
    UpdateIdCard?: any
}


@observer
class UpdateIdCard extends React.Component<IProps, any> {
    state = {
        userNameShow: false, //姓名
        idCardShow: false, //身份证号
        visibleStart: false, //
        visibleEnd: false,
        birthdayShow: false, //
        signOrgShow: false,
        addressShow: false,
        districtStart: [],
        districtEnd: [],
        sexVal: ['女'],
        nationVal: ['汉'],
        birthdayStart: [],
        visibleBrithday: false,
        flagText: false
    }
    Config = {
        bottomShow: true,
        flagName: true,
        flagCard: true,
        flagAuthority: true,
        flagNation: true,
        flagGender: true,
        flagBirthday: true,
        flagPickerValueStart: true,
        flagPickerValueEnd: true,
        flagAdress: true,
        isFlag: false // 是否显示人脸认证
    }
    Store = Store

    //获取天数
    getDaysInMonth(year, month) {
        var arr = []
        month = parseInt(month, 10);  //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
        var temp = new Date(year, month, 0);
        for (var i = 1; i <= temp.getDate(); i++) {
            arr.push({
                value: i,
                label: i < 10 ? "0" + i + '日' : i + '日',
            })
        }
        return arr
    }

    //获取月份
    getMonths(year) {
        var arr = []
        for (var i = 1; i <= 12; i++) {
            arr.push({
                value: i,
                label: i < 10 ? "0" + i + '月' : i + '月',
                children: this.getDaysInMonth(year, i)
            })
        }
        return arr
    }

    //获取年份
    getYear(start?, end?, isLong?) {
        if (isLong) {
            var endArr: any = [{
                value: '长期',
                label: '长期',
                children: []
            }]
            for (var i = end; i >= start; i--) {
                endArr.unshift({
                    value: i,
                    label: i + "年",
                    children: this.getMonths(i)
                })
            }
            return endArr
        } else {
            var startArr = []
            for (var i = end; i <= start; i++) {
                startArr.unshift({
                    value: i,
                    label: i + "年",
                    children: this.getMonths(i)
                })
            }
            return startArr
        }
    }

    getDate() {
        let nowYear = new Date().getFullYear()
        this.setState({
            birthdayStart: this.getYear(1950, nowYear + 30, true),
            districtStart: this.getYear(nowYear, nowYear - 30),
            districtEnd: this.getYear(nowYear, nowYear + 30, true)
        })
    }

    componentDidMount() {
        let { initData } = this.Store
        initData()
        this.getDate()
    }

    componentWillUnmount(): void {

    }

    autoFocusInst = null


    imagesInput = (onChange) => {

    }

    render() {
        let { imgToBase, emblemImg, figureImg, submitFn, observeConfirm, isShowFace } = this.Store

        let { flagName, flagCard, flagAuthority, flagNation, flagGender, flagBirthday, flagPickerValueStart, flagPickerValueEnd, flagAdress, isFlag } = this.Config
        return <div className='UpdateIdCard'>
            {/* 头部 */}
            <Headers>更新身份证</Headers>
            <div className='UpdateIdCard-img'>
                <p className='UpdateIdCard-tit'>请上传您的中国第二代居民身份证原件</p>

                <p className='UpdateIdCard-upload'>
                    <span className='UpdateIdCard-bg'><img src={figureImg} alt="" /></span>
                    <span className='UpdateIdCard-camera'>
                        <ImagesInput onChange={(e) => {
                            imgToBase(e, 'figure')
                        }} />
                    </span>
                </p>
                <p className='UpdateIdCard-tip'>上传人像页照片</p>
                <p className='UpdateIdCard-upload'>
                    <span className='UpdateIdCard-bg'><img src={emblemImg} alt="" /></span>
                    <span className='UpdateIdCard-camera'>
                        <ImagesInput onChange={(e) => {
                            imgToBase(e, 'emblem')
                        }} />
                    </span>
                </p>
                <p className='UpdateIdCard-tip'>上传国徽页照片</p>
            </div>
            <div className='UpdateIdCard-info'>
                {/* 姓名 flagName*/}
                {
                    this.renderName(flagName)
                }
                {/* 身份证号 flagCard*/}
                {
                    this.renderCard(flagCard)
                }
                {/* 民族选择 */}
                {
                    this.renderNation(flagNation)
                }
                {/* 性别选择 */}
                {
                    this.renderGender(flagGender)
                }
                {/* 出生日期 */}
                {
                    this.renderBirthday(flagBirthday)
                }
                {/* 签发日期 */}
                {
                    this.renderPickerValueStart(flagPickerValueStart)
                }
                {/* 身份证有效期 */}
                {
                    this.renderPickerValueEnd(flagPickerValueEnd)
                }
                {/* 签发机关 flagCard*/}
                {
                    this.renderIssuingAuthority(flagAuthority)
                }
                {/* 联系地址 flagCard*/}
                {
                    this.renderAddress(flagAdress)
                }
            </div>
            {/* 需不需要人脸认证 isShowFace = 1需要 等于 0 不需要 */}
            {
                isFlag && isShowFace == 1 ?  <div className='isNeedFace'>{this.faceIdentification()}</div> : null
            }
            <div className='UpdateIdCard-confirm'>
                <BcButton isDisabled={observeConfirm} onClick={submitFn}>更新</BcButton>
            </div>
            {this.Config.bottomShow ? <BottomColumn type='long' /> : null}
        </div>
    }

    //姓名组件
    renderName(flag) {
        let { realName, changeName, emblemImgBase, figureImgBase, } = this.Store

        return flag ? <div>
            <span>姓名</span>
            <span> <InputItem
                value={realName}
                disabled={emblemImgBase == '' || figureImgBase == ''}
                style={{ color: "#666666", opacity: 1 }}
                onFocus={() => this.setState({ userNameShow: true })}
                onBlur={() => this.setState({ userNameShow: false })}
                onChange={(e) => changeName(e)}
            /></span>
        </div> : null
    }

    //身份证号组件
    renderCard(flag) {
        let { realName, userCardId, changeIdCard, emblemImgBase, figureImgBase } = this.Store

        let name = realName ? realName : ''
        let card = userCardId ? userCardId : ''
        return flag ? <div>
            <span>身份证号码</span><span>
                <InputItem
                    value={card}
                    disabled={emblemImgBase == '' || figureImgBase == ''}
                    style={{ color: "#666666", opacity: 1 }}
                    onFocus={() => this.setState({ idCardShow: true })}
                    onBlur={() => this.setState({ idCardShow: false })}
                    onChange={(e) => changeIdCard(e)}
                />
            </span>
        </div> : null
    }

    //民族组件
    renderNation(flag) {
        let { nationList, nationVal, changeNation, emblemImgBase, figureImgBase } = this.Store
        return flag ? <Picker
            data={nationList}
            value={nationVal}
            disabled={emblemImgBase == '' && figureImgBase == ''}
            cols={1}
            extra=' '
            onChange={(val) => changeNation(val)}
        >
            <List.Item arrow="horizontal">民族</List.Item>
        </Picker> : null
    }

    //性别组件
    renderGender(flag) {
        let { sexList, gender, onChangeSex, emblemImgBase, figureImgBase } = this.Store
        return flag ? <Picker
            data={sexList}
            value={gender}
            disabled={emblemImgBase == '' && figureImgBase == ''}
            cols={1}
            extra=' '
            onChange={(val) => onChangeSex(val)}
            onOk={v => {
                console.log(v)
            }}
        >
            <List.Item arrow="horizontal">性别</List.Item>
        </Picker> : null
    }

    //出生日期
    renderBirthday(flag) {
        let { birthday, changeBirthday, emblemImgBase, figureImgBase } = this.Store
        return flag ?
            <div>
                <span>
                    出生日期
                </span>
                <span>
                    <Picker
                        visible={this.state.visibleBrithday}
                        data={this.state.birthdayStart}
                        value={birthday}
                        format={(val) => {
                            if (val[0] == '长期') {
                                return val
                            } else {
                                if (val[0]) {
                                    return [`${Tool.trimText(val[0].toString())}-${Tool.trimText(val[1].toString())}-${Tool.trimText(val[2].toString())}`]
                                }
                            }
                        }}
                        disabled={emblemImgBase == '' && figureImgBase == ''}
                        extra=" "
                        onChange={v => changeBirthday(v)}
                        onOk={() => this.setState({ visibleBrithday: false })}
                        onDismiss={() => this.setState({ visibleBrithday: false })}
                    >
                        <List.Item onClick={() => this.setState({ visibleBrithday: true })}></List.Item>
                    </Picker>
                </span>
            </div>
            : null
    }

    //签发日期
    renderPickerValueStart(flag) {
        let { pickerValueStart, changeValueStart, emblemImgBase, figureImgBase } = this.Store

        return flag ? <div>
            <span>
                签发日期
            </span>
            <span>
                <Picker
                    disabled={emblemImgBase == '' && figureImgBase == ''}
                    extra=' '
                    visible={this.state.visibleStart}
                    data={this.state.districtStart}
                    value={pickerValueStart}
                    format={(val) => {
                        if (val[0] == '长期') {
                            return val
                        } else {
                            if (val[0]) {
                                return [`${Tool.trimText(val[0].toString())}-${Tool.trimText(val[1].toString())}-${Tool.trimText(val[2].toString())}`]
                            }
                        }
                    }}
                    onChange={v => changeValueStart(v)}
                    onOk={() => this.setState({ visibleStart: false })}
                    onDismiss={() => this.setState({ visibleStart: false })}
                >
                    <List.Item onClick={() => this.setState({ visibleStart: true })} />
                </Picker>
            </span>
        </div> : null
    }

    //身份证有效期
    renderPickerValueEnd(flag) {
        let { pickerValueEnd, changeValueEnd, emblemImgBase, figureImgBase } = this.Store
        return flag ? <div>
            <span>
                身份证有效期
            </span>
            <span>
                <Picker
                    disabled={emblemImgBase == '' && figureImgBase == ''}
                    extra=' '
                    visible={this.state.visibleEnd}
                    data={this.state.districtEnd}
                    value={pickerValueEnd}
                    format={(val) => {
                        // console.log(val, '身份证有效期');

                        if (val[0] == '长期') {
                            return val
                        } else {
                            if (val[0]) {
                                return [`${Tool.trimText(val[0].toString())}-${Tool.trimText(val[1].toString())}-${Tool.trimText(val[2].toString())}`]
                            }
                        }
                    }}
                    onChange={v => changeValueEnd(v)}
                    onOk={() => this.setState({ visibleEnd: false })}
                    onDismiss={() => this.setState({ visibleEnd: false })}
                >
                    <List.Item onClick={() => this.setState({ visibleEnd: true })}></List.Item>
                </Picker>
            </span>
        </div> : null
    }

    //签发机关组件
    renderIssuingAuthority(flag) {
        let { signOrg, emblemImgBase, figureImgBase, changeIssuingAuthority } = this.Store
        return flag ? <div>
            <span>签发机关</span><span>
                <InputItem
                    value={signOrg}
                    style={{ color: "#666666", opacity: 1 }}
                    disabled={emblemImgBase == '' && figureImgBase == ''}
                    onFocus={() => this.setState({ signOrgShow: true })}
                    onBlur={() => this.setState({ signOrgShow: false })}
                    onChange={(e) => changeIssuingAuthority(e)}
                />
            </span>
        </div> : null
    }

    comAddRess(len) {
        let { flagText } = this.state
        if (len.length <= 13) {
            return len
        } else {
            return flagText ? len : len.slice(0, 10) + "..."
        }
    }

    //联系地址
    renderAddress(flag) {
        let { address, changeAddress, emblemImgBase, figureImgBase } = this.Store
        return flag ?
            <div className='upload-address'>
                <span style={{ paddingTop: "12px" }}>联系地址</span>
                <span style={{ paddingTop: "7px", paddingBottom: "7px" }}>
                    <TextareaItem
                        className="text-area"
                        value={this.comAddRess(address)}
                        style={{ color: "#666666", opacity: 1 }}
                        disabled={emblemImgBase == '' && figureImgBase == ''}
                        placeholder='auto focus in Alipay client'
                        data-seed="logId"
                        ref={el => this.autoFocusInst = el}
                        autoHeight
                        onClick={() => {
                            this.setState({
                                flagText: true
                            })
                        }}
                        onChange={(e) => changeAddress(e)}
                    />

                </span>

            </div>
            : null
    }

    // 人脸认证
    faceIdentification() {
        let { isLiveStatus, attestationInfo } = this.Store
        console.log(isLiveStatus,"isLiveStatus")
        return <div>
            <span>人脸认证</span>            
            {
                isLiveStatus != 1? 
                <p onClick={()=>attestationInfo()}>
                    <span className='place-attestation'>请认证</span>
                    <span style={{position: 'relative', top: '2px'}}><IconSvg/></span>
                </p> : 
                <p>
                    <span className='over-attestation'>已认证</span>
                    <span style={{position: 'relative', top: '2px'}}><IconSvg/></span>
                </p>
            }
        </div>
    }
}

export default UpdateIdCard
