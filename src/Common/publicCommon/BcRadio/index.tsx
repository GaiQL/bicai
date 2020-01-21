import React from 'react';
import './style.scss';
import NewRadio from '../BcNewRadio/index'
/**
 * @param onChange
 * 必须传递一个onChang事件来接收组件的选中状态
 */
class Radio extends React.Component<any, any> {
    componentwillunmount(){
        this.setState({
            isCheck: false,
            type: false,
            defaultChecked: false
        })
    }
    state = {
        isCheck: false,
        type: false,
        defaultChecked: false
    }
    // 从props中获取state，来改变内部状态
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isCheck !== nextProps.defaultChecked) {
            return {
                isCheck: nextProps.defaultChecked,
            };
        }
        // Return null to indicate no change to state.
        return null;
    }
    changeFn = (val) => {
        let { onChange } = this.props;
        let { isCheck } = this.state;
        onChange(val)
        this.setState({ isCheck: val })
    }
    render() {
        let { isCheck } = this.state;

        return (

            <div className="agreement">
                <NewRadio type={isCheck} onClick={this.changeFn}></NewRadio>
            </div>
        )
    }
}
export default Radio
