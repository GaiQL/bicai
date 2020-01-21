import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import { Picker, List, TextareaItem, Modal, Accordion } from 'antd-mobile';
import { Images, imgSrc } from 'Common/config/index'
import { BottomColumn } from 'Common/publicCommon/index'
import Store from './store'
import IconSvg, { IconCheck } from './IconSvg'
import { descFn } from '../../publicCommon/util'
import { BIZ_TYPE } from "Common/config/params.enum";
import { session } from "Common/utils/store"
import { openInfoReverse } from 'Common/Plugins/recordLogInfo'
import { chooseProfessionBtn, choseBankCardBtn } from 'Common/Plugins/recordLogInfo'
import {RenderProf} from './compoent'
import { useState } from 'react';
/**
 * @param IName 姓名
 * @param IDcard 身份证号码
 * @param ISignDate 签发日期
 * @param IDdate 身份证有效期
 * @param ISingOffice 签发机关
 * @param ISex 性别
 * @param INation 民族
 * @param IAddress 联系地址
 * @param IProf 职业
 * @param IBank 银行卡
 * @param Idisabled 联系地址是否可以修改
 */
interface IProps {
    IName?: Boolean,
    IDcard?: Boolean,
    ISignDate?: Boolean,
    IDdate?: Boolean,
    ISingOffice?: Boolean,
    ISex?: Boolean,
    INation?: Boolean,
    IAddress?: Boolean,
    IProf?: Boolean,
    IBank?: Boolean,
    Idisabled?: Boolean,
    Industry?: Boolean
    store?: any, //
    history?: any,
    location?: any,
}


@observer
class FinishOpenFlow extends React.Component<IProps, any> {

    state = {
        sexVal: ['女'],
        nationVal: ['汉'],
        addressTit: false,
        bankCardFlag: false,
        bankInd: null,
        flagText: false
    }
    selectImg = Images.select
    selectedImg = Images.selected
    autoFocusInst = null
    Store = Store
    //配置项
    Config = {
        IName: true, // 姓名
        IDcard: true, // 身份证号
        ISignDate: true, // 签发日期
        IDdate: true, // 身份证有效期
        ISingOffice: true, // 签发机关
        ISex: true, // 性别
        INation: true, // 民族
        IAddress: true, // 联系地址
        IProf: true, // 职业
        IBank: true, // 银行卡
        Idisabled: true, // 联系地址是否可以修改
        Industry: false, // 行业
        ILiveAddress: false // 居住地址
    }
    onCloseBank(val, ind) {
        if (val && val.supportFlag == 0) return // 不支持
        if (typeof ind == 'number') {
            this.setState({
                bankInd: ind
            })
        }
        this.setState({
            bankCardFlag: false,
        })
        let { getBank } = this.Store
        if (val) {
            getBank(val)
        }
        this.ModalHelper().beforeClose('open-modal')
    }


    addNewBank() {
        let { realName, userCardId, loginPhoneNum } = this.Store
        this.ModalHelper().beforeClose('open-modal')
        this.props.history.push(`/addNewBank?type=openAddBank&name=${realName}&idCard=${userCardId}&loginPhoneNum=${loginPhoneNum}`)
    }

    //公共打开弹框
    showModal = (showFlag) => {
        console.log('公共打开弹框', showFlag);
        try {
            chooseProfessionBtn()
            choseBankCardBtn()
        } catch (err) {

        }
        this.setState({
            [showFlag]: true
        })
        this.ModalHelper().afterOpen('open-modal')
    }

    ModalHelper() {
        var scrollTop;
        return {
            afterOpen(bodyCls) {
                scrollTop = document.scrollingElement.scrollTop;
                document.body.classList.add(bodyCls);
                document.body.style.top = -scrollTop + 'px';
            },
            beforeClose(bodyCls) {
                document.body.classList.remove(bodyCls);
                // scrollTop lost after set position:fixed, restore it back.
                document.scrollingElement.scrollTop = scrollTop;
            }
        };
    }

    componentDidMount() {
        let { initData, getNewBank } = this.Store

        try {
            openInfoReverse()
        } catch (err) {
        }

        initData()
        getNewBank(this.props.location.state)


    }

    //基础信息
    renderState(name, val, flag) {
        return flag ? <p><span>{name}</span><span>{val}</span></p> : null
    }

    //性别选择组件
    renderPickerSex(flag) {
        let { sexList, onChangeSex, sexVal } = this.Store
        return flag ? <Picker
            data={sexList}
            value={sexVal}
            cols={1}
            onChange={(val) => onChangeSex(val)}
        >
            <List.Item arrow="horizontal">性别</List.Item>
        </Picker> : null
    }

    //选择民族组件
    renderPickerNation(flag) {
        let { nationList, onChangeNation, nationVal } = this.Store
        return flag ? <Picker
            data={nationList}
            value={nationVal}
            cols={1}
            onChange={(val) => onChangeNation(val)}
        >
            <List.Item arrow="horizontal">民族</List.Item>
        </Picker> : null
    }

