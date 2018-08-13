'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

import Nav from './Nav.jsx';

const oauth2Config = {
    "url": "https://open.weixin.qq.com/connect/qrconnect?appid=#APPID#&redirect_uri=#REDIRECT_URI#&response_type=code&scope=snsapi_login&state=#STATE##wechat_redirect",
    "appId": "wxb3ac797fcae4a30a",
    "redirectUrl": "http://account.brainboom.cn/api/weixin/oauth2"
}
export default class UserCenterContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { active: 'info', account: {}, callback: '' };
    }

    componentDidMount() {
        $.get('/api/userCenter/getUserInfo', json => {
            if (json.status) {
                this.setState({
                    account: json.account,
                    callback: 'http://' + this.props.location.query.callback || json.default_system
                })
            } else {
                alert(json.message);
                location.href = '/user/login';
            }
        });
    }

    handleSwitch = type => {
        return () => {
            this.setState({ active: type });
        };
    };

    handleChangeUserInfo = e => {
        let name = e.target.name;
        let value = e.target.value;

        let obj = {};
        obj[name] = value;
        this.setState({ account: Object.assign(this.state.account, obj) });
    };

    handleSubmitAvatar = avatar => {
        let obj = {};
        obj['avatar'] = avatar;
        this.setState({ account: Object.assign(this.state.account, obj) });
    };

    cancelWx = () => {
        let username = this.state.account.username;
        $.post('/api/weixin/cancel', { username }, json => {
            if (!json.status) {
                alert('取消失败');
                return;
            }
            let newAccount = this.state.account;
            delete newAccount.weixin
            this.setState({ account: newAccount });
        });
    }

    oauth2 = () => {
        // const oauth2Config = config.get('weixin.oauth2');
        // let {url,appId,redirectUrl} = oauth2Config;
        // console.log(url,appId,redirectUrl);
        const appId = oauth2Config.appId;
        const redirectUrl = oauth2Config.redirectUrl;
        let url = oauth2Config.url.replace("#APPID#", appId).replace("#REDIRECT_URI#", encodeURIComponent(redirectUrl + "?username=" + this.state.account.username)).replace("#STATE#", "123");
        window.location.href = url;
    }


    render() {
        const account = this.state.account;
        return (
            <div className="user-center-container">
                <Nav account={account} />
                <div className="user-center-content">
                    <div className="main_left">
                        <div className="head col-sm-12">
                            <div style={{ marginBottom: '20px' }}>
                                <img className="img_1 img-circle" src={'http://boom-static.static.cceato.com/boom/imgs/avatars/' + (account.avatar || '01.png')} />
                            </div>
                            <div>
                                <h4>{account.nickname}</h4>
                                <p className="emailaddress">{account.username}</p>
                            </div>
                        </div>
                        <div className="menus">
                            <Link to="/userCenter/info">
                                <section className="border col-sm-12" onClick={this.handleSwitch('info')}>
                                    <span  >个人信息</span>
                                </section>
                            </Link>
                            <Link to="/userCenter/account" >
                                <div className="border col-sm-12" onClick={this.handleSwitch('account')}>
                                    <span >帐号密码</span>
                                </div>
                            </Link>
                            <Link to="/userCenter/bindWeChat" >
                                <div className="border col-sm-12" onClick={this.handleSwitch('bindWeChat')}>
                                    <span >公众号账号授权</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    {
                        this.props.children && React.cloneElement(this.props.children, {
                            account: account,
                            onSubmitAvatar: this.handleSubmitAvatar,
                            onChangeUserInfo: this.handleChangeUserInfo,
                            cancelWx: this.cancelWx,
                            oauth2: this.oauth2
                        })}
                </div>
            </div>

        );
    }
}