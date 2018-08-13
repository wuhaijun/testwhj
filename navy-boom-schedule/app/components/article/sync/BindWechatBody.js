'use strict';

import Component from './../../Component';

export default class extends Component {
    constructor(props) {
        super(props);

        this.rendered();
    }

    rendered = () => {
        let $addBindbtn = this.find("#goAddBind");
        $addBindbtn.click( () =>  {
            this.parent.goConfirmBindWechat();
        });
    };

    render() {
        return $(`
            <div class="bind-wechat-body">
                 <div class="go-bind-container">
                    <div><img class="box-img" src="../../../static/images/box.png"></div>
                    <div class="tips-text">还没有绑定任何公众号</div>
                    <a id="goAddBind" target="_blank" href=${ window.config['SSO_SERVER'] + '/userCenter/bindWeChat'}>添加</a>
                </div>
            </div>
        `);
    }
}










