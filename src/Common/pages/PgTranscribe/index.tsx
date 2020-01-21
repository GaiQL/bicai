import React from 'react';
import { Player, BigPlayButton} from 'video-react';
import "video-react/dist/video-react.css";
import "./index.scss"
// import { commonStore } from "Common/pages/store"


export default class Transcribe extends React.Component<any, any>{
    state = {
        inputVideoUrl: 'https://finsuit.oss-cn-beijing.aliyuncs.com/open_api_bank/h5/video/%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB%E6%96%87%E5%AD%973-6%E7%A7%92.mp4'
    }
    componentDidMount() {
        const { player } = this.player.getState();
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    }

    handleStateChange(state, prevState) {
        // let { userName = '', identNo = '' }: any = commonStore.query() || {}
        if(!this.player) return
        const { player } = this.player.getState(); // 获取播放器状态
        console.log(player.ended)
        if (player.ended) { // 判断是否播放完毕
            this.player = null
            setTimeout(()=>{
                this.props.history.go(-1)
            },400)
            // this.props.history.push(`/faceDiscern?userName=${userName}&identNo=${identNo}`)
            return
        }
      }
    player = null
    render() {
        return <Player width='100%' height='100%' fluid={false} ref={(player) => { this.player = player }} videoId="video-1">
            <source src={this.state.inputVideoUrl}/>
            <BigPlayButton position="center" />
      </Player>
    }
}

