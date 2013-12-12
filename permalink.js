module.exports = function(params, callback) {
  'use strict';

  var path     = require('path');
  var async    = require('async');
  var _        = require('lodash');

  var assemble = params.assemble;
  var grunt    = params.grunt;
  var options  = assemble.options;
  var pages    = options.pages;
  var defaults = options.permalink;

  // convert {{ variable }} to <%= variable %>
  if (_.isString(defaults) && !_.isEmpty(defaults)) {
    defaults = defaults.replace(/{{/g, '<%=').replace(/}}/g, '%>');
  }

  async.forEach(pages, function(page, next) {

    var yfm = page.data;
    var permalink = defaults;

    if (!_.isUndefined(yfm) && !_.isUndefined(yfm.permalink)) {
      permalink = yfm.permalink;
    }

    if (_.isString(permalink) && !_.isEmpty(permalink)) {
      var data = _.assign({}, options, yfm);

      try {
        permalink = _.template(permalink, data);
      } catch (error) {
        grunt.log.error(error);
      }

      var dirname = page.dirname;
      if (page.filePair && page.filePair.dest) {
        dirname = page.filePair.dest;
      }

      page.dest = path.join(dirname, permalink);

      if (page.dest.slice(-1) === path.sep.slice(-1)) {
        page.dest = path.join(page.dest, 'index.html');
      }
    }

    next();

  });

  callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};
