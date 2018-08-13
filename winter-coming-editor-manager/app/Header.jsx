'use strict';

import React from 'react';

const config = window.CONFIG;

export default class Header extends React.Component {

    logout() {

        if (window.confirm("确定退出系统?")) {
            let auth_callback = encodeURIComponent(config['SSO_CLIENT'] + '/api/getToken');
            window.location.href =  config['SSO_SERVER'] + '/api/user/logout?auth_callback=' + auth_callback;
        }
    }

    render () {
        const userCenterInfo = config['SSO_SERVER'] + '/userCenter/info?callback=' + encodeURIComponent(config['SSO_CLIENT']);
        const userCenterAccount = config['SSO_SERVER'] + '/userCenter/account?callback=' + encodeURIComponent(config['SSO_CLIENT']);

        return (
            <div id="header" className="header navbar">
                <ul className="nav navbar-nav navbar-right hidden-xs">
                    <li className="">
                        <a data-toggle="dropdown" className="ripple personinfo" href="javascript:;" aria-expanded="false">
                            <span>
                                <img className="avatar" src={ 'http://boom-static.static.cceato.com/boom/imgs/avatars/' + (this.props.account && this.props.account.avatar || '01.png')} />
                            </span>
                        </a>
                        <ul className="dropdown-menu">
                            <li role="presentation">
                                <a role="menuitem" tabIndex="-1" className="dropdown-menu-list" href={ userCenterInfo } target="_blank">
                                    <i className="fa icon-users" />
                                    个人设置
                                </a>
                            </li>
                            <li role="presentation">

                                <a role="menuitem" tabIndex="-1" className="dropdown-menu-list" href={ userCenterAccount } target="_blank">
                                    <i className="fa fa-gear"/>
                                    修改密码
                                </a>
                            </li>
                            <li className="divider"/>
                            <li role="presentation">
                                <a role="menuitem" tabIndex="-1" className="dropdown-menu-list" onClick={ this.logout } >
                                    <i className="fa icon-logout"/>
                                    退出
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}