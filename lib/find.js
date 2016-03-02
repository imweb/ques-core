
'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

/**
 * 获取相对路径查找器
 * @param {Array.<String>|String} paths 
 * @return {Function(String):Object}
 */
exports.relative = function(paths) {
    var cache = {};

    paths = typeof paths === 'string' ? [paths] : paths || [];

    // read component info from dir
    function readInfo(dir) {
        var info = {
            content: ''
        };

        var p = path.join(dir, 'main.html');
        if (fs.statSync(p).isFile()) {
            info.content = fs.readSync(p).toString();
            info.html = p;
        }

        p = path.join(dir, 'main.js');
        if (fs.statSync(p).isFile()) {
            info.js = p;
        }

        // support multi ext for style file
        ['css', 'less', 'scss'].every(function(ext) {
            p = path.join(dir, `main.${ext}`);
            if (fs.statSync(p).isFile()) {
                info.css = p;
                return false;
            }
            return true;
        });
        return info;
    }

    /**
     * 查找函数
     * @param {String} name
     * @return {Object} info
     */
    return function(name) {
        if (cache[name] !== undefined) {
            return cache[name];
        }
        var rel = name.replace(/-/g, '/'),
            dir = null,
            info = null;
        paths.every(function(p) {
            var tmp = path.join(p, rel);
            if (fs.statSync(tmp).isDirectory()) {
                dir = tmp;
                return false;
            }
            return true;
        });

        // read info
        if (dir) {
            info = readInfo(dir);
        }

        // set name
        if (info) {
            info.name = name;
        }

        cache[name] = info;
        return info;
    }
};

