
'use strict';

var _ = require('lodash'),
    config = require('./lib/config');

exports.Component = require('./lib/Component');

exports.find = require('./lib/find');

exports.hash = require('./lib/hash');

exports.util = require('./lib/util');

exports.cfg = function(cfg) {
    _.extend(config, cfg || {});
};

