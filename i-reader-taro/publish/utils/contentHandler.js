'use strict';

var _wxParse = require('../wxParse/wxParse.js');

var _wxParse2 = _interopRequireDefault(_wxParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleWechat(content, context) {
  if (content) {
    var _articleContent = content;
    var data = _wxParse2.default.wxParse('articleContent', 'html', _articleContent, context, 5);
    var nodes = data.bindName.nodes;
    __handleIFrame__(nodes);
    return nodes;
  }
}

function handleFeed(content, context) {
  if (content) {
    var data = _wxParse2.default.wxParse('articleContent', 'html', articleContent, context, 5);
    var nodes = data.articleContent.nodes;
    __handleIFrame__(nodes);
    return nodes;
  }
}

function other(content, context) {
  if (content) {
    var data = _wxParse2.default.wxParse('articleContent', 'html', content, context, 5);
    var nodes = data.articleContent.nodes;
    __handleIFrame__(nodes);
    return nodes;
  }
}

function __handleIFrame__(nodes) {
  nodes.forEach(function (node, idx) {
    if (node.tag === 'iframe') {
      var video = {
        node: 'element',
        index: idx,
        tag: 'video',
        tagType: 'block',
        attr: {
          src: node.attr['src'] || node.attr['data-src']
        }
      };
      nodes[idx] = video;
    }
    if (node.nodes) __handleIFrame__(node.nodes);
  });
}

function handle(__type__) {
  if (__type__ == 'wechat') return handleWechat;
  if (__type__ == 'feed') return handleFeed;else return other;
}

module.exports = {
  handle: handle
};