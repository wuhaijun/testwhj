'use strict';
import Component from './../Component';
import Title from './Title';
import Editor from './Editor';
import EditorFooter from './EditorFooter';
import Operator from './Operator';
import Message from '../common/Message';
import ConfirmModal from '../common/ConfirmModal';
import RichEditor from './RichEditor';
import loginUtils from '../../utils/loginUtils';
import put64 from '../../utils/put64';
export default class extends Component {
    constructor(props) {
        super(props);

        this.title = new Title({ parent: this });
        this.editor = new Editor({ parent: this});
        this.richEditor =new RichEditor({ parent: this, editor: this.editor });
        this.editorFooter = new EditorFooter({ parent: this });
        this.operator = new Operator({ parent: this});
        this.originArticle = new Article({});

        this.saveLock = true; //保存按钮开关

        this.rendered();
    }

    insert = $node => {
        this.editor.insert($node);
    };

    showArticle = article => {
        this.__check__(() => {
            this.originArticle = new Article(article);
            this.title.title(article.title || '');
            this.title.resetTitle(article.title);
            this.title.author(article.author || '');
            this.title.cover(article.cover || '');
            this.editorFooter.sourceUrl(article.sourceUrl || '');
            this.editorFooter.digest(article.digest || '');
            this.editor.content(article.content || '');
            this.editor.styleTool.hide();
            this.saveTemp();
        });
    };

    getArticleId = () => {
        return this.originArticle._id;
    };

    getCoverImg = () => {
        return this.title.cover();
    };

    copy = target => {
        this.editor.copy(target);
    };


    /**
     * 保存文章前，检查正文内容大小
     */
    __checkContentSize__ = () => {
        let wetchatTextLimit = 20000;  //微信接口限制20000字符。
        let textCount = this.editor.editable.text().replace(/\s+/g,"").length;
        if(textCount >= wetchatTextLimit) {
            this.saveLock = false;
            this.message.error('正文不能超过20000字，请删减部分内容后重试');
        }
        let wetchatContentLimit = 1024 * 1024 ; //微信接口限制1M,转化成字节。
        let articleBytesCount = this.__getBytesCount__(this.editor.content());
        if(articleBytesCount >= wetchatContentLimit) {
            this.saveLock = false;
            this.message.error('正文不能超过20000字或格式有误，请删减部分内容后重试');
        }
    };

    /***
     * str:字符串参数，获取字节数
     * @param str
     * @returns {number}
     */
    __getBytesCount__ = (str) => {
        var realLength = 0;
        for (var i = 0; i < str.length; i++)
        {
            let charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;
        }
        return realLength;
    };


    save = callback => {
        let article = this.__getArticle__();
        this.__checkContentSize__();
        if(this.saveLock){
            if(!this.originArticle.isEmpty() ?
                article.isEquals(this.originArticle) && !!this.originArticle._id:
                article.isEmpty()) {
                callback && callback(article);

                this.message.info('已保存');
                return;
            }
            let url;
            if(this.originArticle._id) {
                article._id = this.originArticle._id;
                url = '/article/update';
            }else {
                url = '/article/save';
            }
            put64(article);
            this.editor.content(article.content || '');
            $.post(url, article.clone(), json => {
                callback && callback(json.article);
                if (json && json.status == 'ok') {
                    this.originArticle = article;
                    this.originArticle._id = json.article._id;
                    //this.parent.columnArticle.addArticle(json.article);
                    this.message.success('保存成功');
                } else {
                    json.status == 'error' && this.message.error('保存失败 , '+ json.errmsg);
                }
            });
            this.saveTemp();
        }

    };

    saveTemp = callback => {
        if(window.localStorage) {
            let article = this.__getArticle__();
            article._id = this.originArticle._id;
            window.localStorage['temp_article'] = JSON.stringify(article);
        }
        if(callback) {
            callback();
        }
    };

    clear = () => {
        let article = this.__getArticle__();

        if (!article.isEmpty()) {
            this.confirm('是否确认清空文档?', () => {
                this.editor.clear();
                this.title.clear();
                this.title.resetClearTitle();
                this.editorFooter.clear();
                this.editor.styleTool.hide();
                this.message.success('已清空内容');
            });
        }
    };

    deepClear = () => {
        this.showArticle({});
        this.editor.__setLastSection__(null);
    };

    __check__ = callback => {
        let article = this.__getArticle__();
        if (this.originArticle.isEquals(article)) {
            callback()
        } else {
            this.confirm('你有尚未保存的文章,确定丢弃并新建文章吗?', callback);
        }
    };

    __getArticle__ = () => {
        return new Article({
            title: this.title.title(),
            author: this.title.author(),
            cover: this.title.cover(),
            sourceUrl: this.editorFooter.sourceUrl(),
            digest: this.editorFooter.digest() ,
            content: this.editor.content()
        });
    };

    rendered() {
        this.append(this.richEditor);
        this.append(this.title);
        this.append(this.editor);
        this.append(this.editorFooter);
        this.append(this.operator);
        window.onbeforeunload = (e) => {

            let article = this.__getArticle__();
            let message = (this.originArticle.isEmpty() ? !article.isEmpty() : !article.isEquals(this.originArticle)) ? "确认要离开吗？您输入的数据可能不会被保存!" : undefined;

            e = e || window.event;
            e && (e.returnValue = message);

            return message;
        };

        if (window.localStorage) {
            let temp = localStorage['temp_article'];
            if(temp) {
                try {
                    temp = temp.replace(/winter-section-active/g,"");
                    let json = JSON.parse(temp);
                    if(!!json._id && !loginUtils.check()) return;
                    this.showArticle(json);
                }catch (e) {}
            }
        }

        this.on('dbclick',this.onClickTest);
    }

    onClickTest(e) {
        e.stopPropagation();
        return false;
    }

    render() {
        return $(`<div class="editor"></div>`);
    }
}

function Article(options) {
    if (!(this instanceof Article)) {
        return new Article(options);
    }
    options = options || {};

    this._id = options._id || '';
    this.title = options.title || '';
    this.author = options.author || '';
    this.sourceUrl = options.sourceUrl || '';
    this.cover = options.cover || '';
    this.digest = options.digest || '';
    this.content = options.content || '';
}

Article.prototype.isEmpty = function() {
    for(let k in this) {
        if (this.hasOwnProperty(k)) {
            let v = this[k];
            if(v && v.trim()) {
                return false;
            }
        }
    }
    return true;
};

Article.prototype.isEquals = function(obj) {
    let article = new Article(obj);

    return article.title == this.title &&
        article.author == this.author &&
        article.sourceUrl == this.sourceUrl &&
        article.cover == this.cover &&
        article.digest == this.digest &&
        article.content == this.content ;

};

Article.prototype.clone = function () {
    let obj = {  };
    for(let k in this) {
        if (Object.prototype.hasOwnProperty.call(this, k)) {
            obj[k] = this[k];
        }
    }
    return obj;
};