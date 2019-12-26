// import React, {Suspense} from 'react';
// import {HashRouter, Switch, Route, Redirect} from 'react-router-dom'
// import './index.css'
// import {commonStore} from 'Common/pages/store'
// import Wrong from "Common/wrong"
//
// export default function AppCom({routerConfig}) {
//     return <HashRouter>
//         <Suspense fallback={<div></div>}>
//             <Switch>
//                 <Redirect exact from='/' to="/native"/>
//                 {
//                     routerConfig.config.map((item, ind) => {
//                         return <Route exact={item.exact} key={ind} path={item.path} render={(location) => {
//                             commonStore.getHistory({...location})
//                             return <item.component {...location}/>
//                         }}/>
//                     })
//                 }
//                 <Route component={Wrong}/>
//             </Switch>
//         </Suspense>
//     </HashRouter>
//
// };
//
