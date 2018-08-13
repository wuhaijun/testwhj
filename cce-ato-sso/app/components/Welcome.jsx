'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Welcome extends Component {
    render () {
        return (
            <div>
                <h1>Welcome to sso system.</h1>
                <p>
                    <a href="/userCenter">用户中心</a>
                </p>
                <p>
                    <a href="/api/user/logout">退出</a>
                </p>

            </div>
        );
    }
}
