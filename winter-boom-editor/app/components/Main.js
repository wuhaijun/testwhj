'use strict';
import Component from './Component';
import Header from './Header';
import Menus from './Menus';
import Content from './Content';
import Editor from './editor/ColumnEditor';

export default class extends Component {
    constructor(props) {
        super(props);

        this.menus = null;
        this.content = null;
        this.editor = null;

        this.rendered();
    }

    rendered() {
        this.prepend(new Header());
        let $editorMain = this.find('.editor-main');
        
        this.editor = new Editor({ main: this });
        this.content = new Content({ main: this });
        this.menus = new Menus({ main: this });

        window.main = this;

        $editorMain.append(this.menus);
        $editorMain.append(this.content);
        $editorMain.append(this.editor);

        $editorMain.on('dblclick',this.onClickTest);
        
    }

    onClickTest = () => {
        this.content.__fadeIn__();
    }

    render() {
        return $(`
        <div class="main">
            <div class="editor-main"></div>
        </div>`);
    }
}