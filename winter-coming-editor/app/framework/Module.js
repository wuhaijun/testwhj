'use strict';
import _ from 'lodash';
import {send, subscribe, EVENTS} from '../utils/EventCenter';

class EditorModule{
    constructor(context, config) {
        this.editorContext = context;
        this.config = config;

        if(config.willBuild) {
            config.willBuild();
        }
        let dom = this.buildDom(config);
        this.header = dom.find('div.header-content');
        this.button = dom.find('button.editor-module-button');
        this.sidebar = dom.find('div.module-sidebar');
        this.body = dom.find('div.body-content');
        this.dom = dom;

        let left = dom.find('div.editor-module-left');
        let right = dom.find('div.editor-module-right');
        this.left = left;
        this.right = right;

        let sidebarWidth = config.sidebarWidth;

        let show = () => {
            dom.removeClass('editor-module-close');
            if(sidebarWidth) {
                left.width(sidebarWidth);
            }
            send(EVENTS.MODULE_SHOW, this);
        };
        let close = () => {
            dom.addClass('editor-module-close');
            if(sidebarWidth) {
                left.css('width', '100%');
            }
            send(EVENTS.MODULE_CLOSE, this);
        };

        this.button.click(function (e) {
            if(dom.hasClass('editor-module-close')){
                show();
            }else {
                close();
            }
            e.stopPropagation();
        });

        if (config.leftCanClose) {
            this.left.css('cursor', 'pointer');
        }

        this.left.click(function() {
            if(dom.hasClass('editor-module-close')){
                show();
            } else if (config.leftCanClose) {
                close();
            }
        });

        if(config.defaultClose) {
            close();
        }else {
            show();
        }
    }

    buildDom(cfg) {
        let title = cfg.title;
        return $(`
<div id="${cfg.id}" class="editor-module">
    <div class="editor-module-left" style="border-right:1px solid ${'#eeeff0'||cfg.buttonColor||'#6fc080'};">
        <button class="btn btn-success btn-icon-icon mr5 editor-module-button"
            style="background-color: ${cfg.buttonColor||'#6fc080'}">
            <i class="${cfg.buttonIcon||'icon-note'}"></i>
        </button>
        <div class="editor-module-left-content">
            <div class="close-title">
                ${ _.map(title, s => `<p>${s}</p>`).join(' ') }
            </div>
            <div class="module-sidebar"></div>
        </div>
    </div>
    <div class="editor-module-right" style="width: ${cfg.width + 'px'}">
        <div class="header-content">${ title }</div>
        <div class="body-content"></div>
    </div>
</div>
        `);
    }

    width(w) {
        if(!w) return this.right.width();
        this.right.width(w);
    }

    init() {
        if(this.config.init) {
            this.config.init(this);
        }
    }

}

export default EditorModule;