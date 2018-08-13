import React, { Component, PropTypes } from 'react';
import RowInput from './../../common/RowInput.jsx';
import RowSubmit from './../../common/RowSubmit.jsx';
import Argee from './../../common/Argee.jsx';

class RegisterForm extends Component {

    constructor(props) {
        super(props);
        this.state = { msg: '', password: '', agreed: true }
    }

    handleRegister = () => {
        let pv = this.refs.password.validate();
        let ev = this.refs.email.validate();
        let rpv = this.refs.rePassword.validate();

        if (!ev || !pv || !rpv) return;

        let email = this.refs.email.val;
        let password = this.refs.password.val;
        let openid = this.props.openid;
        let authCallBack = this.props.authCallBack;
        let data = { email, password, authCallBack };
        if (openid) data = { ...data, openid };

        $.post('/api/user/register', data, json => {
            this.setState({ msg: json.message });
            if (json.wxLogin) {
                location.href = json.redirectUrl;
                return;
            }
            if (json.status) location.href = "/user/registerOk?email=" + email + "&redirectUrl=" + authCallBack;
        });
    };

    handlePasswordChange = e => {
        let val = e && e.target && e.target.value;
        this.setState({ password: val })
    };

    handleEmailChange = e => {
        let val = e && e.target && e.target.value;
        this.setState({ email: val })
    };

    handleArgee = agreed => {
        this.setState({ agreed: agreed })
    }

    render() {
        return (
            <div>
                <RowInput ref="email" name="email" isRequired isEmail placeholder="邮箱地址" value={this.state.email} onChange={this.handleEmailChange} />
                <RowInput ref="password" name="password" type="password" isRequired isPassword placeholder="密码" onChange={this.handlePasswordChange} />
                <RowInput ref="rePassword" name="rePassword" type="password" isEquals={this.state.password} validateMsg="重复密码不正确!" placeholder="重复密码" />
                <Argee onArgee={this.handleArgee} argeed={this.state.agreed} />
                <RowSubmit onSubmit={this.handleRegister} name={this.props.btnText} msg={this.state.msg} argeed={this.state.agreed} />
            </div>
        );
    }
}

export default RegisterForm;

RegisterForm.PropTypes = {
    btnText: PropTypes.string,
    email: PropTypes.string,
    openid: PropTypes.string
}