'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import RowProgressBar from './../common/RowProgressBar.jsx';

export default class ResetPasswordOk extends Component {
    render () {
        return (
            <div>
                <RowProgressBar current={ 3 }/>
                <div className="row">
                    <div className="col-sm-3">
                        <h3>恭喜你! 密码找回成功!</h3>
                        <Link to="/user/login">返回首页登录</Link>
                    </div>
                </div>
            </div>
        );
    }
}
