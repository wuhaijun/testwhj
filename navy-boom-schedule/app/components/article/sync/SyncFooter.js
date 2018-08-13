'use strict';
import Component from './../../Component';
export default class extends Component {
    constructor(props) {
        super(props);
        this.selectedMp = {};

        this.$show = null;
        this.$list = null;

        this.rendered();
    }

    __getWechatUser__ = () => {
        (this.mplist || []).forEach(mp => {
            this.selectedMp = this.mplist[0] || {};
            let li = $(`<li id="${mp.id}"><img style="height:35px;width:35px;border-radius:100%;cursor: pointer; list-style: none" src="${ mp.head_img }">${ mp.nick_name }</li>`)
                .click(() => {
                    this.selectedMp = mp;
                    this.$list.toggle();
                    this.__selectWechat__();
                });
            li.appendTo(this.$list);
        });

        this.__selectWechat__();

    };

    __selectWechat__ = () => {
        this.$show.find('span').html('').text('选择公众号');
        this.$show.find('span').append(`<span style="display: inline-block; border-radius: 100%; cursor: pointer; list-style: none; margin-left: 10px;" id="${this.selectedMp.id}"><img width="40px" height="40px" style="border-radius: 50%" src="${ this.selectedMp.head_img }">&nbsp;&nbsp;&nbsp;&nbsp;${ this.selectedMp.nick_name }</span>`);
    };

    __showLoading__ = () => {
         $(`<div class="sync-layer"><div class="load-effect">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
         </div>`).appendTo($("body"));
    };

    __hideLoadingInner__ = () => {
        let $content = $("body").find(".load-effect");
        $content.html('');
        let $tips = $(`<p class="success">同步成功,请 <a href="https://mp.weixin.qq.com/" target="_blank">登陆公众平台</a> 查看同步到公众号的文章</p>`);
        $content.append($tips);
    };

    __hideLoading__ = () => {
        $("body").find(".sync-layer").hide().remove();
    };


    rendered = () => {
        this.$show = this.find('#wechat-selector-show');
        this.$list = this.find('#wechat-selector-list');
        this.$show.click(() => { this.$list.toggle(); });

        this.__getWechatUser__();

        let $syncbtn = this.find("#beginClickSync");
        $syncbtn.click(() => {
            let selectedArticleIds = this.parent.syncMuchArticle.selectedArticleId;
            let choseWechatId = this.selectedMp.id;
            if (selectedArticleIds.length == 0) {
                alert("请选择要同步的文章");
                return false;
            }
            if (!choseWechatId) {
                alert("请选择微信公众号");
                return false;
            }

            if (!!choseWechatId && selectedArticleIds.length > 0) {
                this.__showLoading__();

                $.get('/article/push', { article: selectedArticleIds, mp: choseWechatId}, json => {
                    if (json.status == 'ok') {
                        this.__hideLoadingInner__();
                        setTimeout(() => {
                            this.__hideLoading__();
                        }, 4000);
                    } else {
                        if (json.errcode == "45008") {
                            alert("同步失败,多图文最多一次8篇内容");
                        } else {
                            alert("同步失败," + json.errmsg);
                        }
                        this.__hideLoading__();
                    }
                });
            }
        });

        $("#goBindMore").click(() => {
            window.location.href = window.config['SSO_CLIENT'];
        });
    };

    render() {
        return $(`
                <h6>选择你要同步的公众号</h6>
                <div class="wechat-selector-warp" id="wechat-selector">
                     <div class="wechat-select-show" id="wechat-selector-show"><span></span><em class="wechat-down-icon"><img src="../../../static/images/selebom.png"></em></div>
                     <ul class="wechat-select-list" id="wechat-selector-list">
                     </ul>
                </div>
                 <div class="btn-area">
                    <a id="goBindMore" target="_blank" href=${ window.config['SSO_SERVER'] + '/userCenter/bindWeChat' } >授权更多公众号</a>
                    <button id="beginClickSync">开始同步</button>
                </div>
           </div>
        `);
    }
}