    /**
     * 截取地址长度
     **/
    comAddRess(len) {
        let { flagText } = this.state
        if (len.length <= 13) {
            return len
        } else {
            return flagText ? len : len.slice(0, 10) + "..."
        }
    }
    //地址
    renderStateAddress(flag) {
        let { getAddress, address } = this.Store
        let { Idisabled } = this.Config
        // let { Idisabled } = this.props
        if (Idisabled) {
            return flag ? <div className='openPerfection-info-address' style={{ alignItems: "flex-start" }}>
                <span style={{ paddingTop: "9px", lineHeight: "26px", paddingBottom: "9px" }}>联系地址</span>
                <span style={{ textAlign: "right", padding: "10px 0", lineHeight: "22px", color: "#999" }}>
                    {address}
                </span>
            </div> : null
        } else {
            return flag ? <div className='openPerfection-info-address'>
                <span style={{ paddingTop: "12px" }}>联系地址</span>
                <span style={{ paddingTop: "7px", paddingBottom: "7px" }}>
                    <TextareaItem
                        className="text-area"
                        value={this.comAddRess(address)}
                        placeholder='请填写联系地址'
                        data-seed="logId"
                        ref={el => this.autoFocusInst = el}
                        autoHeight
                        onClick={() => {
                            this.setState({
                                flagText: true
                            })
                        }}
                        onChange={(val) => {
                            getAddress(val)
                        }}
                    />
                </span>
            </div> : null
        }
    }

    // 个人信息组件
    renderStateProf(flag) {
        let { IProf, Industry, ILiveAddress } = this.Config
        let {industryVal ,dutyList,industryList,dutyDefalutSelectStatus,industryDefalutSelectStatus} = this.Store
        let { getSelectItem } = this.Store
        return flag ?
            <div>
                {/* 完善个人信息 */}
                <p className='openPerfection-tit'>完善个人信息</p>
                <div className="openPerfection-info-pres">
                    {/*居住地址*/}
                    {this.renderLiveAddress(ILiveAddress)}
                    {/*居住地址自动填入联系地址*/}
                    {this.renderLiveAddressRadio(ILiveAddress)}
                    {
                        IProf? <RenderProf {...{
                            defalutSelectStatus:dutyDefalutSelectStatus,
                            leftTitle: '职业',
                            list:dutyList,
                            name:'dutyName',
                            code:'dutyCode',
                            titleName: '职业列表',
                            selectClick:(...agru)=>{getSelectItem('dutyFlag',...agru)}
                        }}/>:null
                    }

                    {
                        Industry ? <RenderProf {...{
                            defalutSelectStatus:industryDefalutSelectStatus,
                            leftTitle: '行业',
                            value: industryVal,
                            list:industryList,
                            name:'industryName',
                            code:'industryCode',
                            titleName: '行业列表',
                            selectClick:(...agru)=>{getSelectItem('industryFlag',...agru)}
                        }}/> : null
                    }

                </div>
            </div> : null
    }
    /**
     * 新增居住地点
     **/
    renderLiveAddress(flag) {
        let { getLiveAddress, residentAddress, autoEnterResidentAddressFlag } = this.Store
        return flag ? <div className='openPerfection-info-address'>
            <span style={{ paddingTop: "12px" }}>居住地址</span>
            <span style={{ paddingTop: "7px", paddingBottom: "7px" }}>
                <TextareaItem
                    count={50}
                    className="text-area"
                    value={this.comAddRess(residentAddress)}
                    placeholder='请填写'
                    data-seed="logId"
                    ref={el => this.autoFocusInst = el}
                    autoHeight
                    disabled={autoEnterResidentAddressFlag ? true : false}
                    onClick={() => {
                        this.setState({
                            flagText: true
                        })
                    }}
                    onChange={(val) => {
                        getLiveAddress(val)
                    }}
                />
            </span>
        </div> : null
    }
    renderLiveAddressRadio(flag) {
        let { changeAutoEnterResidentAddress, autoEnterResidentAddressFlag } = this.Store
        return flag ? <div className="openPerfection-info-addressRadio">
            <span>与身份证地址相同</span>
            <i onClick={() => changeAutoEnterResidentAddress()}><img src={autoEnterResidentAddressFlag ? this.selectedImg : this.selectImg} alt="" /></i>
        </div> : null
    }

    //选择银行卡组件
    renderStateBank(flag) {
        let { bankName } = this.Store
        return flag ? <div className='openPerfection-job'>
            <p>
                <span>银行卡</span>
                <span onClick={(e) => {
                    this.showModal('bankCardFlag')
                }} style={{
                    color: bankName != '请添加' && '#666666'
                }}>{bankName}
                    <i style={{ position: "relative", top: "1px" }}><IconSvg /></i>
                </span>
            </p>
        </div> : null
    }

