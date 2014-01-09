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
  var parseTpl = function(input, data, page) {
    try {
      return _.template(input, data);
    } catch (error) {
      grunt.fail.fatal(error.message + ' at ' + page.src);
    }
  };

  // convert {{ variable }} to <%= variable %>
  if (_.isString(defaults) && !_.isEmpty(defaults)) {
    defaults = defaults.replace(/{{/g, '<%=').replace(/}}/g, '%>');
  }

  async.each(pages, function(page, next) {

    page.data = page.data || {};

    var yfm = page.data;
    var permalink = defaults;

    if (!_.isUndefined(yfm.permalink)) {
      permalink = yfm.permalink;
    }

    if (!_.isEmpty(permalink)) {

      var data = _.assign({}, options, yfm);
      var permalinks;

      if (_.isString(permalink)) {

        permalink = parseTpl(permalink, data, page);
        permalink = permalink.trim();
        permalinks = permalink.split('\n');

      } else if (_.isArray(permalink)) {

        permalinks = permalink;

      } else {
        grunt.fail.fatal('the permalink of ' + page.src +
          ' is neither a string nor an array');
      }

      for (var i = permalinks.length - 1; i >= 0; i--) {
        var permalink = permalinks[i];
        if (_.isEmpty(permalink)) continue;

        permalink = parseTpl(permalink, data, page);
        permalink = permalink.trim();
        if (_.isEmpty(permalink)) continue;

        var dirname = page.dirname;
        if (page.filePair && page.filePair.dest) {
          dirname = page.filePair.dest;
        }

        page.dest = path.join(dirname, permalink);

        if (page.dest.slice(-1) === path.sep.slice(-1)) {
          page.dest = path.join(page.dest, 'index.html');
        }

        if (page.data) {
          page.data.permalink = permalink;
        }

        if (i > 0) {
          page = _.cloneDeep(page);
          pages.push(page);
        }
      }
    }

    if (!page.data.permalink) {
      page.data.permalink = page.src;
    }

    next();

  });

  callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};
