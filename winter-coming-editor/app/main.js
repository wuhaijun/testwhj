'use strict';
import EditorContext from './framework/EditorContext';
import StyleModuleConfig from './modules/style/StyleModuleConfig'
import CollectionModuleConfig from './modules/collection/CollectionModuleConfig'
import ArticleModuleConfig from './modules/article-list/ArticleModuleConfig'
import config from '../common/config';

//防止退格键
$(document).keydown(e => {
    if(e.keyCode == 8) {
        let t = e.target;
        if(t.tagName.toLowerCase() == 'body') {
            return false;
        }
    }
});

new EditorContext({
    container: '#container',
    adaptionWidth: true,
    moduleConfigs: [
        CollectionModuleConfig,
        StyleModuleConfig,
        ArticleModuleConfig
    ]
});
