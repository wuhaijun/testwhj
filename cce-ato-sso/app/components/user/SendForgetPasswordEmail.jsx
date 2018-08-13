'use strict';

import React, { Component } from 'react';
import RowSubmit from './../common/RowSubmit.jsx';
import RowInput from './../common/RowInput.jsx';
import RowProgressBar from './../common/RowProgressBar.jsx';

export default class SendForgetPasswordEmail extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', status: false, sent: false ,agreed: true};
    }

    handleSendEmail = (sendingCallback, sentCallback) => {
        let ev = this.refs.email.validate();
        if (!ev) return;

        sendingCallback();

        let email = this.refs.email.val;
        $.post('/api/user/sendForgetPasswordEmail', { email } , json => {
            sentCallback();
            if (json.status) {
                alert("邮件已发送到您的邮箱,请查收");
                location.href="/user/login";
            }
            this.setState({ sent: true, status: json.status, msg: json.message ,agreed: true});
        });
    };

    render () {
        let name;
        if (!this.state.sent) name ="发送邮件";
        else if (this.state.status) name = "邮件已发送,请到您的邮箱查看";
        else name ="发送失败";

        return (
            <div>
                <RowProgressBar current={ 1 }/>
                <RowInput ref="email" name="email" isRequired isEmail />
                <RowSubmit onSubmit={ this.handleSendEmail } loadingName="正在发送... ..." name={ name } msg={ this.state.msg } argeed = { this.state.agreed }/>
            </div>
        );
    }
}
