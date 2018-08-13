'use strict';

import React, { Component } from 'react';
import RowInput from './../common/RowInput.jsx';
import RowSubmit from './../common/RowSubmit.jsx';
import RowProgressBar from './../common/RowProgressBar.jsx';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', password: '',agreed: true }
    }

    handleUpdatePassword = () => {
        let pv = this.refs.password.validate();
        let rpv = this.refs.rePassword.validate();
        if (!pv || !rpv) return;

        let password = this.refs.password.val;
        let code = this.props.location.query.code;

        $.post('/api/user/resetPassword', { password, code }, json => {
            this.setState({ msg: json.message });
            if (json.status) {
                location.href="/user/resetPasswordOk";
            }
        });
    };

    handlePasswordChange = e => {
        let val = e && e.target && e.target.value;
        this.setState({ password: val })
    };

    render () {
        return (
            <div>
                <RowProgressBar current={ 2 }/>
                <RowInput ref="password" name="password" type="password" isRequired isPassword onChange={ this.handlePasswordChange } placeholder="新密码"/>
                <RowInput ref="rePassword" name="rePassword" type="password" isEquals={ this.state.password } placeholder="重复密码" validateMsg="重复密码不正确!"/>
                <RowSubmit onSubmit={ this.handleUpdatePassword } name="修改密码" msg={ this.state.msg } argeed = { this.state.agreed }/>
            </div>
        );
    }
}
