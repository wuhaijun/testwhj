'use strict';
import Component from './Component';
import loginUtils from '../utils/loginUtils';
import uploadUtil from './UploadUtil';
import { isFunction } from '../../common/TypeUtils';
import Pagination from './Pagination';
import WxLogin from './WxLogin';

const imageType = { 'ALL': '全部', "IPAIPAI": "小程序相册", "NEWGROUP": "新建分组" };
const oauth2Config = {
    "url": "https://open.weixin.qq.com/connect/qrconnect?appid=#APPID#&redirect_uri=#REDIRECT_URI#&response_type=code&scope=snsapi_login&state=#STATE##wechat_redirect",
    "appId": "wxb3ac797fcae4a30a",
    "redirectUrl": "http://account.brainboom.cn/api/weixin/oauth2"
}

export default class extends Component {
    constructor(props) {
        super(props);
        this.type = imageType.ALL;

        this.ippTotal = 0;
        this.ippLimit = 10;
        this.ippSkip = 0;

        this.imagePage = 1;
        this.imageSize = 20;
        this.imageMaxPage = 0;
        this.imagePagination = null;

        this.ippRequest;
        this.imageRequest;

        this.rendered();
    }

    __oauth2__ = () => {
        const appId = oauth2Config.appId;
        const redirectUrl = oauth2Config.redirectUrl;
        const account = window.account;
        if (!account) {
            alert('请登录');
            return;
        }
        let url = oauth2Config.url.replace("#APPID#", appId)
            .replace("#REDIRECT_URI#", encodeURIComponent(`${redirectUrl}?username=${account.username}&origin=${window.location.href}`))
            .replace("#STATE#", "123");
        window.open(url);
    };

    __masonry__() {
        let $styles = this.find('#styles');
        $styles.masonry({
            itemSelector: '.map-depot',
            columnWidth: 160,
            gutter: 10,
            isFitWidth: true
        });
    }

    __cleanStyles__() {
        this.ippSkip = 0;
        this.imagePage = 1;
        if (this.ippRequest != null) this.ippRequest.abort();
        if (this.imageRequest != null) this.imageRequest.abort();
        let $styles = this.find('#styles');
        $styles.html('');
        $styles.css({ 'height': '0' });
    }

    __loadStyles__() {
        let $comp = this;
        //this.__masonry__();
        this.__cleanStyles__();
        if (this.type === imageType.IPAIPAI) {
            this.__requestIpaipai__(this.ippSkip, this.ippLimit);
            $comp.content.ippInterval = setInterval(function () {
                $.get(`/images/ipaipai/check`, { oldSize: $comp.ippTotal }, json => {
                    if (json.update) {
                        $comp.__requestIpaipai__(this.ippSkip, this.ippLimit);
                    }
                });
            }, 3000)

            this.find('.upload-btn').hover(function () {
                $(".sun").fadeIn(200);
            }, function () {
                $(".sun").fadeOut();
            });

        } else {
            this.find('.upload-btn').unbind('mouseenter').unbind('mouseleave');
            this.__requestImage__($comp.imagePage, $comp.imageSize);
        }
    }

    __requestIpaipai__(skip, limit, refresh = true) {
        let $comp = this;
        let $styles = this.find('#styles');
        this.ippRequest = $.get('/images/ipaipai/list', { limit: limit, skip: skip }, json => {
            if (json.status == "fail") {
                let $connectAlert = $comp.find('#connectAlert');
                $connectAlert.children('a').click(() => {
                    $comp.__oauth2__();
                });
                $connectAlert.show();
                return;
            } else {
                $comp.ippTotal = json.total;
                (json.photos || []).forEach(item => {
                    let $box = $(`
                    <div class="map-depot" id="image-${ item._id}">
                       <div class="image-wrap">
                            <img class="lazyload" src="${ item.url }" width="100%" height="auto">
                       </div>

                    </div>`);
                    $styles.append($box).masonry().masonry('appended', $box);
                    setTimeout(() => {
                        this.__masonry__();
                    }, 500);

                    $box.click((e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.content.changeImageCallback(item, window.config['QINIU_OUT_LINK']);
                    });

                });
            }

            if (refresh) {
                $comp.imagePagination = new Pagination($comp.ippLimit, $comp.ippTotal, $comp.__ipaipaiPagination__, $comp);
            }
            if ($comp.ippTotal > $comp.ippLimit) {
                $styles.append($comp.__ipaipaiPagination__.render());
            }

            let $ipaipaiAlert = $comp.find('#ipaipaiAlert');
            if ($comp.ippTotal === 0) {
                $comp.__cleanStyles__()
                $ipaipaiAlert.show();
            }

        });
    }

