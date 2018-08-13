try {
  var util = require('../util/util.js');
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = require('./inherits_browser.js');
}
