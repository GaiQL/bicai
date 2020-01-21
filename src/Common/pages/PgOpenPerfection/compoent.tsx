import React from "react";
import IconSvg, {IconCheck} from './IconSvg'
import './style.scss'
import {chooseProfessionBtn, choseBankCardBtn} from 'Common/Plugins/recordLogInfo'
import {Picker, List, TextareaItem, Modal, Accordion} from 'antd-mobile';

// import Store from './store'

export interface renderProfPropsType {
    leftTitle: string,// 头部展示
    list: Record<string, any>,
    name: string, // 具体接口对应的汉字描述的key
    code: string, // 具体接口对应的职业或行业编码的key
    selectClick: Function, // 选中的回调函数
    defalutSelectStatus?:object,
    titleName: string // 列表标题
}

export interface renderProfStateType {
    modalFlag: boolean,//  选择框展示
    selectKey: string,//
    nowOneKey: string,
    selectValue: string, // 默认选择的值
    oneName: string, // 具体接口对应的汉字描述的key
    openKey: string, //

}

export type SELECT_FLAG = 'dutyFlag' | 'industryFlag'

/**
 *
 */
export class RenderProf extends React.Component<renderProfPropsType, renderProfStateType> {
    //
    state = {
        nowOneKey: '',
        modalFlag: false,
        selectKey: '',
        selectValue: '请选择',
        oneName: '',
        openKey: ''
    }

    // Store = Store

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
    componentWillMount(): void {
        let {defalutSelectStatus,name,code,} = this.props
        if(defalutSelectStatus[name]){
            this.setState({
                selectValue:defalutSelectStatus['defaultName'],
                selectKey:defalutSelectStatus[code],
                openKey:defalutSelectStatus['openKey'],
                oneName:defalutSelectStatus['oneName']
            })
        }
    }

    //公共打开弹框
    showModal = (showFlag) => {
        try {
            chooseProfessionBtn()
            choseBankCardBtn()
        } catch (err) {

        }
        this.setState({
            modalFlag: true
        })
        this.ModalHelper().afterOpen('open-modal')
    }

    handleChangeFn(options, list, eleCode) {
        this.setState({
            openKey: eleCode,
        })
        let {code, name} = options
        let inde = null
        list && list.map((item, ind) => {
            if ((item[code] == eleCode)) {
                inde = ind
            }
        })
        let now = list[inde] || {}
        if(JSON.stringify(now) == '{}' || !now.list || now.list && now.list.length<=0){
            this.setState({ // 初始化
                oneName: '',
                openKey:''
            },()=>{
                this.onCloseSelectModal(options, now)
            })
            return
        }
        this.onCloseSelectModal(options, now)   
    }

    onCloseSelectModal(options, item) {
        let {selectClick} = this.props
        let {code, name} = options
        if (!item) {
            // 选中的选项不存在
            this.setState({
                modalFlag: false,
            })
            return
        }
        console.log(item);
        if (JSON.stringify(item) == '{}' || item.list && item.list.length > 0) {
            // 有子列表
            this.setState({
                oneName: item[name] || ''
            })
        } else {
            let {openKey,oneName} = this.state
            this.setState({
                modalFlag: false,
            })
            let newName = (oneName ? (oneName + '-') : '') + item[name]
            this.setState({
                selectKey: item[code],
                selectValue: newName
            })
            item['openKey'] = openKey
            item['defaultName'] = newName
            item['oneName'] = oneName
            selectClick && selectClick(options, item) // 回调函数
            this.ModalHelper().beforeClose('open-modal')
        }

    }


    render(): React.ReactNode {
        let {leftTitle, list, code, name, titleName} = this.props
        let {selectValue} = this.state
        let {selectKey} = this.state
        let {modalFlag} = this.state
        return <>
            <div className='openPerfection-job'>
                <p>
                    <span>{leftTitle}</span>
                    <span onClick={() => {
                        this.showModal('dutyFlag')
                    }} style={{
                        color: selectValue != '请选择' && '#666666'
                    }}>
                        {selectValue.length > 8 ? selectValue.slice(0, 8) + "..." : selectValue}
                        <i style={{position: "relative", top: "1px"}}><IconSvg/></i>
                    </span>
                </p>
            </div>
            {/* 选择职业弹框 */}
            {this.renderSelectModal(modalFlag, {
                title: titleName,
                list: list,
                selectInd: selectKey,
                name,
                code,
                modalType: 'dutyFlag',
            })}
        </>
    }

    renderSelectModal(show, options) {
        let {title, list, selectInd, name, code} = options
        let {openKey} = this.state
        return <Modal
            className='duty'
            visible={show}
            transparent
            title={
                <div className='duty-tit'>
                    <span> </span>
                    <span>{title}</span>
                    <span className="duty-img" onClick={this.onCloseSelectModal.bind(this, options, null)}>
                        <img src={require('Common/assets/images/close.png')} alt=""/>
                    </span>
                </div>}
            maskClosable={false}
            // onClose={this.onCloseSelectModal.bind(this, options)}
        >
            {
                <Accordion accordion defaultActiveKey={openKey} openAnimation={{}} style={{overflow: 'scroll'}}
                           className="my-accordion" onChange={(e) => this.handleChangeFn(options, list, e)}>
                    {
                        list && list.map((item, ind) => {
                            if (item.list && item.list.length > 0) {
                                return (
                                    <Accordion.Panel key={item[code]} header={item[name]}>
                                        <List className="my-list">
                                            {
                                                item.list && item.list.map((sub) => {
                                                    return (<List.Item key={sub[code]}
                                                                       onClick={this.onCloseSelectModal.bind(this, options, sub)}>
                                                        <span className='second_text'>{sub[name]}</span>
                                                        <span style={{
                                                            display: selectInd == sub[code] ? "block" : "none",
                                                            paddingLeft: '10px',
                                                            height: '20px'
                                                        }}>
                                                            <IconCheck/>
                                                        </span>
                                                    </List.Item>)
                                                })
                                            }
                                        </List>
                                    </Accordion.Panel>
                                )

                            } else {
                                return (
                                    <Accordion.Panel key={item[code]} header={item[name]} showArrow={false}
                                                     className={selectInd == item[code] ? 'show' : 'hide'}>
                                    </Accordion.Panel>
                                )
                            }
                        })
                    }
                </Accordion>
            }
        </Modal>
    }
}
