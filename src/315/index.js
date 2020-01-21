import 'antd-mobile/dist/antd-mobile.css'
import '@babel/polyfill';
import ReactDOM from 'react-dom';
import * as React from 'react';
import App from "./app";
import {AppContainer} from 'react-hot-loader';
import {Provider} from 'mobx-react'
import stores from './store/store'
import FastClick from "fastclick";
const root = document.getElementById('root')
const render = Component => {
    FastClick.attach(document.body);
    ReactDOM.render(
        <Provider store={stores}>
            <AppContainer>
                <Component/>
            </AppContainer>
        </Provider>,
        root
    )
}
render(App)

if (module.hot) {
    module.hot.accept('./app', () => {
        render(App)
    })
}