    componentWillUnmount() {
        session.remove("IdCardFrontPhoneOcrData")
        // if (this.autoFocusInst) this.autoFocusInst.clearInput()
    }

    render() {
        let {
            address,
            signOrg,
            realName,
            signAndIssueDate,
            cardExpireDate,
            bindCardList,
            nextStep,
            userCardId,
            isDisabled,
            isHttp,
        } = this.Store
        let { bankCardFlag, bankInd, } = this.state
        let {
            IName,//
            IDcard,//
            ISignDate,
            IDdate,
            ISingOffice,
            ISex,
            INation,
            IAddress,
            IProf,
            IBank,
            Industry
        } = this.Config

        return <div className='openPerfection'>
            {/* 头部 */}
            <Headers>完善开户信息</Headers>
            {/* 提示信息 */}
            <p className='openPerfection-tit'>核实个人信息</p>
            {/* 个人信息 */}
            <div className='openPerfection-info'>
                <div className='openPerfection-info-default'>
                    {
                        this.renderState('姓名', realName, IName)
                    }
                    {
                        this.renderState('身份证号码', userCardId, IDcard)
                    }
                    {
                        this.renderState('签发日期', signAndIssueDate, ISignDate)
                    }
                    {
                        this.renderState('身份证有效期', cardExpireDate, IDdate)
                    }
                    {
                        this.renderState('签发机关', signOrg, ISingOffice)
                    }
                    {/* 性别选择 */}
                    {
                        this.renderPickerSex(ISex)
                    }
                    {/* 民族选择 */}
                    {
                        this.renderPickerNation(INation)
                    }
                    {/* 地址 */}
                    {
                        this.renderStateAddress(IAddress)
                    }
                </div>
            </div>
            {/* 个人信息 职业/行业 */}
            {
                this.renderStateProf(IProf || Industry)
            }
            {/* 绑定一张常用储蓄卡，作为转入本产品的付款方式 */}
            <p className='openPerfection-tit'>绑定一张常用储蓄卡，作为转入本产品的付款方式</p>
            {/* 银行卡 */}
            {
                this.renderStateBank(IBank)
            }

            {/* 选择银行卡弹框 */}
            {this.renderBankModal(bankCardFlag, { list: bindCardList, selectId: bankInd })}

            {/* 下一步按钮 */}
            <div className='openPerfection-confirm'>
                <BcButton isDisabled={isHttp == "close" ? isDisabled(IProf) : true}
                    onClick={() => nextStep()}>下一步</BcButton>
            </div>
            <BottomColumn type='long' />
        </div>
    }
    /**
     * 银行卡选择弹窗
     * @param show
     * @param list
     * @param selectId
     */
    renderBankModal(show, { list, selectId }) {
        return <Modal
            className='bank-card'
            popup
            visible={show}
            transparent
            animationType="slide-up"
            title={<div className='bank-card-tit add-tit'>
                <span onClick={this.onCloseBank.bind(this, null)}>
                    <img src={require('Common/assets/images/close.png')} alt="" /></span>
                <span>选择绑定卡</span>
                <span></span></div>}
            maskClosable={false}
            onClose={this.onCloseBank.bind(this)}
        >
            <div style={{ height: '100%' }}>
                <div className='bank-card-list'>
                    {
                        list.map((item, ind) => {
                            let {
                                bankCardQuotaDescDto
                            } = item
                            let { dayDesc, monthDesc, availableDesc } = descFn(BIZ_TYPE.open, bankCardQuotaDescDto)
                            return <div style={{ opacity: item.supportFlag == '0' ? 0.5 : 1 }} key={ind}
                                className={'bank-card-item'}
                                onClick={
                                    this.onCloseBank.bind(this,
                                        item, ind)}
                            >
                                <p><img src={imgSrc + item.bankLogoUrl} alt="" /></p>
                                <p>
                                    <span>{item.bankName}储蓄卡({item.bankCardNum.substring(item.bankCardNum.length - 4)})</span>
                                    {
                                        item.supportFlag == 0 ? <span>{availableDesc}</span> : null
                                    }
                                    {
                                        item.supportFlag == 1 && dayDesc ? <span>{dayDesc}</span> : null
                                    }
                                    {
                                        item.supportFlag == 1 && monthDesc ? <span>{monthDesc}</span> : null
                                    }

                                </p>
                                <p>
                                    <i style={{ display: selectId == ind ? "block" : "none" }}><IconCheck /></i>
                                </p>
                            </div>
                        })
                    }
                </div>
                <div className="add-bank-card" onClick={this.addNewBank.bind(this)}>
                    <p>
                        <span><img src={require('Common/assets/images/bank.png')} alt="" /></span>
                        <span>添加银行卡</span>
                        <IconSvg wid='17' hte='17' />
                    </p>
                </div>
            </div>
        </Modal>
    }
}


export default FinishOpenFlow
