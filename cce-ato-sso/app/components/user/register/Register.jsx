'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import RowInput from './../../common/RowInput.jsx';
import RowSubmit from './../../common/RowSubmit.jsx';
import RegisterForm from './RegisterForm';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { email: props.location.query.email || '' }
    }

    render() {
        return (
            <div>
                <RegisterForm email={this.state.email} authCallBack={this.props.location.query.authCallback} btnText="注册"/>

                <div className="row divider">
                    <div className="col-sm-3">
                        <span>OR</span>
                    </div>
                </div>

                <div className="row register">
                    <div className="col-sm-3">
                        <span>已有账号</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>
                            <Link to={{pathname:"/user/login",query:{auth_callback:this.props.location.query.authCallback}}}>返回登录</Link>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
