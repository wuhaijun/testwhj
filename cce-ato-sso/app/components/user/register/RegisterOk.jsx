'use strict';

import React, { Component } from 'react';
import Footer from './../Footer.jsx';

export default class RegisterOk extends Component {

    constructor(props) {
        super(props);
        this.state = { status: true, msg: '' }
    }

    __gotoEmail__ = uurl => {
        let $t = uurl.split('@')[1];
        $t = $t.toLowerCase();
        if ($t == '163.com') {
            return 'mail.163.com';
        } else if ($t == 'vip.163.com') {
            return 'vip.163.com';
        } else if ($t == '126.com') {
            return 'mail.126.com';
        } else if ($t == 'qq.com' || $t == 'vip.qq.com' || $t == 'foxmail.com') {
            return 'mail.qq.com';
        } else if ($t == 'gmail.com') {
            return 'mail.google.com';
        } else if ($t == 'sohu.com') {
            return 'mail.sohu.com';
        } else if ($t == 'tom.com') {
            return 'mail.tom.com';
        } else if ($t == 'vip.sina.com') {
            return 'vip.sina.com';
        } else if ($t == 'sina.com.cn' || $t == 'sina.com') {
            return 'mail.sina.com.cn';
        } else if ($t == 'tom.com') {
            return 'mail.tom.com';
        } else if ($t == 'yahoo.com.cn' || $t == 'yahoo.cn') {
            return 'mail.cn.yahoo.com';
        } else if ($t == 'tom.com') {
            return 'mail.tom.com';
        } else if ($t == 'yeah.net') {
            return 'www.yeah.net';
        } else if ($t == '21cn.com') {
            return 'mail.21cn.com';
        } else if ($t == 'hotmail.com') {
            return 'www.hotmail.com';
        } else if ($t == 'sogou.com') {
            return 'mail.sogou.com';
        } else if ($t == '188.com') {
            return 'www.188.com';
        } else if ($t == '139.com') {
            return 'mail.10086.cn';
        } else if ($t == '189.cn') {
            return 'webmail15.189.cn/webmail';
        } else if ($t == 'wo.com.cn') {
            return 'mail.wo.com.cn/smsmail';
        } else if ($t == '139.com') {
            return 'mail.10086.cn';
        } else {
            return '';
        }
    };

    openEmail = () => {
        let email = this.props.location.query.email;
        let uurl = this.__gotoEmail__(email);
        if (uurl != "") {
            window.open("http://" + uurl);
        } else {
            alert("抱歉!未找到对应的邮箱登录地址，请自己登录邮箱查看邮件！");
        }
    };

    handleSendRegisterEmail = () => {
        let email = this.props.location.query.email;
        if (!email) return;

        $.post('/api/user/sendRegisterValidEmail', { email }, json => {
            this.setState({ status: json.status, msg: json.message });
            if (json.status) {
                alert('发送成功,请查收!')
            }
        });
    };

    jumpToLogin = () => {
        let redirectUrlStr = this.props.location.query.redirectUrl;
        let redirectUrl = null;
        if (redirectUrlStr !="undefined") {
            redirectUrl = new URL(redirectUrlStr).origin;
        }
        return location.href = "/user/login/unValid?username=" + this.props.location.query.email + "&redirectUrl=" + encodeURIComponent(redirectUrl);
    };

    vaildLaterStyle = {
        textDecoration: 'underline',
        fontSize: '14px'
    }

    render() {
        return (
            <div className="row register-ok">
                <div className="col-sm-9" >
                    <h4>注册成功!</h4>
                    <h4 style={{ marginTop: '30px' }}><i>请前往</i><a href="javascript:;" onClick={this.openEmail}>{this.props.location.query.email}</a><i>进行验证。</i></h4>
                    <a style={this.vaildLaterStyle} href="#" onClick={this.jumpToLogin}>稍后验证</a>
                    <Footer handleSendRegisterEmail={this.handleSendRegisterEmail} />
                </div>
            </div>
        );
    }
}
