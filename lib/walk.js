
'use strict';

/**
 * 遍历节点
 * @param {Object} node
 * @param {Function(Object)} iterator 
 */
function walk(node, iterator) {
    if (node.type === 'tag' || node.type === 'root') {
        iterator(node);
        (node.children || []).slice(0).forEach(function(item) {
            walk(item, iterator);
        });
    }
};

module.exports = walk;

