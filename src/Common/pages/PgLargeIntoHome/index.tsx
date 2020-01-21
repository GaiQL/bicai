import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import { imgSrc } from 'Common/config/index'
import help from 'Common/utils/Tool'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { publicStore } from 'Common/pages/store'
import { First, Second, DarkSpot } from './IconSvg';
import Store from './store';

@observer
class LargeAmountsTransfer extends React.Component<any, any>{
    Store = Store;
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        let { didMountInitialize, changeTiedcardType } = this.Store;
        didMountInitialize();

        switch (this.props.btnMsg) {
            case "添加银行卡":
                changeTiedcardType(1); break;
            case "更换银行卡":
                changeTiedcardType(2); break;
            default: break;
        }

    }

    render() {
        let { bandCardInfo } = publicStore
        let { orgName } = bandCardInfo;
        let { supBank, changeCard, goLargeIntoGuide, copyAccountNum, tiedcardType } = this.Store;
        return <div className='large-amounts-transfer'>
            <Headers>大额转入</Headers>
            <div className="bg">
                <div className="info">
                    <img src={imgSrc + bandCardInfo.orgBgUrl} className="img" alt="" />
                    <h4>
                        <i><img src={imgSrc + bandCardInfo.orgLogo} alt="" /></i>
                        <span>{orgName}</span>
                        <b>***的账户</b>
                    </h4>
                    <p>{help.BankNo_Filter(bandCardInfo.bankElecAccountNum)}</p>

                </div>
            </div>
            <p className="largeReminder"> 当您通过绑定卡向电子账户充值时，由于限额而导致购买不便时，可以通过以下手机银行汇款的方式： </p>
            <div>
                <div className="largeWhiteSection">

                    <p className="largeWhiteSectionHeader"><First style={{ display: tiedcardType == 3 ? 'none' : 'block' }} /><span>使用已绑定卡转入</span></p>
                    <div className="largeWhiteSectionBox">
                        <div>
                            <DarkSpot />
                            <div>
                                <p>{orgName}电子账号：{bandCardInfo.bankElecAccountNum}</p>
                                <p>开户行：{orgName}</p>
                            </div>
                        </div>
                        <div>
                            <DarkSpot />
                            <div>
                                <p>复制{orgName}电子账号，去已绑定银行卡的手机银行APP将资金转入到{orgName}本人电子账号</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="largeWhiteSectionButton"
                        onClick={() => { copyAccountNum() }}
                    ><p>复制电子账号</p></div>
                    <div></div>

                </div>

                <div className="largeCardList">

                    {bandCardInfo.cardList && bandCardInfo.cardList.length ? <p className="largeCardListTitle">已绑定银行卡</p> : null}
                    {

                        bandCardInfo.cardList && bandCardInfo.cardList.map((e, index) => {
                            return (
                                <div className="largeCardListContent" key={index}>
                                    <div onClick={goLargeIntoGuide}>
                                        <div></div>
                                        <img src={imgSrc + e.bankLogoUrl} />
                                        <p>{e.bankName}</p>
                                        <div>
                                            <p>详细步骤</p>
                                            <div><span></span><span></span></div>
                                        </div>
                                        <img src={imgSrc + bandCardInfo.orgLogo} />
                                        <p>{orgName}电子账号</p>
                                    </div>
                                </div>
                            )
                        })

                    }

                </div>

            </div>
            <div className="largeWhiteSection" style={{ display: tiedcardType == 3 ? 'none' : 'block' }}>

                <p className="largeWhiteSectionHeader"><Second /><span>使用新卡转入</span></p>
                <div className="largeWhiteSectionBox">
                    <div>
                        <DarkSpot />
                        <div>
                            <p>您也可以添加一张新的银行卡，向{orgName}本人电子账号转入资金，请先添加这张银行卡</p>
                            <p style={{ color: '#508CEE' }} onClick={supBank}>查看支持银行</p>
                        </div>
                    </div>
                </div>
                <div className="largeWhiteSectionButton" onClick={changeCard}>
                    <p>{tiedcardType == 1 || bandCardInfo.cardList && !bandCardInfo.cardList.length ? '添加绑定卡' : '更换绑定卡'}</p>
                </div>
                <div></div>

            </div>
            <BottomColumn type='long'></BottomColumn>
        </div >
    }
}
export default LargeAmountsTransfer