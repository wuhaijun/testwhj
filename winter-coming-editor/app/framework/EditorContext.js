'use strict';

import Module from './Module';
import EditorModuleConfig from './editor/EditorModuleConfig';
import { send, subscribe, EVENTS } from '../utils/EventCenter';

class EditorContext{

    constructor(config) {
        this.config = config;
        this.initModules();
        this.buildDom();
    }

    initModules() {
        let modules = [];
        this.modules = modules;

        for(let cfg of this.config.moduleConfigs) {
            let module = new Module(this, cfg);
            modules.push(module);
        }

        let editorConfig = EditorModuleConfig(this.config.id);
        let editor = new Module(this, editorConfig);
        editor.init();
        this.editor = editor;

        for(let module of this.modules) {
            module.init();
        }
    }


    buildDom() {
        let container = $(this.config.container);
        let dom = $('<div class="editor-container"></div>');
        this.dom = dom;

        dom.append(`
            <div class="editor-container-left"></div>
            <div class="editor-container-center"></div>
            <div class="editor-container-right"></div>
        `);
        let left = dom.find('div.editor-container-left');
        let center = dom.find('div.editor-container-center');
        let right = dom.find('div.editor-container-right');

        let width = (this.config.width || container.width()) - 2;

        let moduleWidth = 0;
        for(let module of this.modules) {
            moduleWidth += ((module.config.defaultClose? 0: module.config.width) + (module.config.sidebarWidth || 47));
            if(module.config.side == 'right') {
                right.append(module.dom);
            }else {
                left.append(module.dom);
            }
        }

        center.append(this.editor.dom);

        console.log(moduleWidth);
        dom.width(width);
        this.editor.width(width - moduleWidth - 47 - 1);

        subscribe(EVENTS.MODULE_CLOSE, m => {
            this.editor.width(this.editor.width() + m.config.width);
        });
        subscribe(EVENTS.MODULE_SHOW, m => {
            this.editor.width(this.editor.width() - m.config.width);
        });

        container.append(dom);
    }

}

export default EditorContext;