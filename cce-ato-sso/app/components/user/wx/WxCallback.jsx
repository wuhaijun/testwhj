import React, { Component } from 'react';
import { wx } from './wx.css';
import LoginForm from './../login/LoginForm.jsx';
import RegisterForm from './../register/RegisterForm';

class WxCallback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasAccount: true
        }
    }

    componentDidMount() {
        this.setState({ openid: this.props.location.query.openid });
    }


    typeSelect = (hasAccount) => {
        this.setState({ hasAccount: hasAccount });
    }

    btnStyle = {
        color: '#000',
        padding: '6px 20px'
    }

    btnActiveStyle = {
        color: '#5F63C1',
        borderBottom: '2px solid #5F63C1',
        padding: '6px 20px',
    }

    render() {
        let { hasAccount } = this.state;
        let btn1Style = hasAccount ? this.btnActiveStyle : this.btnStyle;
        let btn2Style = hasAccount ? this.btnStyle : this.btnActiveStyle;
        return (
            <div>
                <span className="select-container">
                    <a href="#" className="select-btn" style={btn1Style} onClick={() => this.typeSelect(true)}>已有脑洞账号，请绑定</a>
                    <a href="#" className="select-btn" style={btn2Style} onClick={() => this.typeSelect(false)}>没有脑洞账号，请注册</a>
                </span>
                <div className="welcome-text">
                    <p>Hi,{this.props.location.query.nickname} 欢迎来到脑洞，完成绑定后可以使用微信账号一键登录。</p>
                </div>
                {hasAccount ? <LoginForm btnText="确认绑定" openid={this.state.openid} /> : <RegisterForm btnText="注册并绑定" openid={this.state.openid}/>}
            </div>
        );
    }
}

export default WxCallback;