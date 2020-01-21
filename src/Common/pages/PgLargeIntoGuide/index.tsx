import React from 'react'
import { observer } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import BottomColumn from 'Common/publicCommon/BottomColumn';
import { PhoneImage,Arrows,BackTop } from './IconSvg'
import { PglargeAmountsTransfer } from 'Common/pages/store';
import Store from './store'
import { commonStore } from 'Common/pages/store'

@observer
class LargeIntoGuide extends React.Component<any, any>{
    Store = Store;
    constructor( props ){
        super( props )
    }
    componentDidMount(){
        let { monitorTopNum,didMountInitialize } = this.Store;
        monitorTopNum();
        didMountInitialize();
    }
    render() {
        let { backTopOnoff,backTop,accountInfo,guidPageData } = this.Store;
        return (
            <div className="largeIntoGuideWrapper">
                <Headers>大额转入指引</Headers>
                <div className="largeIntoGuidePaddingSection">
                    <section>
                        <PhoneImage />
                        <span>手机转账</span>
                    </section>
                    <section>
                        {
                            guidPageData.infoList && guidPageData.infoList.map(( data,index )=>{
                                return ( <LargeIntoGuidePullDownModel data={ data } key={ index }/> )
                            })
                        }
                    </section>
                </div>
                <footer className="largeIntoGuideFooterButton">
                    <p>复制后，去其他银行的手机App转入资金到{ accountInfo.orgName }电子账号</p>
                    <div onClick={ ()=>{ PglargeAmountsTransfer.copyAccountNum( accountInfo.accountNum ) } }>复制电子账号</div>
                </footer>
                <BackTop className="largeIntoGuideBackTop" style={{ display:backTopOnoff?'block':'none' }} onClick={backTop}/>
                <BottomColumn type="long"/>
            </div>
        )
    }

}

@observer
class LargeIntoGuidePullDownModel extends React.Component<any,any>{
    constructor( props ){
        super( props )
        this.state = {
            showContentOnoff:false
        }
    }
    switchShowContentOnoff = () => {
        console.log( document.body )
        let { calculateBottomPosition } = commonStore;
        this.setState({
            showContentOnoff:!this.state.showContentOnoff
        })
        calculateBottomPosition();
    }
    render(){
        let { showContentOnoff } = this.state;
        let { data } = this.props;
        let { guidPageData } = Store;
        return (
            <div className="largeIntoGuidePullDownModel">
                <div>
                    <p style={{ display: data.ORDER == "1" ? 'block' : 'none' }}>{guidPageData.TITLE }</p>
                    <p>{data.ORDER}.{data.TYPE2_TITLE }</p>
                    <p>{data.CONTENT_DESCRIPTION }</p>
                </div>
                <div style={{ height:showContentOnoff?'auto':'0' }} >
                    <div dangerouslySetInnerHTML={{ __html: data.TEXT }}></div>
                </div>
                <footer onClick={ this.switchShowContentOnoff }>
                    <Arrows style={{ transform: `rotate(${showContentOnoff?180:0}deg)` }}/>
                    <p>{ showContentOnoff?'点击收起':'查看图文教程' }</p>
                </footer>
            </div>
        )
    }
}
export default LargeIntoGuide