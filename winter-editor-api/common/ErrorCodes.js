module.exports = {
    PUSH: {
        PUSH_ARTICLE_MISSED: {
            errcode: 10002010001,
            errmsg: '缺少有效的图文id'
        },
        PUSH_ARTICLE_TO_MANY: {
            errcode: 10002010002,
            errmsg: '同步图文超出8篇内容'
        },
        PUSH_ARTICLE_COVER_MISSED: {
            errcode: 10002010003,
            errmsg: '图文缺少封面图'
        },
    },

    PREVIEW: {
        MP_MISSED: {
            errcode: 10002020001,
            errmsg: '没有可用的预览公众号'
        },
        ARTICLE_MISSED: {
            errcode: 10002020002,
            errmsg: '缺少有效的article'
        },
        MP_NOT_FOUND: {
            errcode: 10002020003,
            errmsg: '缺少有效的mp'
        },
        ARTICLE_NOT_FOUND: {
            errcode: 10002020004,
            errmsg: '缺少有效的mp'
        },
        ARTICLE_NOT_SYNC: {
            errcode: 10002020005,
            errmsg: '图文还没有同步'
        }
    }
};
