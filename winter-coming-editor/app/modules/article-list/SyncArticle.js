'use strict';
import _ from 'lodash';
import modal from '../../utils/modal';

export default function () {

    //判断是否有文章
    (function confirmHaveArticle() {
        $.getJSON('/article/list', {page: 1 / 1, size: 1 / 1}, list => {

            if (list.pagination.count === 0) {

                let tipSmallAlert = $(`
                    <div class="tipSmallAlert">
                          你还没有创建自己的文章哦!
                    </div>
                `)

                tipSmallAlert.appendTo("#editor-article-module .body-content");

                setTimeout(function () {
                    $(".tipSmallAlert").remove();
                }, 1000)

            } else {
                confirmBind();
            }
        });
    })();

    //判断使用是否有权限去绑定
    function confirmBind() {
        $.getJSON('/wechat/mplist', result => {
            let bindNumber = result || {};
            if (bindNumber.length != 0) {
                goSync();
            } else {
                openGoBind();
            }
        });
    }


    //打开绑定弹窗(提示去添加绑定的弹窗)
    function openGoBind() {
        let goBindContainer = $(`
            <div class="go-bind-container">
                    <div class="closealertBtn">X</div>
                    <div><img class="box-img" src="../../../static/images/box.png"></div>
                    <div class="tips-text">还没有绑定任何公众号</div>
                    <a id="goAddBind" target="_blank" href=${ window.config['SSO_SERVER'] + '/userCenter/bindWeChat'}>添加</a>
                    <p id="completeAdd">点击完成</p>
            </div>
        `);
        modal.openSimple('', goBindContainer, close);

        $("#goAddBind").click(function () {
            $(this).hide();
            $(".tips-text").text("已绑定公众号");
            $("#completeAdd").show();
        });
        $("#completeAdd").click(function () {
            modal.close();
            confirmBind();
        });
        $(".closealertBtn").click(function () {
            modal.close();
        });
        changeModalContentCss();
    }

    //打开同步弹窗,可以做同步操作
    function goSync() {
        let goSynccontainer = $(`
            <div class="go-sync-container">

                    <div class="closealertBtn">X</div>

                    <div style="clear:both; width:80%;margin:auto;">
                        <h6>选择你要同步的文章</h6>
                        <ul id="choseSyncArticle" class="choseArticle" style="height:150px;overflow:hidden;position:relative;margin:0;padding:0;list-style: none;float: left;width:100%;">
                        </ul>
                        <div style="text-align:right;clear:both;">
                                <span id="lastPagination">上一页</span>
                                <span id="nextPagination">下一页</span>
                        </div>

                        <h6 style="margin-top:20px;">选择你要同步的公众号</h6>
                        <div class="wechat-selector-warp" id="wechat-selector">
                            <div class="wechat-select-show" id="wechat-selector-show"><span>选择公众号</span><em><img src="../../../static/images/selebom.png"></em></div>
                             <ul class="wechat-select-list" id="wechat-selector-list">
                             </ul>
                        </div>
                    </div>

                    <div style="width:80%;margin:0 auto;position:relative:z-index:-1;">
                            <a id="goBindMore" target="_blank" href=${ window.config['SSO_SERVER'] + '/userCenter/bindWeChat' } >授权更多公众号</a>
                            <button id="beginClickSync">开始同步</button>
                    </div>

            </div>
        `)

        modal.openSimple('', goSynccontainer, close);

        //文章列表渲染
        let page = 1 / 1;
        let size = 3 / 1;
        let paginationInfo = [];
        let choseArticleArray = [];

        function articleList(page, size) {
            $.getJSON('/article/list', {page: page, size: size}, list => {
                paginationInfo = list.pagination;

                if (paginationInfo.hasPrev === true) {
                    $('#lastPagination').css({"display": "inline-block"})
                } else {
                    $('#lastPagination').css({"display": "none"})
                }
                if (paginationInfo.hasNext === false) {
                    $('#nextPagination').css({"display": "none"})
                } else {
                    $('#nextPagination').css({"display": "inline-block"})
                }
                _.each(list.list, c => {
                    let li = $(`
                             <li id="${c._id}" class="wechat-li-article">
                                         <div>
                                            <img class="bgimg" src="${c.cover}" alt="">
                                         </div>
                                         <div class="article-title">
                                               ${c.title}
                                         </div>
                                         <div class="update-time">
                                               ${c.lastUpdated.substr(0, 10)}
                                         </div>
                             </li>
                `).click(e => {
                        if (li.hasClass("choseIcon")) {
                            li.removeClass("choseIcon");
                            choseArticleArray.splice(1, choseArticleArray.findIndex(it => it === c._id));

                        } else {
                            li.addClass("choseIcon");
                            choseArticleArray.push(c._id);
                        }

                    });
                    if (choseArticleArray.indexOf(c._id) != -1) {
                        li.addClass('choseIcon');
                    }
                    li.appendTo("#choseSyncArticle");
                });
            });

        }

        articleList(page, size);

        $('#nextPagination').click(function () {
            page = page + 1;
            $('#choseSyncArticle').html('');
            articleList(page, size);
        });

        $('#lastPagination').click(function () {
            page = page - 1;
            $('#choseSyncArticle').html('');
            articleList(page, size);
        });

        // 公众号下拉列表渲染
        (function getWechatUser() {
            let $show = $('#wechat-selector-show');
            let $list = $('#wechat-selector-list');
            $.getJSON('/wechat/mplist', function (list) {
                let bindNumber = list;
                if (!!bindNumber && bindNumber.length != 0) {
                    _.each(list, c => {
                        let li = $(`
                             <li id="${c._id}">
                                    <img style="height:35px;width:35px;border-radius:100%;" src="${c.head_img}">
                                    ${c.nick_name}
                             </li>

                        `)
                            .css({cursor: 'pointer', listStyle: 'none'})
                            .click(e => {
                                $show.children('span').html(li.clone());
                                $list.hide();
                                $show.children('em').addClass("wechat-down-icon");
                            });

                        li.appendTo($list);
                    });
                }
            });
            $(".closealertBtn").click(function () {
                modal.close();
            })
        })();

        $('#wechat-selector-show').click(function () {
            $(this).children("em").removeClass("wechat-down-icon").addClass("wechat-up-icon");
            $('#wechat-selector-list').toggle();
        });

        $(".wechat-selector-warp").mouseleave(function () {
            $(".wechat-select-list").hide();
            $(this).children(".wechat-select-show").find("em").addClass("wechat-down-icon");
        });

        let isSync = false;
        $("#beginClickSync").click(function () {
            let choseWechatId = $("#wechat-selector-show").children('span').children('li').attr("id");
            let syncBtn = $("#beginClickSync");
            if (choseArticleArray.length == 0) {
                alert("请选择要同步的文章");
                return false;
            }
            if (!choseWechatId) {
                alert("请选择微信公众号");
                return false;
            }

            if (isSync) {
                return;
            }
            isSync = true;
            syncBtn.addClass('btn-sky');
            syncBtn.attr('disabled', true);
            syncBtn.text('提交中...');

            if (!!choseWechatId && choseArticleArray.length > 0) {

                $.get('/wechat/sync', {article: choseArticleArray, mp: choseWechatId}, json => {

                    setTimeout(() => {
                        isSync = false;
                        syncBtn.text('开始同步');
                        syncBtn.removeClass('btn-sky');
                        syncBtn.removeAttr('disabled');

                    }, 2000);

                    if (!!json.successList && json.successList.length > 0) {
                        choseArticleArray = [];
                        modal.close();
                        wetchatSyncSuccess();
                    } else {

                        alert("同步失败," + json.errmsgList[0].errmsg);
                    }

                });

            }


        })

        $("#goBindMore").click(function () {
            window.location.href = window.config['SSO_CLIENT'];
            modal.close();
        })

        changeModalContentCss();

    }

    //同步成功后的提示弹窗
    function wetchatSyncSuccess() {

        let syncSuccessContainer = $(
            `
             <div id="alertSync" style="width:500px;height: 300px;text-align:center;background-color: #f9fafb";position:relative;>
                    <div class="closealertBtn" style="position:absolute;top:10px;left:10px;color:#999;font-size:12px;cursor: pointer;">X</div>
                    <div><img style="height:70px;width:90px;margin-top: 80px;" src="../../../static/images/sync.png"></div>
                    <div style="color: #585858;margin-top: 15px;margin-bottom: 15px;">同步完成</div>
            </div>
        `)

        modal.openSimple('', syncSuccessContainer, close);
        changeModalContentCss();

        $(".closealertBtn").click(function () {
            window.location.href = window.config['SSO_CLIENT'];
            modal.close();
        })
        $("#winter-editor-modal").click(function () {
            window.location.href = window.config['SSO_CLIENT'];
        })

    }

    //修改弹窗的样式 公共方法
    function changeModalContentCss() {
        $(".modal-content").css({
            "background-color": "#f9fafb",
            "width": "60%",
            "minwidth": "600px",
            "margin-top": "120px"
        });
    }

}