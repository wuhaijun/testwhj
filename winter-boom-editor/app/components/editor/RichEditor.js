'use strict';
import Component from './../Component';
import { colorPicker } from '../../utils/ColorPicker';
import { wrapper } from '../../utils/EditorCommandWrapper';
import Modal from '../common/Modal';
import InsertCodeModal from './modal/InsertCodeModal';
import _ from 'lodash';
import loginUtils from '../../utils/loginUtils';
import emoji from './emoji/Emoji';
import bgImage from './bgimage/BgImage';
import uploadUtil from '../UploadUtil';

export default class extends Component {
    constructor(props) {
        super(props);

        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.insertCodeModal = new Modal({ id: 'insertCodeModal' });
        this.insertCodeModal.$body = new InsertCodeModal();

        this.colorPicker = colorPicker;
        window.defaultInsertType = true;
        this.rendered();
        this.buttons = {
            'font-bold': this.find('.bold'),
            'font-italic': this.find('.italic'),
            'font-underline': this.find('.underline'),
            'font-strikethrough': this.find('.strikethrough'),
            'font-family': this.find('.current-fontFamily'),
            'font-size': this.find('.current-fontsize'),
            'undo': this.find('.undo'),
            'redo': this.find('.redo'),
            'justifyLeft': this.find('.justifyLeft'),
            'justifyCenter': this.find('.justifyCenter'),
            'justifyRight': this.find('.justifyRight'),
            "indent": this.find('.indent'),
            "blockquote": this.find('.blockquote')
        };
    }

    //插入图片
    insertImage() {
        if (!loginUtils.checkAlert()) return;
        uploadUtil('NO_CATEGORY', true, (keys) => {
            (keys || []).forEach(key => {
                let insertImageLink = 'http://editor.static.cceato.com/' + key;
                this.editor.context.invoke('editor.restoreRange');
                this.editor.context.invoke('editor.insertImage', insertImageLink);
            })
        });

    };

    showMask = () => {
        this.find(".tool-mask").show();
    };
    hideMask = () => {
        this.find(".tool-mask").hide();
    };
    textLeft = () => {
        this.buttons['justifyLeft'].addClass("active");
        this.buttons['justifyCenter'].removeClass("active");
        this.buttons['justifyRight'].removeClass("active");
    };
    textCenter = () => {
        this.buttons['justifyCenter'].addClass("active");
        this.buttons['justifyLeft'].removeClass("active");
        this.buttons['justifyRight'].removeClass("active");
    };
    textRight = () => {
        this.buttons['justifyRight'].addClass("active");
        this.buttons['justifyCenter'].removeClass("active");
        this.buttons['justifyLeft'].removeClass("active");
    };

