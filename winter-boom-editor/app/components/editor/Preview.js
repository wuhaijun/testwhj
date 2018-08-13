'use strict';

import Component from './../Component';
import SyncToolBar from '../../components/article/SyncToolBar';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
        this.SyncToolBar = new SyncToolBar({parent: this});
    }
    __currentTime__ = () => {
        let d = new Date();
        let strTime = '';
        strTime += d.getFullYear() + '年';
        strTime += d.getMonth() + 1 + '月';
        strTime += d.getDate() + '日';
        return strTime;
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
         </div>`).appendTo($(".preview-bd"));
    };

    __hideLoading__ = () => {
        $(".preview-bd").find(".sync-layer").hide();
    };


    rendered = () => {
        this.find(".preview-close-btn").click(() => {
            this.parent.modal.close();
        });

        let content = this.parent.parent.editor.content();
        let title = this.parent.parent.title.title();
        let cover = this.parent.parent.title.cover();
        let desc = this.parent.parent.editorFooter.digest();
        this.articleId = this.parent.parent.getArticleId();
        let data = this.__currentTime__();

        let cardHtml = `<div class="preview-card">
                            <div class="card-inner">
                                    <div class="card-bd">
                                            <h4 class="card-title">${title}</h4>
                                            <div class="card-infos">
                                                ${data}
                                            </div>
                                            <div class="bg-img" style="background-image: url(${cover});">
                                            </div>
                                            <div class="card-desc">
                                            ${desc}
                                            </div>
                                    </div>
                                    <div class="card-ft">
                                      <i class="fa fa-angle-right"> </i> 阅读原文
                                    </div>

                            </div>
                        </div>`;
        this.find(".article-new").click(() => {
            this.find(".article-new").addClass("active").siblings().removeClass("active");
            this.find(".preview-bd").html('');
            this.find(".preview-bd").html(cardHtml);

            this.find(".card-inner").click(() => {
                this.find(".message-body").click();
            });
        });

        let contentHtml = `<div class="content">
                              <div class="content-warp">
                                    <div class="article-title">
                                        ${title}
                                    </div>
                                    <div class="article-list">
                                        <span class="text data-time"> ${data} </span>
                                        <span class="text name"> 公众号名称 </span>
                                    </div>
                                    <div class="article-body">
                                                ${content}
                                    </div>
                              </div>
                        </div>`;
        this.find(".message-body").click(() => {
            this.find(".message-body").addClass("active").siblings().removeClass("active");
            this.find(".preview-bd").html('');
            this.find(".preview-bd").html(contentHtml);
        });
        this.find(".article-new").click();

        this.find(".send-mobile").click(() => {
            this.find(".send-mobile").addClass("active").siblings().removeClass("active");
            this.find(".preview-bd").html('');
            this.__showLoading__();
            $.get('/article/preview', { article:this.articleId } , json => {
                this.__hideLoading__();
                let qrcodeUrl = json.url;
                let contentQrcode = `<div class="qrcode-content">
                                      <div class="qrcode">
                                            <img src="http://mobile.qq.com/qrcode?url=${ encodeURIComponent(qrcodeUrl) }" alt="">
                                      </div>
                                      <p class="text">扫一扫,手机预览</p>

                                      <h5>文章链接:</h5>
                                      <textarea class="copy-href" readonly>${qrcodeUrl}</textarea>
                             </div>`;

                this.find(".preview-bd").html(contentQrcode);
                if(!qrcodeUrl){
                    this.find(".copy-href").html("预览失败,"+json.errmsg);
                }

            });
        });

    };

    render() {
        return $(`
           <div class="preview-warp">
                <div class="preview-content">
                   <div class="preview-head">
                      公众号名称
                   </div>
                   <div class="preview-bd">
                   </div>
                </div>

                <div class="article-new active">
                      图文消息
                </div>

                <div class="message-body">
                      消息正文
                </div>


                <div class="send-mobile">
                      发送到手机预览
                </div>

                <div class="preview-close-btn">
                       关闭
                </div>

           </div>
        `);
    }
}










