'use strict';

import Component from './../../Component';

export default class extends Component {
    constructor(props) {
        super(props);

        this.rendered();
    }

    rendered = () => {
        let $completeAdd = this.find("#completeAdd");
        $completeAdd.click( () =>  {
            this.parent.confirmBind();
        });
    };

    render() {
        return $(`
            <div class="bind-wechat-body">
                 <div class="go-bind-container">
                    <div><img class="box-img" src="../../../static/images/box.png"></div>
                    <div class="tips-text">已绑定公众号</div>
                    <p id="completeAdd">确认完成</p>
                </div>
            </div>
        `);
    }
}













