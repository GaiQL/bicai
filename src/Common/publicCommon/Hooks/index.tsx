import React, { useState, useEffect } from 'react'

function Example() {
    const [count, setCount] = useState(0)
    const [num, setNum] = useState(1)
    useEffect(() => {
        // 更新文档的标题
        document.title = `You clicked ${count} times`;
    },[count])
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    )
}


// class Example extends React.Component<any, any>{
//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 0
//         };
//     }
//     componentDidMount(){
//         document.title = `You clicked ${this.state.count} times`;
//     }
//     componentDidUpdate(){
    
//         document.title = `You clicked ${this.state.count} times`;
//     }
//     render() {
//         return (
//             <div>
//                 <p>You clicked {this.state.count} times</p>
//                 <button onClick={() => this.setState({ count: this.state.count + 1 })}>
//                     Click me
//           </button>
//             </div>
//         );
//     }
// }

export default Example