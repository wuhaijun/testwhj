'use strict';

function Article(options) {
    if (!(this instanceof Article)) {
        return new Article(options);
    }
    options = options || {};

    this.id = options.id || '';
    this.title = options.title || '';
    this.author = options.author || '';
    this.source = options.source || '';
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
        article.source == this.source &&
        article.cover == this.cover &&
        article.digest == this.digest &&
        article.content == this.content ;

};

Article.prototype.toJson = function () {
    let json = {  };
    for(let k in this) {
        if (this.hasOwnProperty(k)) {
            json[k] = this[k];
        }
    }

    return json;
};

export default Article;