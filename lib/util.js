
'use strict';

var config = require('./config');

/**
 * 替换占位符
 * @param {String} content
 * @param {String} name
 */
exports.replaceHolder = function(content, name) {
    return (content || '').replace(config.holder, config.hash(name));
};

