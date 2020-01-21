import React from 'react'
import { observer, inject } from 'mobx-react'
import { ActionSheet } from 'antd-mobile'
import {apiFactory} from 'Common/api/bank'
import './style.scss'
import webConfig from 'src/web.config.json'
import { session } from "Common/utils/store";
import IconSvg from './IconSvg'
import { imgSrc } from "Common/config";
import { commonStore } from 'Common/pages/store'
import { runInAction } from "mobx";

const viewJudge = (bottomBox) => {
    let parentDom = bottomBox.parentNode;
    if (parentDom.className) {
        if (/am-list-view-scrollview$/.test(parentDom.className)) {
            return 'listView';
        } else {
            return viewJudge(parentDom);
        }
        return
    } else {
        return 'generalView'
    }
}

interface ComponentProps {
    /**
     * UI类型，默认为空，不展示;
     * @param long  公司Logo + 服务热线；
     * 
     * @param tran  服务热线 + 工作时间；
     * 
     * @param public  如有疑问，请关注微信公众号bicaikefu留言；
    */
    type?: '' | 'tran' | 'long' | 'public'; //ui类型

    store?: any;
}

interface ComponentState {
    reast: boolean,
    top: string,
    hotLine: Array<string>,
    serviceTime: string,
    orgLogoUrl: string,
    orgName: string,
    showOnoff:boolean
}

/**
 * 
 * 底部组件在普通页面中要放在一级子元素下，长列表中写在listView标签中；
 * 页面布局时底部组件同级元素不要发生高度塌陷的情况，否则内容高度无法计算准确；
 * 
 * @class BottomColumn  公共底部栏；
 * 
 * @param type  UI类型；
 * 
*/
@inject('store')
@observer
class BottomColumn extends React.Component< ComponentProps, ComponentState >{
    ApiBank = apiFactory('v2')
    bottomBox = null;
    htmlFontSize = 0;
    constructor(props) {
        super(props);
        this.state = {
            reast: true,
            top: 'auto',
            hotLine: [],
            serviceTime: "",
            orgLogoUrl: null,
            orgName: "",
            showOnoff:false
        }
        this.bottomBox = React.createRef();
        this.htmlFontSize = parseInt(getComputedStyle(document.getElementsByTagName('html')[0]).fontSize);
    }
    initVal(){
        const res = JSON.parse(session.get('bankData')) || {}
        if (Object.keys(res).length != 0) {
            this.setState({
                hotLine: res.custServiceHotLine,
                serviceTime: res.custServiceTime,
                orgLogoUrl: res.orgLogo,
                orgName: res.orgName
            })
        }
    }
    componentDidMount() {

        const nativeOrgId = session.get('nativeOrgId')
        const orgId = session.get('orgId') //兼容线上环境
        let { initialHeight } = commonStore

        if (orgId) {
            if ( nativeOrgId == orgId) {
                this.initVal()
            } else {
                this.getVal()
            }
        } else {
            if ( nativeOrgId == webConfig.orgId) {
                this.initVal()
            } else {
                this.getVal()
            }
        }

        // this.bottomBox.parentDom.style.display = 'flex';
        this.bottomBox.current.parentNode.style.flexDirection = 'column';
        this.bottomBox.current.parentNode.style.height = 'auto';
        this.bottomBox.current.parentNode.style.width = '100%';
        this.bottomBox.current.parentNode.style.display = 'flex';

        // HW进入webview的时候有时会有几秒的停顿，获取不到 innerHeight 的情况，
        if( !initialHeight ){
            if( window.innerHeight ){
                runInAction(()=>{
                    commonStore.initialHeight =  window.innerHeight;
                    this.bottomBoxMinHeight( window.innerHeight );
                    this.setState({ showOnoff:true })
                })
            }else{
                let timer = setInterval(()=>{
                    if( window.innerHeight ){
                        runInAction(()=>{
                            commonStore.initialHeight =  window.innerHeight;
                            this.bottomBoxMinHeight( window.innerHeight );
                            this.setState({ showOnoff:true })
                        })
                        clearInterval( timer )
                    }
                },1000)
            }
        }else{
            this.bottomBoxMinHeight( initialHeight );
            this.setState({ showOnoff:true })
        }

    }
    bottomBoxMinHeight = ( initialHeight ) => {
        this.bottomBox.current.parentNode.style.minHeight = viewJudge( this.bottomBox.current ) == 'listView'?'100%':initialHeight+'px';
    }
    async getVal() {
        const res: any = await this.ApiBank.apiOrgHotLineAndServerTime()
        if (Object.keys(res).length != 0) {
            session.set('nativeOrgId', res.orgId)
            session.set("bankData", JSON.stringify(res))
            this.setState({
                hotLine: res.custServiceHotLine,
                serviceTime: res.custServiceTime,
                orgLogoUrl: res.orgLogo,
                orgName: res.orgName
            })
        }

    }
    callPhone(val, buttonIndex) {
        let { serviceTime } = this.state;
        if ( serviceTime && !buttonIndex ) { return Promise.reject() };
        if (val != '取消') {
            window.location.href = `tel:${val}`;
        }
    }
    callHotline = () => {
        let { hotLine, serviceTime } = this.state;
        let BUTTONS = serviceTime?[serviceTime,...hotLine,'取消']:[...hotLine,'取消'];

        let actionSheetOption:any = {
            className: "action-sheet",
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            maskClosable: true,
        }
        if( serviceTime ){ actionSheetOption.destructiveButtonIndex = 0; }
        ActionSheet.showActionSheetWithOptions(actionSheetOption,(buttonIndex) => this.callPhone(BUTTONS[buttonIndex], buttonIndex));
    }
    calculateChildcomponentHeight = ( height ) => {
        return (height/this.htmlFontSize).toFixed(1)+'rem';
    }
    render() {
        let { type } = this.props;
        let { hotLine, serviceTime, orgLogoUrl, orgName,showOnoff } = this.state;
        let { callHotline,calculateChildcomponentHeight } = this;
        let propsData = { type, callHotline, hotLine, serviceTime, orgLogoUrl, orgName ,calculateChildcomponentHeight }
        return (
            <div 
                style={{
                    opacity:showOnoff?1:0,
                    flexGrow:1,
                    flexDirection: 'column-reverse',
                    display:'flex'
                }}
                ref={this.bottomBox}
            >
                <TypeSwitch {...propsData} />
            </div>
        )
    }
}

