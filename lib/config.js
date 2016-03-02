
'use strict';

module.exports = {
    
    /**
     * @type {Object} cheerio 选项
     */
    cheerioOptions: {
        decodeEntities: false 
    },

    /**
     * 查找组件
     * @type {Function}
     * @param {String} name 
     * @return {Object} info
     */
    find: require('./find').relative(process.cwd()),

    /**
     * @type {RegExp} 占位符
     */
    holder: /___/g,

    /**
     * hash
     * @type {Function}
     * @param {String} name
     * @return {String} 
     */
    hash: require('./hash').plain
};

