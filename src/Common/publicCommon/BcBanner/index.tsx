import React from 'react'
import { imgSrc } from 'Common/config/index'
import ApiBicai from 'Common/api/bicai2.0'
import './style.scss'
import { observer, inject } from 'mobx-react'
import { buySuccessBanner } from 'Common/Plugins/recordLogInfo'
import {Native} from "Common/utils/appBridge"
interface Person {
    [propName: string]: any;
}

@inject('store')
@observer
class BcBanner extends React.Component<any, any>{
    state = {
        resData: null,
    }
    async banner() {
        let { calculateBottomPosition } = this.props.store;
        let res: any = await ApiBicai.getBanner({})

        // 从持有中带来的数据
        this.setState({ resData: res })
        calculateBottomPosition();
    }
    // 广告请求链接
    async advLink({advType,advUrl,couponId,advTitle,advSubHead}) {
        try {
            buySuccessBanner({couponId,advTitle,advSubHead})
        } catch (err) {

        }
    //1.首页上方广告 2.首页理财圈广告  3.理财圈列表广告 4.排行版BANNER广告 50.侧边栏BANNER 6.首页BANNER 7.购买成功后BANNER
        if (advType == "1") {
            let res: any = await ApiBicai.getBannerLink({ LINK_URL: encodeURIComponent(advUrl) })
             Native.apiNavBarStyleClose('back')  //针对ios做的头部标题
            // 外链针对安卓做跳转 
             Native.goBannerUrl({
                url: res.url, closeState: "0" 
           })
        }else{
            console.log(advUrl);
            window.location.href = advUrl;
        }
        
    }

    componentDidMount() {
        this.banner();

    }
    render() {
        let { resData } = this.state

        let res: Person = resData
        return (
            <ul className='activity-img'>
                {
                    res && res.ADV_LIST.map((item, index) => {
                        return (
                            <li key={index}>
                                <img src={imgSrc + item.advImgUrl} className="img" alt="" onClick={() => this.advLink(item)} />
                            </li>
                        )
                    })
                }

            </ul>
        )

    }

}

export default BcBanner;