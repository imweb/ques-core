
'use strict';

var $ = require('cheerio'),
    _ = require('lodash'),
    config = require('./config'),
    walk = require('./walk'),
    tagSet = require('./tagSet');

class Component {
    /**
     * @param {Object} info
     * @param {String} info.content 
     */
    constructor(info) {
        info = info || {};

        /**
         * @type {Object}
         */
        this.info = info;

        /**
         * @type {String}
         */
        this.content = (info.content || '').trim();
        
        /**
         * @type {Object.<String,Object>} 依赖
         */
        this.dep = {};

        /**
         * @type {Object.<String,Object>} 异步依赖
         */
        this.asyncDep = {};

        /**
         * @type {Cheerio} 虚拟树
         */
        this.$ = null;

        /**
         * @type {Object} 配置项
         */
        this.settings = this.getSettings();
    }

    getSettings() {
        var settings = {};
        if (this.content.indexOf('<!--ques[packAll]-->') !== -1) {
            settings.packAll = true;
        }
        return settings;
    }

    /**
     * 添加依赖
     * @param {Object} info
     */
    addDep(info) {
        this.dep[info.name] = this.dep[info.name] || info;
    }

    /**
     * 添加异步依赖
     * @param {Object} info
     */
    addAsyncDep(info) {
        this.asyncDep[info.name] = this.asyncDep[info.name] || info;
    }

    /**
     * 分析展开依赖
     */
    inflat() {
        if (this.$) {
            return;
        }
        this.$ = $.load(this.content, config.cheerioOptions);

        var self = this;
        walk(self.getWalkStartNode(), function(node) {
            var name = node.name;
            if (tagSet.isCustom(name)) {
                var subComponent = self.getComponent(name);
                if (subComponent) {
                    // 设置数据
                    node = self.setComponentNode(node);
                    if (self.isAsync(node)) {
                        // 添加异步依赖
                        self.addAsyncDep(subComponent.info);
                        // name标记
                        $(node).attr('q-async', name);
                    } else {
                        // 添加依赖
                        self.addDep(subComponent.info);
                        // 合并
                        node = self.mergeSubComponent(node, subComponent);
                        // name标记
                        $(node).attr('q-vm', name);
                    }
                } else {
                    console.warn(`Could find component: ${name}`);
                }
            }
        });
    }

    /**
     * 遍历起点
     * @return {Object} 
     */
    getWalkStartNode() {
        var $body = this.$('body');
        return $body.length ? $body[0] : this.$._root;
    }

    /**
     * 查找组件
     * @return {Object} info
     */
    find(name) {
        return config.find(name);
    }

    /**
     * 判断是否是异步模块
     * @param {Object} node 
     * @return {Boolean} 
     */
    isAsync(node) {
        return $(node).attr('q-async') !== undefined;
    }

    /**
     * 获取子组件
     * @param {String} name   
     * @return {Component}
     */
    getComponent(name) {
        var info = this.find(name);
        if (info) {
            // TODO 复用Component对象
            return new Component(info);
        }
        return null;
    }

    /**
     * 合并子组件到dom树中
     * @param {Object} node 
     * @param {Component} subComponent 
     */
    mergeSubComponent(node, subComponent) {
        if (!subComponent.$) {
            subComponent.inflat();
        }

        var $saved = $(node).clone(),
            $new = $(subComponent.$._root.children[0]).clone();

        // 替换 组件最外围必须只有一个节点
        $(node).replaceWith($new);

        // 拷贝属性
        $new.attr(_.extend($saved.attr() || {}, $new.attr() || {}))
             .addClass($saved.attr('class'));

        return $new[0];
    }

    /**
     * 设置数据
     * @param {Object} node 
     */
    setComponentNode(node) {
        var n = $('<div></div>').attr($(node).attr());
        // rename node 
        $(node).replaceWith(n);

        return n;
    }
};

module.exports = Component;

