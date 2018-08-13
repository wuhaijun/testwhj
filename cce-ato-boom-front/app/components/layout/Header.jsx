'use strict';
const _ = require('lodash');
import AuthorizationUtils from 'koa-sso-auth-cli/AuthorizationUtils';
import {isPC} from '../../../common/Utils';

const React = require('react');
const ReactRouter = require('react-router');
import {Link} from 'react-router';

const confirm = require('../../../common/AlertUtils').confirm;
const config = require('../../../common/config');
const {event, CATEGORYS, ACTIONS} = require('../../../common/TrackUtils');

class Header extends React.Component {

    handlerKeyUp(e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            let v = e.target.value;
            if (v && v.length > 0) {
                ReactRouter.browserHistory.push(`/search/${v}`);
            }
            $(this.refs.searchBtn).click();
            e.target.value = null;
        }
    }

    logout() {
        confirm({
            title: '确定退出吗？',
            callback: function () {
                let auth_callback = encodeURIComponent(config.get('sso_client') + '/api/getToken');
                window.location.href = config.get('sso_server') + '/api/user/logout?auth_callback=' + auth_callback;
            }
        });
    }

    render() {
        const {href} = this.props;
        const userCenterInfo = config.get('sso_server') + '/userCenter/info?callback=' + encodeURIComponent(href);
        const userCenterAccount = config.get('sso_server') + '/userCenter/account?callback=' + encodeURIComponent(href);
        let modules = _.filter(AuthorizationUtils.listHasAuthModules(), m => m.id != 'boom');
        return (
            <div id='boom-header' className="header navbar">
                <div className="brand visible-xs">
                    <div className="toggle-offscreen">
                        <a href="javascript:;" className="hamburger-icon visible-xs" data-toggle="offscreen"
                           data-move="ltr">
                            <span></span>
                            <span></span>
                            <span></span>
                        </a>
                    </div>
                    <Link className="brand-logo" to="/home">
                        <span>脑洞 BOOM</span>
                    </Link>
                </div>
                <ul className="nav navbar-nav hidden-xs">
                    <li>
                        <a href="javascript:;" className="small-sidebar-toggle ripple" data-toggle="layout-small-menu">
                            <i className="icon-toggle-sidebar"></i>
                        </a>
                    </li>
                    <li className="searchbox">
                        <a href="javascript:;" data-toggle="search" ref="searchBtn">
                            <i className="search-close-icon icon-close hide"></i>
                            <i className="search-open-icon icon-magnifier"></i>
                        </a>
                    </li>
                    <li className="navbar-form search-form hide">
                        <input type="search" className="form-control search-input" placeholder="Search ..."
                               onKeyUp={this.handlerKeyUp.bind(this)}/>
                    </li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    <li className="">
                        <a data-toggle="dropdown" className="ripple personinfo"
                           onClick={e => event(CATEGORYS.BUTTONS, ACTIONS.PERSON_INFO_FOLD)}
                           href="javascript:;" aria-expanded="false">
                            <span>
                                <img className="avatarlogo"
                                     src={'http://boom-static.static.cceato.com/boom/imgs/avatars/' + (this.props.account.avatar || '01.png')}/>
                                {isPC && ((this.props.account && this.props.account.nickname) || this.props.account.username || 'Loading...')}
                            </span>

                        </a>


                        <ul className="dropdown-menu">

                            <li role="presentation">
                                <a role="menuitem" className="dropdown-menu-list" href={userCenterInfo} target="_blank">
                                    <i className="fa icon-users"></i>
                                    个人设置
                                </a>
                            </li>

                            <li role="presentation">
                                <a role="menuitem" className="dropdown-menu-list" href={userCenterAccount}
                                   target="_blank">
                                    <i className="fa fa-gear"></i>
                                    修改密码
                                </a>
                            </li>

                            {(modules && modules.length > 0) ? (<li className="divider"></li>) : ''}
                            {
                                _.map(modules, m => (
                                    <li key={'module' + m.id} role="presentation">
                                        <a role="menuitem" className="dropdown-menu-list" href={'http://' + m.host}
                                           target="_blank">
                                            <i className={m.icon}></i>
                                            {m.name}
                                        </a>
                                    </li>
                                ))
                            }
                            <li className="divider"></li>
                            <li role="presentation">
                                <a role="menuitem" className="dropdown-menu-list" onClick={this.logout}>
                                    <i className="fa icon-logout"></i>
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

module.exports = Header;