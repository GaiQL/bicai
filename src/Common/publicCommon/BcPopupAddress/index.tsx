import React, { ReactDOM } from 'react'
import './style.scss'
import { Picker, List } from 'antd-mobile';
import arrayTreeFilter from 'array-tree-filter';
import { createForm } from 'rc-form';
interface addressRule {
    form?: any
}

class BcPopupAddress extends React.Component<addressRule, any>{
    state = {
        pickerValue: ['110000', '110101', '110102'],
        visible: false,
        district: [
            {
                value: '110000',
                label: '北京市',
                children: [
                    {
                        value: '110101',
                        label: '北京市',
                        children: [
                            {
                                value: '110102',
                                label: '东城区',
                            },
                            {
                                value: '110103',
                                label: '西城区',
                            },
                            {
                                value: '110104',
                                label: '朝阳区',
                            },
                        ]
                    }
                ]
            },
            {
                value: '120000',
                label: '天津市',
                children: [
                    {
                        value: '120101',
                        label: '天津市',
                        children: [
                            {
                                value: '120102',
                                label: '和平区',
                            },
                            {
                                value: '120103',
                                label: '河东区',
                            },
                            {
                                value: '120104',
                                label: '河西区',
                            },
                        ]
                    }
                ]
            }
        ]
    }
    getSel() {
        const { pickerValue, district } = this.state
        if (!pickerValue) return ''
        const treeChildren = arrayTreeFilter(district, (c, level) => c.value === pickerValue[level])
        const currentAddress = treeChildren.map(v => v.label).join(',');
        return currentAddress
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { district, visible, pickerValue } = this.state
        return (
            <div className="address-popup">
                <Picker
                    visible={visible}
                    data={district}
                    value={pickerValue}
                    {...getFieldProps('district', {
                        initialValue: ['110000', '110101', '110102'],
                    })}
                    onChange={v => this.setState({pickerValue: v})}
                    onOk={() => this.setState({ visible: false })}
                    onDismiss={() => this.setState({ visible: false })}
                    >
                    <List.Item extra={this.getSel()} onClick={() => this.setState({ visible: true })}>
                        所在地区
                    </List.Item>
                </Picker>
                <span className="go-box">
                    <img src={require('Common/assets/images/go.png')} alt="" />
                </span>
            </div>
        )
    }
}
export default createForm()(BcPopupAddress)
