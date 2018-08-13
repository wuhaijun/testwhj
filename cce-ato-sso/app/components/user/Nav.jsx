'use strict';
const _ = require('lodash');
const React = require('react');
const config = require('../../../common/config.js');

const mq = window.matchMedia("(min-width: 768px)");
const isPC = mq.matches;

class Header extends React.Component {

    logout() {
        if (confirm('确定退出吗？')) {
            window.location.href =  '/api/user/logout';
        }
    }

    render() {
        let { account } = this.props;
        return(
            <div id='sso-nav' className="navbar">
                <ul className="nav navbar-nav navbar-right hidden-xs">
                    <li className="">
                        <a data-toggle="dropdown" className="ripple personinfo" href="javascript:;" aria-expanded="false">
                            <span>
                                <img className="avatarlogo" src={ 'http://boom-static.static.cceato.com/boom/imgs/avatars/' + (account.avatar || '01.png')  } />
                                { isPC && ((this.props.account && this.props.account.nickname)|| this.props.account.username ||'Loading...') }
                            </span>
                        </a>
                        <ul className="dropdown-menu menu-information">

                            {
                                _.map(this.props.account.modules, m => (
                                    <li key={'module-' + m.id} role="presentation">
                                        <a role="menuitem" className="dropdown-menu-list" href={'http://' + m.host} target="_blank">
                                            <i className={m.icon}></i>
                                            {m.name}
                                        </a>
                                    </li>
                                ))
                            }
                            <li className="divider"></li>
                            <li role="presentation">
                                <a role="menuitem" className="dropdown-menu-list" onClick={this.logout}>
                                    <i className="fa fa-sign-out"></i>
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