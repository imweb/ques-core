
'use strict';

/**
 * md hash
 * @param {String} name 
 * @return {String}
 */
exports.md = (function() {
    var hashMap = {},
        uid = 26;

    return function(name) {
        if (!hashMap[name]) {
            hashMap[name] = (++uid).toString(26).replace(/\d/g, function(n) {
                return 'zyxwvutsrq'[n];
            });
        }
        return hashMap[name] + '_';
    };
})()

/**
 * plain hash
 * @param {String} name 
 * @return {String}
 */
exports.plain = function(name) {
    return name + '_';
};

