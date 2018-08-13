'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App.jsx';
import Login from './user/login/Login.jsx';
import Welcome from './Welcome.jsx';
import SendForgetPasswordEmail from './user/SendForgetPasswordEmail.jsx';
import UserContainer from './user/UserContainer.jsx';
import Register from './user/register/Register.jsx';
import RegisterOk from './user/register/RegisterOk.jsx';
import ResetPassword from './user/ResetPassword.jsx';
import ResetPasswordOk from './user/ResetPasswordOk.jsx';
import WxCallback from './user/wx/WxCallback.jsx';
import UserCenterContainer from './user/UserCenterContainer.jsx';
import UserCenterAccount from './user/UserCenterAccount.jsx';
import UserCenterInfo from './user/UserCenterInfo.jsx';
import UserCenterBindWeChat from './user/UserCenterBindWeChat.jsx';
import { trackPage } from '../../common/TrackUtils';
import LoginFail from "./user/login/LoginFail";
const config = require('../../common/config');
config.set(window.CONFIG);
ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route onEnter={trackPage} path="welcome" component={Welcome} />
            <Route path="user" component={UserContainer}>
                <Route onEnter={trackPage} path="login" component={Login} />
                <Route onEnter={trackPage} path="sendForgetPasswordEmail" component={SendForgetPasswordEmail} />
                <Route onEnter={trackPage} path="register" component={Register} />
                <Route onEnter={trackPage} path="registerOk" component={RegisterOk} />
                <Route onEnter={trackPage} path="loginFail" component={LoginFail} />
                <Route onEnter={trackPage} path="resetPassword" component={ResetPassword} />
                <Route onEnter={trackPage} path="resetPasswordOk" component={ResetPasswordOk} />
                <Route onEnter={trackPage} path="wxcallback" component={WxCallback} />
            </Route>
            <Route path="userCenter" component={UserCenterContainer} >
                <IndexRoute component={UserCenterInfo} />
                <Route onEnter={trackPage} path="account" component={UserCenterAccount} />
                <Route onEnter={trackPage} path="info" component={UserCenterInfo} />
                <Route onEnter={trackPage} path="bindWeChat" component={UserCenterBindWeChat} />
            </Route>
        </Route>

    </Router>, document.getElementById('main'));