    __requestImage__(page, pageSize, refresh = true) {
        let $comp = this;
        let $styles = this.find('#styles');
        if (this.ippRequest != null) this.ippRequest.abort();
        if (this.imageRequest != null) this.imageRequest.abort();
        $styles.html('');
        $styles.css({ 'height': '0' });
        this.imageRequest = $.get('/images/list', { page: page, size: pageSize }, json => {
            $comp.imageMaxPage = json.pagination.maxPage;
            json.list.forEach(item => {
                let $box = $(`
                    <div class="map-depot" id="image-${ item._id}">
                      <div class="image-wrap">
                            <img class="lazyload" src="http://editor.static.cceato.com/${ item.key }" width="100%" height="auto">
                            <i class="fa fa-trash-o icon mask-del-icon"></i>
                      </div>
                      <div class="image-name" style="width: 100%;
                      overflow: hidden;
                      color: #888;
                      font-weight: bold;
                      text-overflow: ellipsis;
                      white-space: nowrap;">${ item.name}</div>
                    </div>`);
                //$box.find('img.lazyload').lazyload();

                $styles.append($box).masonry().masonry('appended', $box);
                setTimeout(() => {
                    this.__masonry__();
                }, 500);

                $box.click((e) => {
                    this.content.changeImageCallback(item, "http://editor.static.cceato.com/");
                });

                let $delBtn = $box.find('.mask-del-icon');
                this.__popover__($delBtn, {
                    title: ``,
                    content: `<div style="padding:5px 0">确定删除这张图片吗?</div>`,
                    ok: () => {
                        $.get('/images/delete', { image: item._id }, json => {
                            if (json.status == "ok") {
                                $box.remove();
                                this.__masonry__();
                            }
                        });
                    }
                });
            });
            if (refresh) {
                this.imagePagination = new Pagination(this.imageSize, this.imageMaxPage, this.__imagePagination__, this);
            }
            if ($comp.imageMaxPage > $comp.imageSize) {
                $styles.append(this.imagePagination.render());
            }
        });
    }


    __uploadImages__() {
        if (!loginUtils.checkAlert()) return;
        uploadUtil('NO_CATEGORY', true, () => {
            this.__loadStyles__();
        });
    }
    __remove__() {
        let $popover = $('.popover.bottom');
        $popover.remove();
    }

    rendered() {

        let $comp = this;
        let $connectAlert = $comp.find('#connectAlert');
        let $ipaipaiAlert = $comp.find('#ipaipaiAlert');
        $connectAlert.hide();
        $ipaipaiAlert.hide();

        $('body').on('click', () => {
            this.__remove__();
        })

        if(!loginUtils.check()) {
            let wxLogin = new WxLogin();
            $comp.html(wxLogin);
            return;
        }


        this.find('.styles-wrapper').scroll(function () {
            $comp.__remove__();
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) {
                if ($comp.total <= $comp.skip) {
                    $('.center-bottom').css('display', "block");
                    return;
                }
                if ($comp.canScroll) {
                    $comp.loadStyle({
                        type: $comp.parent.centerHeader.type,
                        keywords: $comp.parent.centerHeader.keywords,
                        skip: $comp.skip,
                        limit: $comp.limit
                    }, false);
                    $comp.skip += $comp.limit
                }
            }
        });


        let $types = this.find('.types');
        $types.children('a').click(function (e) {
            e.preventDefault();
            e.stopPropagation();

            let $this = $(this);
            $this.siblings().removeClass('active');
            $this.addClass('active');

            $comp.type = $(this).text();
            $comp.__loadStyles__();
        });
        $($types.children('a')[0]).click();



        let $uploadImg = $comp.find('.upload-btn');
        $uploadImg.click(() => {
            if (this.type === imageType.ALL) {
                this.__uploadImages__();
            }
        });
        // this.__scrollRequestMore__();
    }


    __imagePagination__(pageSize, page) {
        // this.__loadStyles__(pageSize, pageSize * (pageNum - 1), false)
        this.__requestImage__(page, pageSize, false);
    }

    __ipaipaiPagination__(pageSize, page) {
        this.__requestIpaipai__(pageSize, pageSize * (page - 1), false);
    }

    __scrollRequestMore__() {
        let $comp = this;
        let $stylesWrapper = this.find('.styles-wrapper');
        $stylesWrapper.scroll(function () {
            let scrollTop = $(this).scrollTop();
            let windowHeight = $(window).height();
            let scrollHeight = $(this).find('#styles').height();
            if (scrollHeight - windowHeight < scrollTop) {
                if ($comp.type === imageType.IPAIPAI) {
                    if ($comp.ippTotal <= $comp.ippSkip) return;
                    $comp.ippSkip += $comp.ippLimit;
                    $comp.__requestIpaipai__();
                } else {
                    if ($comp.imageMaxPage <= $comp.imagePage) return;
                    $comp.imagePage += 1;
                    $comp.__requestImage__($comp.imagePage, $comp.imageSize);
                }

            }
        });
    }

    render() {
        return $(`
        <div class="editor-styles">
            <div class="upload">
                <span class="upload-btn">上传图片</span>
                <div class="sun"><img src="/static/images/ipaipai_qr.png"/></div>
            </div>
            <div class="types">
                <a href="javascript:;">${imageType.ALL}</a>
                <a href="javascript:;">${imageType.IPAIPAI}</a>
                <!--<span class="image-new-group" > + ${imageType.NEWGROUP} </span>-->
            </div>
            <div class="styles-wrapper">
                <div id="styles" class="editor-styles-content"></div>
                <div id="connectAlert">
                  尚未绑定微信账号，<a>绑定微信</a>后可通过小程序上传图片
                </div>
                <div id="ipaipaiAlert">
                  <img src="/static/images/ipaipai_qr.png"/>
                  <h5>微信扫一扫, 手机快速传图</h5>
                </div>
            </div>
        </div>`);
    }
}
