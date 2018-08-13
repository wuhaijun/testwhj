'use strict';
import Component from './Component';

export default class extends Component {

    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered() {
        setTimeout(initWxLogin,100);
        function initWxLogin() {
            let obj = new WxLogin({
                // self_redirect:true,
                id: "login_container",
                appid: "wxb3ac797fcae4a30a",
                scope: "snsapi_login",
                redirect_uri: encodeURIComponent("http://account.brainboom.cn/api/weixin/oauth2/v2"),
                state: "",
                style: "",
                href: ""
            });
        }
    }

    render() {
        return $(`<div style="text-align: center;;">
                    <p style="font-weight: bold;font-size: 2em;margin-top: 50px;">Hi，欢迎来到脑洞编辑器！</p>
                    <p style="font-weight: lighter;font-size: 1.5em;margin-top: 15px;">想要与众不同，必须创造不同！</p>
                    <div  style="margin-top: 15px;" id="login_container"></div>
                  </div>`);
    }
}