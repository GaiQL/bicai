import React from 'react'
import {observer, inject} from 'mobx-react'
import './style.scss'

@inject('store')
@observer
export default class Headers extends React.Component<any, any>{
    state = {
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight,   //实时屏幕高度
    }
    UNSAFE_componentWillMount(): void {
        window.onresize = (e) => {
            return (() => {
                this.setState({
                    showHeight:document.body.clientHeight
                })
            })()
        }
    }
    render() {
        let {showHeight,docmHeight} = this.state
        return <div className='footer-bicai'>
            {
                showHeight < docmHeight? null : <p className='openPerfection-tip'>
                    如有疑问，请关注微信公众号bicaikefu留言
                </p>
            }
        </div>
    }
}