    rendered = () => {

        let $this = this;
        let hideFn;

        $('body').click(function (e) {
            if (hideFn) {
                hideFn();
                hideFn = null;
            }
            $('body .modal-backdrop').hide();
        });

        $this.find('.tool').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $this.find('.dropdown-menu').hide();
            $('.tool').tooltip('hide');
            let command = 'editor.' + $(this).data('action');
            switch (command) {
                case 'editor.insertImage':
                    $this.insertImage();
                    break;
                case 'editor.fontSize':
                    $(".dropdown-fontsize").show(function () {
                        hideFn = () => {
                            $this.find('.dropdown-menu').hide();
                        };
                    });
                    break;
                case 'editor.fontFamily':
                    $(".dropdown-fontFamily").show(function () {
                        hideFn = () => {
                            $this.find('.dropdown-menu').hide();
                        };
                    });
                    break;
                case 'editor.foreColor':
                    $this.colorPicker("#pickerForeColor", "#000000", ".fore-color", "foreColor", $this.editor);
                    break;
                case 'editor.backColor':
                    $this.colorPicker("#pickerBackColor", "transparent", ".back-color", "backColor", $this.editor);
                    break;
                case 'editor.lineHeight':
                    $(".dropdown-lineheight").show(function () {
                        hideFn = () => {
                            $this.find('.dropdown-menu').hide();
                        };
                    });
                    break;
                case 'editor.letterSpacing':
                    $(".dropdown-letterspacing").show(function () {
                        hideFn = () => {
                            $this.find('.dropdown-menu').hide();
                        };
                    });
                    break;
                case 'editor.rowspacingtop':
                    $(".dropdown-rowspacingtop").show(function () {
                        hideFn = () => {
                            $this.find('.dropdown-menu').hide();
                        };
                    });
                    break;
                case 'editor.rowspacingbottom':
                    $(".dropdown-rowspacingbottom").show(function () {
                        hideFn = () => {
                            $this.find('.dropdown-menu').hide();
                        };
                    });
                    break;
                case 'editor.betweenSpace':
                    $(".dropdown-betweenSpace").show(function () {
                        hideFn = () => {
                            $this.find('.dropdown-menu').hide();
                        };
                    });
                    break;
                case 'editor.link':
                    $this.editor.context.invoke('linkDialog.show');
                    $('body .modal-backdrop').hide();
                    break;
                case 'editor.emoji':
                    emoji($('#emoji'), $this.editor.context);
                    break;
                case 'editor.bgImage':
                    bgImage($('#bgImage'), $this.editor);
                    break;
                case 'editor.removeFormat':
                    $this.editor.context.invoke("editor.customRemoveFormat");
                    $this.editor.context.invoke("editor.removeFormat");
                    break;
                case 'editor.insertCode':
                    $this.insertCodeModal.$body = new InsertCodeModal({ parent: $this });
                    $this.insertCodeModal.open();
                    break;
                case 'editor.blockquote':
                    $this.editor.context.invoke('editor.__formatBlock__', 'blockquote');
                    break;
                default:
                    if (command == "editor.bold" || command == "editor.italic" || command == "editor.underline" || command == "editor.strikethrough") {
                        if ($this.find("." + command.split(".")[1]).hasClass("active")) {
                            $this.find("." + command.split(".")[1]).removeClass("active");
                        } else {
                            $this.find("." + command.split(".")[1]).addClass("active");
                        }
                    }
                    if (command == "editor.justifyLeft") {
                        if ($this.buttons['justifyLeft'].hasClass("active")) {
                        } else {
                            $this.textLeft();
                        }
                    }

                    if (command == "editor.justifyCenter") {
                        if ($this.buttons['justifyCenter'].hasClass("active")) {
                        } else {
                            $this.textCenter();
                        }
                    }

                    if (command == "editor.justifyRight") {
                        if ($this.buttons['justifyRight'].hasClass("active")) {
                        } else {
                            $this.textRight();
                        }
                    }
                    if (command == "editor.indent") {
                        if ($this.buttons['indent'].hasClass("active")) {
                            $this.buttons['indent'].removeClass("active");
                        } else {
                            $this.buttons['indent'].addClass("active");
                        }
                    }
                    $this.editor.context.invoke(command);
            }
        });


        //选择字体类型
        $this.find('.dropdown-fontFamily li').click(function () {
            let chooseFontName = $(this).text();
            $this.find(".current-fontFamily").text(chooseFontName);
            let fontNameValue = $(this).children("a").attr("data-value");
            $this.editor.context.invoke('editor.fontName', fontNameValue);
            $this.find(".dropdown-fontFamily").hide();
        });

        //选择字体大小
        $this.find('.dropdown-fontsize li').click(function () {
            let chooseFontSize = $(this).text();
            $this.find(".current-fontsize").text(chooseFontSize);
            $this.editor.context.invoke('editor.fontSize', parseInt(chooseFontSize));
            $this.find(".dropdown-fontsize").hide();
            //$this.editor.getFontSize(parseInt(chooseFontSize));
        });

        //选择段前距大小
        $this.find('.dropdown-rowspacingtop li').click(function (e) {
            let rowspacingtop = $(this).text();
            $this.editor.context.invoke('editor.rowspacingtop', rowspacingtop);
            $this.find(".dropdown-rowspacingtop").hide();
        });

        //选择段后距大小
        $this.find('.dropdown-rowspacingbottom li').click(function () {
            let rowspacingbottom = $(this).text();
            $this.editor.context.invoke('editor.rowspacingbottom', rowspacingbottom);
            $this.find(".dropdown-rowspacingbottom").hide();
        });

        //选择两端间距
        $this.find('.dropdown-betweenSpace li').click(function () {
            let betweenSpace = $(this).text();
            $this.editor.context.invoke('editor.betweenSpace', betweenSpace);
            $this.find(".dropdown-betweenSpace").hide();
        });

        //选择行间距大小
        $this.find('.dropdown-lineheight li').click(function () {
            let lineHeight = $(this).text();
            $this.editor.context.invoke('editor.lineHeight', lineHeight);
            $this.find(".dropdown-lineheight").hide();
        });

        //选择字间距大小
        $this.find('.dropdown-letterspacing li').click(function () {
            let letterspacing = $(this).text();
            $this.editor.context.invoke('editor.letterSpacing', letterspacing);
            $this.find(".dropdown-letterspacing").hide();
        });


        //tool-bar状态样式管理
        $this.editor.on('summernote.keyup summernote.mouseup summernote.change', function () {
            let buttons = $this.buttons;
            let statusStore = $this.editor.context.invoke('editor.currentStyle');
            statusStore = Object.assign(
                statusStore,
                $this.editor.context.invoke('editor.historyStatus')
            );

            //判断引用状态显示
            let blockquoteStatus = false;
            _.each(statusStore.ancestors, function (n) {
                if(n.localName && n.localName == "blockquote") {
                    blockquoteStatus = true;
                };
            });
            if( blockquoteStatus ) {
                buttons['blockquote'].addClass("active");
            } else {
                buttons['blockquote'].removeClass("active");
            }

            _.each(['bold', 'italic', 'underline', 'strikethrough'], function (n) {
                let key = 'font-' + n;

                if (statusStore[key] == "normal") {
                    buttons[key].removeClass("active");
                } else {
                    if (!!statusStore[key]) buttons[key].addClass("active");
                }
            });

            _.each(['undo', 'redo'], function (n) {
                if (statusStore[n] == "false") {
                    buttons[n].removeClass("activeOpacity");
                } else {
                    buttons[n].addClass("activeOpacity");
                }
            });

            if (statusStore['text-align'] == "left" || statusStore['text-align'] == "start") {
                $this.textLeft();
            }
            if (statusStore['text-align'] == "center") {
                $this.textCenter();
            }
            if (statusStore['text-align'] == "right") {
                $this.textRight();
            }
            if (statusStore['text-indent'] == "0px") {
                buttons['indent'].removeClass("active");
            } else {
                buttons['indent'].addClass("active");
            }

            $this.find('.dropdown-lineheight li a').each(function () {
                let $item = $(this);
                let isChecked = ($item.data('value') + '') === (statusStore['line-height'] + '');
                $item.toggleClass('fa fa-check', isChecked);
            });

            $this.find('.dropdown-letterspacing li a').each(function () {
                let $item = $(this);
                let isChecked = ($item.data('value') + '') === (statusStore['letter-spacing'] + '');
                $item.toggleClass('fa fa-check', isChecked);
            });

            $this.find('.dropdown-rowspacingtop li a').each(function () {
                let $item = $(this);
                let isChecked = ($item.data('value') + '') === (statusStore['margin-top'] + '');
                $item.toggleClass('fa fa-check', isChecked);
            });

            $this.find('.dropdown-rowspacingbottom li a').each(function () {
                let $item = $(this);
                let isChecked = ($item.data('value') + '') === (statusStore['margin-bottom'] + '');
                $item.toggleClass('fa fa-check', isChecked);
            });

            $this.find('.dropdown-betweenSpace li a').each(function () {
                let $item = $(this);
                let isChecked = ($item.data('value') + '') === (statusStore['margin-left'] + '');
                $item.toggleClass('fa fa-check', isChecked);
            });

            let defaultFontSize = statusStore['font-size'];
            buttons['font-size'].text(defaultFontSize + "px");

            let fontFamilyMap = {
                "sans-serif": "默认字体",
                "PingFangSC-Ultralight": "苹方简极细(仅IOS)",
                "PingFangSC-Light": "苹方简细体(仅IOS)",
                "PingFangSC-Regular": "苹方简常规(仅IOS)",
                "PingFangTC-Ultralight": "苹方繁极细(仅IOS)",
                "PingFangTC-Light": "苹方繁细体(仅IOS)",
                "PingFangTC-Regular": "苹方繁常规(仅IOS)"
            };
            buttons['font-family'].text(fontFamilyMap[statusStore['font-family']]);
        });

        $this.find('.radio').click(function () {
            window.defaultInsertType = !window.defaultInsertType;
        });
    };

    render() {
        return $(`
            <div class="winter-rich-toolbar">
                 <div class="toolbar-first">
                    <button class="tool undo " data-action="undo" data-toggle="tooltip" data-placement="bottom" title="撤消"></button>
                    <button class="tool redo activeOpacity" data-action="redo" data-toggle="tooltip" data-placement="bottom" title="重做"></button>

                    <i class="tool separator"> </i>
                    
                    <button class="tool fontFamily" data-action="fontFamily" data-toggle="tooltip" data-placement="bottom" title="修改字体">
                          <span class="current-fontFamily">默认字体</span>
                          <i class="fa fa-caret-down"></i>
                    </button>

                    <div class="dropdown-menu note-check dropdown-fontFamily">  
                       <li><a href="javascript:;" data-value="sans-serif" style="font-family:sans-serif">默认字体</a></li>
                       <li><a href="javascript:;" data-value="PingFangSC-Ultralight" style="font-family:PingFangSC-Ultralight">苹方简极细(仅IOS)</a></li>
                       <li><a href="javascript:;" data-value="PingFangSC-Light" style="font-family:PingFangSC-Light">苹方简细体(仅IOS)</a></li>
                       <li><a href="javascript:;" data-value="PingFangSC-Regular" style="font-family:PingFangSC-Regular">苹方简常规(仅IOS)</a></li>
                       <li><a href="javascript:;" data-value="PingFangTC-Ultralight" style="font-family:PingFangTC-Ultralight">苹方繁极细(仅IOS)</a></li>
                       <li><a href="javascript:;" data-value="PingFangTC-Light" style="font-family:PingFangTC-Light">苹方繁细体(仅IOS)</a></li>
                       <li><a href="javascript:;" data-value="PingFangTC-Regular" style="font-family:PingFangTC-Regular">苹方繁常规(仅IOS)</a></li>
                    </div>
                    

                    <button class="tool fontSize" data-action="fontSize" data-toggle="tooltip" data-placement="bottom" title="字号大小">
                          <span class="current-fontsize">14px</span>
                          <i class="fa fa-caret-down"></i>
                    </button>

                    <div class="dropdown-menu note-check dropdown-fontsize">
                       <li><a href="javascript:;" data-value="12" style="font-size:12px">12px</a></li>
                       <li><a href="javascript:;" data-value="13" style="font-size:13px">13px</a></li>
                       <li><a href="javascript:;" data-value="14" style="font-size:14px">14px</a></li>
                       <li><a href="javascript:;" data-value="15" style="font-size:15px">15px</a></li>
                       <li><a href="javascript:;" data-value="16" style="font-size:16px">16px</a></li>
                       <li><a href="javascript:;" data-value="18" style="font-size:18px">18px</a></li>
                       <li><a href="javascript:;" data-value="20" style="font-size:20px">20px</a></li>
                       <li><a href="javascript:;" data-value="24" style="font-size:24px">24px</a></li>
                    </div>

                    <i class="tool separator"> </i>

                    <button class="tool link" data-action="link" data-toggle="tooltip" data-placement="bottom" title="超链接"><i class="icon-boom-link"></i></button>
                    <button class="tool insertImage" data-action="insertImage" data-toggle="tooltip" data-placement="bottom" title="插入图片"><i class="icon-boom-online-bg"></i></button>
                    <button id="bgImage" class="tool bgImage" data-action="bgImage" data-toggle="tooltip" data-placement="bottom" title="添加背景"></button>
                    <button id="emoji" class="tool emoji" data-action="emoji" data-toggle="tooltip" data-placement="bottom" title="表情符号"><i class="icon-boom-emoji"></i></button>
                    <button class="tool removeFormat" data-action="removeFormat" data-toggle="tooltip" data-placement="bottom" title="清除格式"><i class="icon-boom-clean"></i></button>
                    
                    <button class="tool blockquote" data-action="blockquote" data-toggle="tooltip" data-placement="bottom" title="引用"><i class="fa fa-quote-right" style="color:#888"></i></button>
                    <button class="tool" data-action="insertHorizontalRule" data-toggle="tooltip" data-placement="bottom" title="分割线"><i class="fa fa-minus" style="color:#888"></i></button>
                    
                    <span class="seamLessImageSwitch">
                            <span class="text-tip">无缝图片</span>
                            <input type="checkbox" id="radio" name="switch" checked="checked">
                            <label for="radio" class="radio">
                                <span class="circle"></span>
                                <span class="on"></span>
                            </label>
                    </span>

                 </div>

                 <div class="toolbar-second">
                    <button class="tool bold" data-action="bold" data-toggle="tooltip" data-placement="bottom" title="加粗"><i class="icon-boom-bold"></i></button>
                    <button class="tool italic" data-action="italic" data-toggle="tooltip" data-placement="bottom" title="斜体"><i class="icon-boom-italic"></i></button>
                    <button class="tool underline" data-action="underline" data-toggle="tooltip" data-placement="bottom" title="下划线"><i class="icon-boom-underline"></i></button>
                    <button class="tool strikethrough" data-action="strikethrough" data-toggle="tooltip" data-placement="bottom" title="删除线"></button>

                    <button class="tool foreColor" data-action="foreColor" data-toggle="tooltip" data-placement="bottom" title="字体颜色">
                         <i class="fa fa-caret-down"></i>
                         <span class="bottom-color-active"></span>
                    </button>
                    <span class="fore-color"><input type='text' id="pickerForeColor" /></span>
                    <button class="tool backColor" data-action="backColor" data-toggle="tooltip" data-placement="bottom" title="背景色">
                         <i class="fa fa-caret-down"></i>
                         <span class="bottom-bgcolor-active"></span>
                    </button>
                    <span class="back-color"><input type='text' id="pickerBackColor" /></span>

                    <i class="tool separator"> </i>

                    <button class="tool justifyLeft" data-action="justifyLeft" data-toggle="tooltip" data-placement="bottom" title="居左对齐"><i class="icon-boom-justifyLeft"></i></button>
                    <button class="tool justifyCenter" data-action="justifyCenter" data-toggle="tooltip" data-placement="bottom" title="居中对齐"><i class="icon-boom-justifycenter"></i></button>
                    <button class="tool justifyRight" data-action="justifyRight" data-toggle="tooltip" data-placement="bottom" title="居右对齐"><i class="icon-boom-justifyRight"></i></button>
                    <button class="tool justifyFull" data-action="justifyFull" data-toggle="tooltip" data-placement="bottom" title="两端对齐"></button>

                    <i class="tool separator"> </i>

                    <button class="tool indent" data-action="indent" data-toggle="tooltip" data-placement="bottom" title="首行缩进"><i class="icon-boom-indent"></i></button>

                    <button class="tool betweenSpace" data-action="betweenSpace" data-toggle="tooltip" data-placement="bottom" title="两端缩进">
                            <i class="fa fa-caret-down"></i>
                    </button>

                    <div class="dropdown-menu note-check dropdown-betweenSpace">
                       <li><a href="javascript:;" data-value="0">0</a></li>
                       <li><a href="javascript:;" data-value="8">8</a></li>
                       <li><a href="javascript:;" data-value="16">16</a></li>
                       <li><a href="javascript:;" data-value="32">32</a></li>
                       <li><a href="javascript:;" data-value="48">48</a></li>
                    </div>

                   <i class="tool separator"> </i>

                    <button class="tool rowspacingtop" data-action="rowspacingtop" data-toggle="tooltip" data-placement="bottom" title="段前距">
                            <i class="fa fa-caret-down"></i>
                    </button>

                     <div class="dropdown-menu note-check dropdown-rowspacingtop">
                       <li><a href="javascript:;" data-value="0">0</a></li>
                       <li><a href="javascript:;" data-value="5">5</a></li>
                       <li><a href="javascript:;" data-value="15">15</a></li>
                       <li><a href="javascript:;" data-value="20">20</a></li>
                       <li><a href="javascript:;" data-value="25">25</a></li>
                       <li><a href="javascript:;" data-value="30">30</a></li>
                    </div>


                    <button class="tool rowspacingbottom" data-action="rowspacingbottom" data-toggle="tooltip" data-placement="bottom" title="段后距">
                            <i class="fa fa-caret-down"></i>
                    </button>

                    <div class="dropdown-menu note-check dropdown-rowspacingbottom">
                       <li><a href="javascript:;" data-value="0">0</a></li>
                       <li><a href="javascript:;" data-value="5">5</a></li>
                       <li><a href="javascript:;" data-value="15">15</a></li>
                       <li><a href="javascript:;" data-value="20">20</a></li>
                       <li><a href="javascript:;" data-value="25">25</a></li>
                       <li><a href="javascript:;" data-value="30">30</a></li>
                    </div>
                    <button class="tool lineheight" data-action="lineHeight" data-toggle="tooltip" data-placement="bottom" title="行间距">
                            <i class="fa fa-caret-down"></i>
                    </button>

                    <div class="dropdown-menu note-check dropdown-lineheight">
                       <li><a href="javascript:;" data-value="1">1</a></li>
                       <li><a href="javascript:;" data-value="1.5">1.5</a></li>
                       <li><a href="javascript:;" data-value="1.75">1.75</a></li>
                       <li><a href="javascript:;" data-value="2">2</a></li>
                       <li><a href="javascript:;" data-value="3">3</a></li>
                       <li><a href="javascript:;" data-value="4">4</a></li>
                       <li><a href="javascript:;" data-value="5">5</a></li>
                    </div>

                    <button class="tool letterspacing" data-action="letterSpacing" data-toggle="tooltip" data-placement="bottom" title="字间距">
                            <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-menu note-check dropdown-letterspacing">
                       <li><a href="javascript:;" data-value="0">0</a></li>
                       <li><a href="javascript:;" data-value="0.5">0.5</a></li>
                       <li><a href="javascript:;" data-value="1">1</a></li>
                       <li><a href="javascript:;" data-value="2">2</a></li>
                    </div>
                 </div>
                 <div class="tool-mask"></div>
            </div>
        `);
    }
}
