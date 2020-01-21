import React from 'react'
import { Toast } from 'antd-mobile'
import './style.scss'

class Loading extends React.Component<any,any>{
    componentDidMount(){
        Toast.loading('加载中···')
    }
    componentWillUnmount(){
        Toast.hide()
    }
    render(){
        return <div className='loading'>
            <p>加载中···</p>
        </div>
    }
}
export default Loading