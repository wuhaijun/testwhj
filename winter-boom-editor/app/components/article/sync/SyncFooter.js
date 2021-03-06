'use strict';
import Component from './../../Component';
import loadingUtils from '../../../utils/loadingUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }

    __getWechatUser__ = () => {
        let $show = this.find("#wechat-selector-show");
        let $list = this.find("#wechat-selector-list");
        $.getJSON('/wechat/mplist', (list) => {
            let bindNumber = list;
                bindNumber.forEach((c, i )=> {
                    let $li = $(`
                            <li>
                                <input type="radio" name="item" id="${c._id}">
                                <label for="${c._id}"></label>
                                <img style="height:35px;width:35px;border-radius:100%;" src="${c.head_img}">
                                    ${c.nick_name}
                            </li>
                        `).css({cursor: 'pointer', listStyle: 'none'}).appendTo($list);
                    if (i === 0) {
                        $li.children('input').prop('checked','checked');
                    }
                    $li.on('click',function () {
                        let $this = $(this);
                        $this.children('input').prop('checked','checked');
                    })
                });            
        });

    };

    __showLoading__ = () => {
        loadingUtils.showGlobalLoading();
    };

    __hideLoadingInner__ = () => {
        let $content = $("body").find(".load-effect");
        $content.html('');
        let $tips = $(`<p class="success">同步成功,请 <a href="https://mp.weixin.qq.com/" target="_blank">登陆公众平台</a> 查看同步到公众号的文章</p>`);
        $content.append($tips);
    };

    __hideLoading__ = () => {
        loadingUtils.hideGlobalLoading();
    };


    rendered = () => {
        this.__getWechatUser__();
        let $wechatSelectorShow = this.find("#wechat-selector-show");
        $wechatSelectorShow.click(() => {
            $wechatSelectorShow.children("em").removeClass("wechat-down-icon").addClass("wechat-up-icon");
            $('#wechat-selector-list').toggle();
        });

        let $syncbtn = this.find("#beginClickSync");
        $syncbtn.click(() => {
            let typeSync = this.parent.typeSync;
            let $list = this.find("#wechat-selector-list");
            if (typeSync == 1) {

                let choseArticleArray = this.parent.syncBatch.returnSelected();
                let choseWechatId = $list.children('li').children("input[type='radio']:checked").attr("id");
                if (choseArticleArray.length == 0) {
                    alert("请选择要同步的文章");
                    return false;
                }
                if (!choseWechatId) {
                    alert("请选择微信公众号");
                    return false;
                }

                if (!!choseWechatId && choseArticleArray.length > 0) {
                    this.__showLoading__();
                    $.get('/wechat/sync', {article: choseArticleArray, mp: choseWechatId}, json => {
                        if (json.successList && json.successList.length > 0) {
                            this.__hideLoadingInner__();
                            setTimeout(() => {
                                this.__hideLoading__();
                            }, 4000);
                        } else {

                            if (json.errmsgList && json.errmsgList.length > 0) {
                                alert("同步失败," + json.errmsgList[0].errmsg);
                            } else {
                                alert("同步失败," + json.errmsg);
                            }

                            this.__hideLoading__();
                        }
                    });
                }


            } else {

                let choseArticleArray = this.parent.syncMuchArticle.returnSelected();
                let choseWechatId = $list.children('li').children("input[type='radio']:checked").attr("id");
                if (choseArticleArray.length == 0) {
                    alert("请选择要同步的文章");
                    return false;
                }
                if (!choseWechatId) {
                    alert("请选择微信公众号");
                    return false;
                }

                if (!!choseWechatId && choseArticleArray.length > 0) {
                    this.__showLoading__();
                    $.get('/wechat/push', {article: choseArticleArray, mp: choseWechatId}, json => {
                        if (json.status == "ok") {
                            this.__hideLoadingInner__();
                            setTimeout(() => {
                                this.__hideLoading__();
                            }, 4000);
                        } else {
                            if (json.errmsgList && json.errmsgList.length > 0) {
                                    alert("同步失败," + json.errmsgList[0].errmsg);
                            } else {
                                alert("同步失败," + json.errmsg);
                            }
                            this.__hideLoading__();
                        }
                    });
                }

            }

        });

        $("#goBindMore").click(() => {
            window.location.href = window.config['SSO_CLIENT'];
        });


    };

    render() {
        return $(`
                    <div class="sync-Tencent">
                        同步至公众号
                        <a id="goBindMore" target="_blank" href=${ window.config['SSO_SERVER'] + '/userCenter/bindWeChat' } ><i></i>授权更多公众号</a>
                    </div>
                    <div class="wechat-selector">
                        <div class="wechat-selector-warp wechat-selector-warp-height" id="wechat-selector">
                            <ul class="wechat-select-list" id="wechat-selector-list">
                            </ul>
                        </div>
                    </div>
                    <div class="btn-area">
                        <button id="beginClickSync">确认</button>
                        <button id="cancelClickSync" class="close" data-dismiss="modal" aria-label="Close">取消</button>
                    </div>
           </div>
        `);
    }
}










