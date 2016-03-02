
'use strict';

var _ = require('lodash'),
    config = require('./lib/config');

exports.Component = require('./lib/Component');

exports.find = require('./lib/find');

exports.hash = require('./lib/hash');

exports.replaceHolder = require('./lib/util').replaceHolder;

exports.cfg = function(cfg) {
    _.extend(config, cfg || {});
};

