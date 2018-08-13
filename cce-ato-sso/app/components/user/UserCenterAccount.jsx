'use strict';

import React, { Component } from 'react';
import RowInput from '../common/RowInput.jsx';
import RowSubmit from '../common/RowSubmit.jsx';
import WxCancel from './wx/WxCancel.jsx';

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = { msg: '', password: '', weixin: true ,agreed: true};
    }

    handleSave = (savingCallback, savedCallback) => {
        let op = this.refs.oldPassword.validate();
        let np = this.refs.newPassword.validate();
        let nrp = this.refs.newRePassword.validate();
        if (!op || !np || !nrp) return;

        savingCallback();

        let newPassword = this.refs.newPassword.val;
        let oldPassword = this.refs.oldPassword.val;

        let _id = this.props.account._id;

        $.post('/api/userCenter/updatePassword', { _id, oldPassword, newPassword }, json => {
            savedCallback();
            this.setState({ msg: json.message });
            if (json.status) {
                alert('修改成功,请重新登录!');
                location.href = "/user/login";
            }
        });
    };

    componentDidMount() {
        this.setState({ weixin: this.props.account.weixin });
    }

    handleSendValidEmail = () => {
        let email = this.props.account.username;
        $.post('/api/user/sendRegisterValidEmail', { email }, json => {
            if (json.status) {
                alert('发送成功,请前往邮箱验证!')
            } else {
                alert('很抱歉,邮件发送失败,请稍后重试。')
            }
        });
    };

    handlePasswordChange = e => {
        let val = e && e.target && e.target.value;
        this.setState({ password: val })
    };

    render() {
        let nickname = "未绑定";
        let wxAction = this.props.oauth2;
        if (this.props.account.weixin) {
            nickname = this.props.account.weixin.nickname;
            wxAction = this.props.cancelWx;
        }

        return (
            <div className="main_right">
                <div  >
                    <p className="loginaccount ">登录帐号</p>
                    <p className="des">邮箱帐号可收取通知</p>
                </div>
                <div className="form-horizontal info-group">
                    <div className="row">
                        <label className="control-label col-sm-3 col-lg-2">邮箱帐号</label>
                        <div className="col-sm-8">
                            <input className="form-control" type="text" disabled value={this.props.account.username} />
                            {!this.props.account.validDate ?
                                <div className="user-center-valid-email">
                                    <span>未验证</span>
                                    <button type="button" onClick={this.handleSendValidEmail}>重发验证邮件</button>
                                </div> : null}

                        </div>
                    </div>
                    <div className="row">
                        <label className="control-label col-sm-3 col-lg-2">登录帐号</label>
                        <div className="col-sm-8">
                            <span style={{ position: 'relative', top: '5px' }}>
                                <img src="/public/images/icon16_wx_logo.png" alt="" />
                                <span style={{ marginLeft: '10px' }}>{nickname}</span>
                            </span>
                            <div className="user-center-valid-btn">
                                {this.props.account.weixin ? <WxCancel cancelWx={wxAction} /> : <button type="button" onClick={wxAction}>绑定微信</button>}
                            </div>
                        </div>
                    </div>


                    <hr />

                    <RowInput ref="oldPassword" name="oldPassword" type="password" isRequired inputClassName="col-sm-8" labelClassName="col-sm-3" label="旧密码" placeholder="旧密码" />
                    <RowInput ref="newPassword" name="newPassword" type="password" isRequired isPassword onChange={this.handlePasswordChange} inputClassName="col-sm-8" labelClassName="col-sm-3" label="新密码" placeholder="新密码" />
                    <RowInput ref="newRePassword" name="newRePassword" type="password" isEquals={this.state.password} inputClassName="col-sm-8" labelClassName="col-sm-3" label="确认新密码" placeholder="确认新密码" />

                    <RowSubmit btnClassName="btn-classname" onSubmit={this.handleSave} name="保存" msg={this.state.msg} argeed = { this.state.agreed }/>

                </div>
            </div>
        );
    }
}