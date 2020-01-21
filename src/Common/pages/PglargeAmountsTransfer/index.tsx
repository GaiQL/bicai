import React from 'react'
import { observer, inject } from 'mobx-react'
import './style.scss'
import { Toast } from 'antd-mobile';//ui组件
import Headers from 'Common/publicCommon/Headers'
import { imgSrc } from 'Common/config/index'
import help from 'Common/utils/Tool'
import copy from 'copy-to-clipboard';
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { publicStore } from 'Common/pages/store'
import Help from 'Common/utils/Tool'


@inject('store')
@observer
class LargeAmountsTransfer extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            bank: ''
        };
    }

    bankFn(val) {
        if (val.length > 0) {
            val = val.map((item) => {
                return item.bankName + "或";
            });
            let bankArr = Array.from(new Set(val)).join("")
            let bankStr = bankArr.substring(0, bankArr.length - 1)
            this.setState({
                bank: bankStr
            })
        }
    }

    supBank(){
        this.props.history.push("/bankList")
    }

    changeCard() {
        Help.StorageAddressBar()
        this.props.history.push('/boundBank?page=largeAmountsTransfer')
    }

    async componentDidMount() {
        let { apiBandCardFn } = publicStore
        //查询登录用户某机构绑定卡信息
        const res = await apiBandCardFn({bizType:'2',queryType:'0'})
        this.bankFn(res.cardList || [])
    }
    render() {
        let { bandCardInfo } = publicStore
        let { bank } = this.state
        let {btnMsg = '更换银行卡'} = this.props
        return <div className='large-amounts-transfer'>
            {/* 头部 */}
            <Headers>大额转入</Headers>
            <div className="bg">
                <div className="info">
                    <img src={imgSrc + bandCardInfo.orgBgUrl} className="img" alt="" />
                    <h4>
                        <i><img src={imgSrc + bandCardInfo.orgLogo} alt="" /></i>
                        <span>{bandCardInfo.orgName}</span>
                        <b>***的账户</b>
                    </h4>
                    <p>{help.BankNo_Filter(bandCardInfo.bankElecAccountNum)}</p>

                    <div className="fr-copy">
                        <div className="copy" onClick={() => {
                        copy(bandCardInfo.bankElecAccountNum)
                        Toast.info('复制成功',1)
                    }}>复制卡号</div>
                    </div>
                </div>
            </div>
            <div className="explain">
                <h4>使用已绑定卡大额转入</h4>
                <p>
                    <svg width={4} height={4} className='rac'>
                        <circle cx="2" cy="2" r="2" fill="#666666"/>
                    </svg>
                    请点击「复制卡号」按键进行复制{bandCardInfo.orgName}电子账号</p>
                <p>
                    <svg width={4} height={4} className='rac'>
                        <circle cx="2" cy="2" r="2" fill="#666666"/>
                    </svg>
                    打开已绑定卡{bank}手机银行APP</p>
                <p>
                    <svg width={4} height={4} className='rac'>
                        <circle cx="2" cy="2" r="2" fill="#666666"/>
                    </svg>
                    使用手机银行APP「转账」功能汇款至您复制的{bandCardInfo.orgName}电子账号
                </p>
                <p>
                    <svg width={4} height={4} className='rac'>
                        <circle cx="2" cy="2" r="2" fill="#666666"/>
                    </svg>
                    转账成功后回到比财APP，进行购买</p>
                <h4>使用新卡大额转入</h4>
                <p>
                    <svg width={4} height={4} className='rac'>
                        <circle cx="2" cy="2" r="2" fill="#666666"/>
                    </svg>如您需要使用其他银行卡进行大额转入，请添加<span onClick={()=>this.supBank()}>支持银行</span>（点击查看）的银行卡为{bandCardInfo.twoCardName}电子账户绑定银行卡</p>
                <p>
                    <svg width={4} height={4} className='rac'>
                        <circle cx="2" cy="2" r="2" fill="#666666"/>
                    </svg>
                    添加完成后，请参照已绑定卡大额转入流程操作</p>
            </div>
            <div className="to-bank" onClick={()=>this.changeCard()}>{btnMsg}</div>
            <BottomColumn type='long'></BottomColumn>
        </div >
    }
}
export default LargeAmountsTransfer
