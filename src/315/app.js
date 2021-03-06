import React, { Suspense } from 'react';
import { HashRouter,Switch, Route,Redirect} from 'react-router-dom'
import routerConfig from './router/index'
import './app.scss';
import '../index.css'
import Wrong from '../Common/wrong'//404页面
import {commonStore} from 'Common/pages/store'



export default () => {
    return <HashRouter>
        <Suspense fallback={<div></div>}>
            <Switch>
                <Redirect exact from='/' to="/native"/>
                {
                    routerConfig.config.map((item,ind) =>{
                        return <Route exact={item.exact} key={ind} path={item.path} render={(location)=>{
                            // Store.getHistory({...location})
                            commonStore.getHistory({...location})
                            return <item.component {...location}/>
                        }}/>
                    })
                }
                <Route component={Wrong}/>
            </Switch>
        </Suspense>
    </HashRouter>
};
