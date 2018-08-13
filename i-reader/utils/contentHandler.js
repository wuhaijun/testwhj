var WxParse = require('../wxParse/wxParse.js');

function handleWechat(content, context) {
  let articleContent = content;
  WxParse.wxParse('articleContent', 'html', articleContent, context, 5);
  let nodes = context.data.articleContent.nodes;
  __handleIFrame__(nodes);
  return nodes;
}

function handleFeed(content, context) {
  WxParse.wxParse('articleContent', 'html', articleContent, context, 5);
  let nodes = context.data.articleContent.nodes;
  __handleIFrame__(nodes);
  return nodes
}

function other(content, context) {
  WxParse.wxParse('articleContent', 'html', content, context, 5);
  let nodes = context.data.articleContent.nodes;
  __handleIFrame__(nodes);
  return nodes
}

function __handleIFrame__(nodes) {
  nodes.forEach((node, idx) => {
    if (node.tag === 'iframe') {
      let video = {
        node: 'element',
        index: idx,
        tag: 'video',
        tagType: 'block',
        attr: {
          src: node.attr['src'] || node.attr['data-src']
        }
      }
      nodes[idx] = video;
    }
    if (node.nodes) __handleIFrame__(node.nodes);
  })
}

function handle(__type__) {
  if (__type__ == 'wechat') return handleWechat;
  if (__type__ == 'feed') return handleFeed;
  else return other;
}

export {
  handle
}