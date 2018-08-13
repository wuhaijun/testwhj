import _ from 'lodash';
import Article from './Article';

export default function({titleEditor, sourceInput, coverEditor, context}) {
    let origin;
    function showArticle(data) {
        if(!check()) {
            return;
        }
        show(data);
    }

    function createNew() {
        if(!check()) {
            return;
        }
        show({});
    }

    function check() {
        let article = getArticle();
        if(!origin) {
            if(!article.isEmpty() && !confirm('未保存的临时文档，操作后内容将无法恢复,是否确认执行操作?')) {
                return false;
            }
        }else {
            if(!article.isEquals(origin) && !confirm('文档内容已更新，操作后内容将无法恢复,是否确认执行操作?')) {
                return false;
            }
        }
        return true;
    }

    function show(data) {
        origin = data;

        titleEditor.title.val(data.title);
        titleEditor.author.val(data.author);
        sourceInput.val(data.sourceUrl);
        if(data.cover) {
            coverEditor.img.attr('src', data.cover);
        }else {
            coverEditor.img.removeAttr('src');
        }
        coverEditor.textarea.val(data.digest);
        // context.reset();
        context.code(data.content || '');
    }

    function getId() {
        return origin && origin.id;
    }


    function getArticle() {

        let summary='';
        let summarySubString='';
        let summernotContentText=context.code();
  
        summarySubString=$(".note-editable").text().substring(0,54);

        if(coverEditor.textarea.val().length<1){
            summary=summarySubString;
        }else{
            summary=coverEditor.textarea.val();
        }

        return new Article({
            title: titleEditor.title.val(),
            author: titleEditor.author.val(),
            source: sourceInput.val(),
            cover: coverEditor.img.attr('src'),
            digest:summary ,
            content: context.invoke('editor.isEmpty') ? null : context.code()
        });
    }

    function save(callback) {
        let originArticle = new Article(origin);
        let article = getArticle();

        if(!originArticle.isEmpty() ? article.isEquals(originArticle) : article.isEmpty()) {
            callback && callback();
            return;
        }

        let url;
        if(originArticle.id) {
            url = '/article/update/' + originArticle.id;
        }else {
            url = '/article/save';
        }
        $.ajax(url, {
            method: 'post',
            dataType: 'json',
            data: article.toJson(),
            success: function (j) {
                origin = article;
                origin.id = j.id;
                origin._id = j.id;
                callback && callback(origin);
            }
        });
    }

    return {
        createNew,
        showArticle,
        getArticle,
        getId,
        save
    }
}