'use strict';
import Component from './Component';
import { isFunction } from '../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }

    __handleLogout__ = () => {
        this.confirm("确定退出编辑器?", () => {
            let auth_callback = encodeURIComponent(window.config['SSO_CLIENT'] + '/api/getToken');
            window.location.href = window.config['SSO_SERVER'] + '/api/user/logout?auth_callback=' + auth_callback;
        });
    };

    rendered = () => {
        let $tools = this.find('.tools');
        let $toolsDiv = this.find('.tools-div');

        $tools.on('mousemove', function () {
            $toolsDiv.fadeIn({ duration: 200 });
        })
        $tools.on('mouseleave', function () {
            $toolsDiv.fadeOut({ duration: 100 });
        })

        if (!window.account) {
            return;
        }
        let modules = window.modules || [];
        let menus = [];
        menus.push(new DropdownMenu({ name: '个人设置', href: window.config['SSO_SERVER'] + '/userCenter/info', icon: 'fa icon-users' }));
        menus.push(new DropdownMenu({ name: '修改密码', href: window.config['SSO_SERVER'] + '/userCenter/account', icon: 'fa fa-gear' }));

        /* menus.push('<li class="divider"></li>'); */
        /* modules.forEach(module => {
            menus.push(new DropdownMenu({ name: module.name, href:"http://"+ module.host, icon: module.icon }))
        }); */
        menus.push('<li class="divider"></li>');
        menus.push(new DropdownMenu({ name: '退出', icon: 'fa icon-logout', target: '_self', onClick: this.__handleLogout__ }));

        let $dropdownMenu = this.find('ul.dropdown-menu');
        menus.forEach(menu => {
            if (menu instanceof Component) {
                menu = menu.rendered();
            }
            $dropdownMenu.append(menu);
        });
    };

    render() {
        let account = window.account;

        let content;
        if (account) {
            let headImg = (account.weixin && account.weixin.headimgurl ) || (account.avatar && 'http://boom-static.static.cceato.com/boom/imgs/avatars/' + account.avatar) ||  'http://boom-static.static.cceato.com/boom/imgs/avatars/01.png';
            let name = account.nickname || account.username || account.weixin.nickname;
            content = `
                <a data-toggle="dropdown" class="ripple" href="javascript:;" aria-expanded="false">
                    <span class="img-wrap">
                        <img class="avatar" src="${ headImg}"/>
                        &nbsp;${ name}
                    </span>
                    <span></span>
                </a>
                <ul class="dropdown-menu"></ul>
            `;
        } else {
            content = `
            <div class="login">
                <a href="${ window.config['SSO_SERVER'] + '/user/register'}">注册</a>
                <a class="page-nav-btn" href="${ window.config['SSO_SERVER'] + '/user/login'}">登录</a>
            </div>`;
        }


        return $(`
            <header class="headroom">
                ${ content}
                <div class="page-nav-box">
                    <a href="/" target="_blank"><img class="page-nav-logo" src="/static/images/logo.jpg" alt=""></a>
                    <div class="page-nav-div">
                        <ul>
                            <li class="page-nav-div-li">
                                <a href="/editor" target="_blank">编辑器</a >
                                <span class="page-nav-div-li-span"></span>
                            </li>
                            <li class="page-nav-div-li">
                                <a href="/styles" target="_blank">样式中心</a >
                                <span></span>
                            </li>
                            <li class="tools">
                                <div class="tools-tool">
                                    <a href="javascript:;">工具</a >
                                    <span></span>
                                </div>
                                <div class="tools-div">
                                    <ul>
                                        <li><a href="http://boom.brainboom.cn/" target="_blank">脑洞资讯</a></li>
                                        <li><a href="http://calendar.brainboom.cn/" target="_blank">营销日历</a></li>
                                        <li><a href="http://hothub.brainboom.cn/" target="_blank">热点中心</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>`
        );
    }
}

class DropdownMenu extends Component {

    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered() {
        let onClick = this.onClick;
        if (onClick && isFunction(onClick)) {
            this.click(() => {
                onClick();
            });
        }
    }

    render() {
        let { href, icon, name, target } = this;
        return $(
            `<li role="presentation">
                <a role="menuitem" tabindex="-1" class="dropdown-menu-list" href=${ href || 'javascript:void(0);'} target="${target || '_blank'}">
                    <i class=${ icon}></i>
                    ${ name}
                </a>
            </li>`
        );
    }
}