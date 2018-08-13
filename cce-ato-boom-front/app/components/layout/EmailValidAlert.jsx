'use strict';

import React from 'react';
const config = require('../../../common/config');
const alertStyle = {
    position: "fixed",
    top: "55px",
    zIndex: "100",
    width: "100%",
    backgroundColor: 'rgba(106, 199, 232, 1)',
    color: 'white',
    border: '3px rgb(106,199,232) solid'
}

const aStyle = {
    textDecoration: 'underline'
}

const handleSendValidEmail = (email) => {
    let api_server = config.get('sso_server');
    $.post(api_server + '/api/user/sendRegisterValidEmail', { email }, json => {
        if (json.status) {
            alert('发送成功,请前往邮箱验证!')
        } else {
            alert('很抱歉,邮件发送失败,请稍后重试。')
        }
    });
};

const __gotoEmail__ = uurl => {
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

const isCompanyAccount = (email = "") => {
    if (email.toLowerCase().indexOf('ccegroup') != -1) {
        return "您的邮箱还未验证，企业用户验证后才可查看全部功能，请前往";
    }
    return "您的邮箱还未验证，请前往";
}

const openEmail = (email) => {
    let uurl = __gotoEmail__(email);
    if (uurl != "") {
        window.open("http://" + uurl);
    } else {
        alert("抱歉!未找到对应的邮箱登录地址，请自己登录邮箱查看邮件！");
    }
};

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: true };
    }
    render() {
        let props = this.props;
        alertStyle['display'] = this.state.show ? 'block':'none';
        return (<div className="alert alert-info" role="alert" style={alertStyle}>
            您的邮箱还未验证，请前往<a style={aStyle} href="javascript:;" onClick={() => openEmail(props.email)}>{props.email}</a>进行验证，<a style={aStyle} href="#" onClick={() => handleSendValidEmail(props.email)}>重发邮件</a>。
            <i className="fa fa-times" style={{
            float: 'right',
            fontSize: '18px',
            marginRight: '200px',
            color: 'white',
            cursor: 'pointer'
        }} onClick={ () => { this.setState({ show: false }) } }/>
        </div>)
    }
}