//   添加新的子组件UI时，最外层给一个高度，营口等其他分支项目因为css后加载didmount中无法拿到底部组件准确高度；
const TypeSwitch = (props) => {
    let { type } = props;
    let ComponentType = null;
    switch (type) {
        case 'tran':
            ComponentType = <Transverse {...props} />
            break;
        case 'long':
            ComponentType = <Longitudinal {...props} />
            break;
        case 'public':
            ComponentType = <Public {...props} />
            break;
        default:
            break;
    }
    return ComponentType;
}

const Public = (props) => {
    let { calculateChildcomponentHeight } = props;
    return (
        <div className="BankDetail-hotLine" style={{height:calculateChildcomponentHeight(78)}}>
            <p>如有疑问，请关注微信公众号bicaikefu留言</p>
        </div>
    )
}

const Transverse = (props) => {
    let { hotLine, serviceTime, calculateChildcomponentHeight } = props
    console.log( hotLine );
    return (
        <div
            className="BankDetail-hotLine"
            onClick={hotLine ? props.callHotline : () => { }}
            style={{height:calculateChildcomponentHeight(78)}}
        >
            <p>
                <IconSvg/>
                <span>银行服务热线{hotLine[0]}</span>
            </p>
            <p>
                <span>{serviceTime}</span>
            </p>
        </div>
    )
}

const Longitudinal = (props) => {
    let { orgLogoUrl, orgName, calculateChildcomponentHeight } = props
    return (
        <div className="BottomColumn-hotLine" style={{height:calculateChildcomponentHeight(60)}}>
            <p>
                <img src={imgSrc+orgLogoUrl} />
                <span>{orgName}</span>
            </p>
            <p></p>
            <p onClick={orgLogoUrl ? props.callHotline : () => { }}>
                <IconSvg/>
                <span>银行服务热线</span>
            </p>
        </div>
    )
}

export default BottomColumn
