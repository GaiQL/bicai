import React from 'react'
import { commonStore } from "Common/pages/store"
class SetDealCode extends React.Component<any, any>  {
    componentWillMount(){
        // console.log(this.props.location.query)
    }
    render() {
        return (
             <div>
                <iframe src="http://directtest.hmccb.com/OPENAPI_FESS/view/pwd/channelAlterPayPassW.html?token=42af8100370d480f8ef6b0efc3f180a8" ></iframe>
             </div>
        )
        
    }
}
export default SetDealCode
