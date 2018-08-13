'use strict';
import Component from './Component';
import Styles from './Styles';
import Articles from './Articles';
import Collection from './Collection';
import Images from './Images';
import Templates from './Templates';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();

        this.isHide = false;
        this.ippInterval = null;

        this.changeImageCallback = (item, host) => {
            let insertImageLink = host + item.key;
            window.main.editor.editor.context.invoke('editor.restoreRange');
            window.main.editor.editor.context.invoke('editor.insertImage', insertImageLink);
        };
    }

    rendered() {
    }

    __fadeOut__() {
        this.isHide = true;
        this.addClass('out');
        this.main.editor.addClass('mid');
    }

    __fadeIn__() {
        this.isHide = false;
        this.removeClass('out');
        this.main.editor.removeClass('mid');
    }

    __renderSomeone__($someone) {
        this.html('');
        this.append($someone);
        /* this.append(`<div class="editor-expand-r"><a href="javascript:;"><i></i></a></div>`);
        this.append(`<div class="editor-expand"><a href="javascript:;"><i></i></a></div>`);
        this.find('.editor-expand a').click((e)=> {
            e.stopPropagation();
            this.__fadeOut__();
        });
        this.find('.editor-expand-r a').click(()=> {
            this.__fadeIn__();
        }); 
 */
        if (this.isHide) this.__fadeIn__();

        this.stopIppInterval();
    }

    stopIppInterval() {
        if(this.ippInterval) clearInterval(this.ippInterval);
    }

    renderStyles() {
        let $styles = new Styles({ editor: this.main.editor, content: this});
        this.__renderSomeone__($styles);
    }

    renderTemplates() {
        let $Templates = new Templates({ editor: this.main.editor, content: this});
        this.__renderSomeone__($Templates);
    }

    renderCollection() {
        let $collection = new Collection({ editor: this.main.editor, content: this});
        this.__renderSomeone__($collection);
    }

    renderImages() {
        let $images = new Images({ editor: this.main.editor, content: this});
        this.__renderSomeone__($images);
    }

    renderArticles() {
        let $articles = new Articles({ editor: this.main.editor });
        this.__renderSomeone__($articles);
    }

    render() {
        return $(`<div class="editor-content"></div>`);
    }
}