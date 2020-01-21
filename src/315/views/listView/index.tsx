import React from 'react'
import ReactDOM from 'react-dom'
import { ListView } from 'antd-mobile';

const data = [
    {
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        title: 'Meet hotel',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
        title: 'McDonald\'s invites you',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        title: 'Eat the week',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        title: 'Eat the week',
        des: '不是所有的兼职汪都需要风吹日晒',
    }
];

let pageIndex = 0;


function genData(pIndex = 1) {
    for (let i=1;i<pIndex;i++) {
        data.push({
            img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
            title: 'Eat the week',
            des: '不是所有的兼职汪都需要风吹日晒',
        })
    }
}


class Demo extends React.Component<any, any> {
    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource,
            isLoading: true,
            height: document.documentElement.clientHeight * 3 / 4,
        };
    }
    onEndReached = (event) => {
        //this.state.hasMore从后端获取数据指示是否是最后一页
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.rData = data;
        this.setState({ isLoading: true });
        setTimeout(() => {
            genData(++pageIndex);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
        }, 1000);
    }
    //获取当前页面的滚动高度
    componentDidMount() {
        const hei1:any = ReactDOM.findDOMNode(this.lv).parentNode
        const hei = document.documentElement.clientHeight - hei1.offsetTop;
        setTimeout(() => {
            genData();//初始化数据
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(data),
                isLoading: false,
                height: hei,
            });
        }, 600);
    }
    lv = null
    rData=[]
    render() {
        let index = data.length - 1;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = data.length - 1;
            }
            const obj = data[index--];
            return (
                <div key={rowID} style={{ padding: '0 15px' }}>
                    <div
                        style={{
                            lineHeight: '50px',
                            color: '#888',
                            fontSize: 18,
                            borderBottom: '1px solid #F6F6F6',
                        }}
                    >{obj.title}</div>
                    <div style={{ display: 'flex', padding: '15px 0' }}>
                        <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
                        <div style={{ lineHeight: 1 }}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
                            <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>35</span>¥ {rowID}</div>
                        </div>
                    </div>
                </div>
            );
        };

        return <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            renderRow={row}//控制每一行的样式 以及结构
            style={{
                height: this.state.height,
                overflow: 'auto',
            }}
            pageSize={1}
            onScroll={() => { console.log('scroll')}}
            onEndReached={this.onEndReached}//当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足这个距离时候请求接口
            onEndReachedThreshold={10}//距离底部滑动的距离
        />
    }
}
export default Demo