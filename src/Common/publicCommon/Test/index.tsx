import React from 'react'


function IronMan(Component) {
    //定义 包装组件
    class IronManComponent extends React.Component {
        constructor(props) {
            super(props)
        }
        render() {
            //把传入的组件的props展开，这样就能把所有的窜见来props 继承过来
            return (<div>
                <Component {...this.props} />
                <p>现在我已经是钢铁侠了，准备打败灭霸</p>
            </div>)
        }
    }
    //返回包装加强后的组件
    return IronManComponent
}



@IronMan
class Test extends React.Component {
    render() {
        return <div>
            我是托尼斯塔克
        </div>
    }
}


export default Test


