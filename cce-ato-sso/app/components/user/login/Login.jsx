'use strict';

import React, { Component } from 'react';
import LoginForm from './LoginForm';
import { Link } from 'react-router';
const config = require('../../../../common/config.js');

const oauth2Config = {
    "url": "https://open.weixin.qq.com/connect/qrconnect?appid=#APPID#&redirect_uri=#REDIRECT_URI#&response_type=code&scope=snsapi_login&state=#STATE##wechat_redirect",
    "appId": "wxb3ac797fcae4a30a",
    "redirectUrl": "http://account.brainboom.cn/api/weixin/oauth2"
}
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "" };
    }

    componentDidMount() {
        this.setState({ username: this.props.location.query.username });
    }

    oauth2 = () => {
        const appId = oauth2Config.appId;
        const redirectUrl = oauth2Config.redirectUrl;
        let url = oauth2Config.url.replace("#APPID#", appId).replace("#REDIRECT_URI#", encodeURIComponent(redirectUrl)).replace("#STATE#", "123");
        window.location.href = url;
    }

    render() {
        return (
            <div className="login-container">
                <LoginForm username={this.state.username}
                    btnText="登录"
                    auth_callback={this.props.location.query.auth_callback} />

                <div className="row divider">
                    <div className="col-sm-3">
                        <span>OR</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-3">
                        <button type="button" onClick={this.oauth2} className="btn btn-outline-success btn-block user-btn-register">微信登录</button>
                    </div>
                </div>
                <div className="row" style={{marginTop:'10px'}}>
                    <div className="col-sm-3">
                        <Link to={{pathname:"/user/register",query:{'authCallback':this.props.location.query.auth_callback}}}>立即注册</Link>
                    </div>
                </div>

            </div>
        );
    }
}
