'use strict';
import Component from './../Component';
import loginUtils from '../../utils/loginUtils';
import Modal from '../common/Modal';
import uploadUtil from '../UploadUtil';
import _ from 'lodash';

export default class extends Component {
    constructor(props) {
        super(props);

        this.selectImageModal = new Modal({id: 'selectImageModal'});

        this.$titleInput = null;
        this.$authorInput = null;
        this.$coverImg = null;
        this.$titleCover = null;

        this.rendered();

    }

    title = val => {
        if (val == undefined) {
            return this.$titleInput.val();
        } else {
            this.$titleInput.val(val);
            this.$titleCover.text(val);
        }
    };

    resetTitle = val => {
        if (val == undefined || val=='') {
            this.$titleCover.text('标题');
        } else {
            this.$titleInput.val(val);
        }

    };
    resetClearTitle = () => {
            this.$titleCover.text('标题');
    };

    author = val => {
        if (val == undefined) {
            return this.$authorInput.val();
        } else {
            this.$authorInput.val(val);
        }
    };

    cover = val => {
        // 这个 this.$coverImg.css 获取的背景值  谷歌和safari 有兼容性问题
        if (val == undefined) {
            let bgUrl = this.$coverImg.css("background-image");
            bgUrl = (bgUrl == 'none') ? '': bgUrl;
            bgUrl = (bgUrl || '').replace(/url\([\'\"]?(.+?)[\'\"]?\)/, '$1');
            return bgUrl;
        } else {
            if (val) {
                this.$coverImg.css("background-image", `url('${val}')`);
            } else {
                this.$coverImg.css("background-image", '');
            }
        }
    };

    clear = () => {
        this.title('');
        this.author('');
        this.cover('');

    };
    getLength = (str) => {
        var realLength = 0, maxCount = 0, len = str.length, charCode = -1;
        for ( var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;

            if (realLength <= 16) {
                maxCount++;
            }
        }
        return {
            length: realLength,
            maxCount: maxCount
        };
    };

    __buildSelectImageModal__ = onClick => {
        let modalBody;
        let images = _.uniqBy(this.parent.editor.editable.find('img'), i => i.src);
        if (images.length < 1) {
            modalBody = `<div class="select-image-note">很抱歉,正文中并没有可供选择的图片,请选择上传封面图片。</div>`
        } else {
            let $ul = $(`<ul></ul>`);
            let $lastIcon;
            let selected;
            for(let image of images) {
                if(image.src.startsWith('data')) continue;
                let $icon = $(`<div class="select-image-icon"><i class="fa fa-check-square"></i></div>`).hide();
                let $li = $('<li></li>').css({
                    background: `#fff url("${image.src}") no-repeat scroll center center / cover `
                }).append($icon)
                    .hover(e => {
                        !(image === selected) && $icon.show();
                    }, e => {
                        !(image === selected) && $icon.hide();
                    }).click(e => {
                        if (selected === image) return;
                        selected = image;
                        $lastIcon && $lastIcon.hide();
                        $lastIcon = $icon;
                        onClick(selected);
                    });

                $ul.append($li);
            };

            modalBody = $(`<div><p class="select-image-note">请从正文使用过的图片中选择封面:</p></div>`);
            modalBody.append($ul);
        }

        this.selectImageModal.$body = modalBody;
    };

    rendered = () => {
        this.$coverImg = this.find('.cover > .img');

        this.$coverImg.click(() => {
            window.main.menus.reloadImages();
            window.main.menus.changeImages((imageItem,host) => {
                this.cover( host + imageItem.key );
            });
        });

        let $cover = this.find('.cover');

        let $cover_desc;
        $cover_desc = $(`<div class="cover-desc"></div>`);
        $(`<a href="javascript:;">上传</a>`)
            .appendTo($cover_desc)
            .click(() => {
                if (!loginUtils.checkAlert()) return;
                uploadUtil('NO_CATEGORY', false, (keys) => {
                    if (keys[0] == 'error') {
                        this.message.warn('图片上传失败!');
                    }else{
                        window.main.menus.reloadImages();
                        this.cover('http://editor.static.cceato.com/' + keys[0] );
                        window.main.menus.changeImages((imageItem) => {
                            this.cover(imageItem && 'http://editor.static.cceato.com/' + imageItem.key);
                        });
                    }
                });
            });

        let selected;
        this.selectImageModal.$header = $(`<h4>从正文选择</h4>`);
        $(`<a href="javascript:;">从正文选择</a>`)
            .appendTo($cover_desc)
            .click(() => {
                this.__buildSelectImageModal__(image => {
                    selected = image;
                });

                this.selectImageModal.$footer = $(`<span class="btn">确    定</span>`).click(() => {
                    if (selected && selected.src) {
                        this.cover(selected.src);
                        selected = null;
                    }
                    this.selectImageModal.close();
                });
                this.selectImageModal.open();
            });
        $cover.append($cover_desc.hide());

        $cover.hover(() => {
            $cover.find('.cover-desc').fadeIn();
            $cover.find('i').fadeOut();
        }, () => {
            $cover.find('.cover-desc').fadeOut();
            $cover.find('i').fadeIn();
        });

        this.$titleInput = this.find('input[name="title"]');
        this.$authorInput = this.find('input[name="author"]');
        this.$titleCover = this.find('.title');
        this.$titleInput.keyup(() => {
            let val = this.$titleInput.val();
            val = (val && val.trim()) || '标题';
            this.$titleCover.text(val.trim());
        });

        this.$authorInput.keyup(() => {
            let val = this.$authorInput.val();
            let {length, maxCount} = this.getLength(val);
            if(length >= 16) {
                this.$authorInput.val(val.substr(0, maxCount));
                return false;
            }
        });
    };
    render() {
        return $(`
            <div class="col-editor-title">
                <div style="padding:10px;border: 1px solid #EAEAEA;">
                    <div class="editor-headline-img">
                        <div class="cover">
                            <span class="img" title="从图库中选择图片"></span>
                            <i class="fa fa-picture-o fa-3x"></i>
                        </div>
                        <div class="title">标题</div>
                    </div>
                    <div class="editor-headline">
                        <input name="title" type="text" placeholder="请输入标题,限64个字" maxlength="64"/>
                        <input name="author" type="text" placeholder="请输入作者,限8个字" />
                    </div>
                    <div style="clear:both;"></div>
                </div>
            </div>
        `);
    }
}