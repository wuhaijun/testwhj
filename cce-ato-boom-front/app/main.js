'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const ReactDOM = require('react-dom');
const Provider = require('react-redux').Provider;
const routers = require('./routers.jsx');
const config = require('../common/config');
const AuthorizationUtils = require('koa-sso-auth-cli').AuthorizationUtils;

import configureStore from './store/configureStore';

config.set(window.BOOM_INIT_CONFIG);
AuthorizationUtils.setDefaultModule('boom');
AuthorizationUtils.initBuild(window.BOOM_INIT_MODULES);
AuthorizationUtils.setClient(window.BOOM_INIT_CLIENT_AUTH);

ReactDOM.render(
    <Provider store={configureStore({})}>
            <Router history={ReactRouter.browserHistory}>
                {routers}
            </Router>
     </Provider>
        , document.getElementById('app'));