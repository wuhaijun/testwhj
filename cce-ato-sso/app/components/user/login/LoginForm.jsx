import React, { Component, PropTypes } from 'react';
import RowInput from './../../common/RowInput.jsx';
import RowSubmit from './../../common/RowSubmit.jsx';
import { Link } from 'react-router';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = { msg: '', code: '0' ,agreed: true};
    }

    componentDidMount() {
        $(document.body).bind('keyup', e => {
            this.handleKeyUp(e);
        });
    }

    componentWillUnmount() {
        $(document.body).unbind("keyup");
    }

    handleLogin = () => {
        let ev = this.refs.email.validate();
        let pv = this.refs.password.validate();
        if (!ev || !pv) return;

        let username = this.refs.email.val;
        let password = this.refs.password.val;
        let openid = this.props.openid;
        let data = { username, password };
        if (openid) data = { ...data, openid };

        let auth_callback = this.props.auth_callback;

        $.post('/api/user/login', data, json => {
            if (json.status) {
                if (auth_callback && auth_callback != 'undefined') {
                    location.href = auth_callback + '?code=' + json.result;
                } else {
                    location.href = '/';
                }
            } else {
                if (json.code == '2') {
                    location.href = "/user/loginFail?email=" + username;
                } else {
                    this.setState({ msg: json.message, code: json.code });
                }
            }
        });
    };

    handleKeyUp = e => {
        e.preventDefault();
        if (e.which == 13 || e.keyCode == 13) {
            this.handleLogin();
        }
    };

    forgetStyle = {
        // width: "25%",
        textAlign: "right",
        fontSize: 10,
        marginBottom: "10px"
    }

    render() {
        return (
            <div>
                <RowInput ref="email" name="email" placeholder="邮箱地址" isRequired isEmail onKeyUp={this.handleKeyUp}
                    value={this.props.username} />
                <RowInput ref="password" name="password" type="password" placeholder="密码" isRequired onKeyUp={this.handleKeyUp} />
                <div className="row">
                    <div className="col-sm-3 user-btn-register forget-pw" style={this.forgetStyle}>
                        <Link to="/user/sendForgetPasswordEmail">忘记密码</Link>
                    </div>
                </div>
                <RowSubmit onSubmit={this.handleLogin} name={this.props.btnText} msg={this.state.msg} argeed = { this.state.agreed }/>
            </div>
        );
    }
}

export default LoginForm;

LoginForm.PropTypes = {
    username: PropTypes.string,
    btnText: PropTypes.string,
    auth_callback: PropTypes.string,
    openid: PropTypes.string
};