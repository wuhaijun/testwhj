'use strict';
import Component from './../Component';
export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
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

        let content = this.id;
        let title = this.article.title;
        let date = this.__currentTime__();

        this.find(".message-body").click(() => {
            this.find(".message-body").addClass("active").siblings().removeClass("active");
            this.find(".preview-bd").html('');
            this.__showLoading__();
            $.get('/article/content', { _id: this.article._id }, json => {
                this.__hideLoading__();
                let contentHtml = `
                <div class="content">
                      <div class="content-warp">
                            <div class="article-title">
                                ${ title }
                            </div>
                            <div class="article-list">
                                <span class="text data-time"> ${ date } </span>
                                <span class="text name"> 公众号名称 </span>
                            </div>
                            <div class="article-body">
                                 ${ json.result }
                            </div>
                      </div>
                </div>`;

                this.find(".preview-bd").html(contentHtml);
            });
        });
        this.find(".message-body").click();

        this.find(".send-mobile").click(() => {
            this.find(".send-mobile").addClass("active").siblings().removeClass("active");
            this.find(".preview-bd").html('');
            this.__showLoading__();
            $.get('/article/preview', { article: this.article._id } , json => {
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


                <div class="message-body active">
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










