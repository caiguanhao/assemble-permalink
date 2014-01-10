module.exports = function(params, callback) {
  'use strict';

  var path     = require('path');
  var async    = require('async');
  var _        = require('lodash');

  var PATH_SEP = path.sep.slice(-1);
  var INDEX    = 'index.html';
  var INDEX_RE = /index\.html$/;

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
  var unescTpl = function(input) {
    return input.replace(/{{/g, '<%=').replace(/}}/g, '%>');
  };

  // convert {{ variable }} to <%= variable %>
  if (_.isString(defaults) && !_.isEmpty(defaults)) {
    defaults = unescTpl(defaults);
  }

  async.each(pages, function(page, next) {

    page.data = page.data || {};

    var yfm = page.data;
    var permalink = defaults;
    var dirname = page.dirname;
    if (page.filePair && page.filePair.dest) {
      dirname = page.filePair.dest;
    }

    if (!_.isUndefined(yfm.permalink)) {
      permalink = yfm.permalink;
    }

    if (!_.isEmpty(permalink)) {

      var data = _.assign({}, options, yfm);
      var permalinks;

      if (_.isString(permalink)) {

        permalink = unescTpl(permalink);
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

        permalink = unescTpl(permalink);
        permalink = parseTpl(permalink, data, page);
        permalink = permalink.trim();
        if (_.isEmpty(permalink)) continue;

        page.dest = path.join(dirname, permalink);

        if (page.dest.slice(-1) === PATH_SEP) {
          page.dest = path.join(page.dest, 'index.html');
        }

        if (page.data) {
          page.data.permalink = permalink.replace(INDEX_RE, '');
        }

        if (i > 0) {
          page = _.cloneDeep(page);
          pages.push(page);
        }
      }
    }

    if (!page.data.permalink) {
      page.data.permalink = page.dest.substr(dirname.length);
    }

    if (page.data.permalink.slice(0, 1) !== PATH_SEP) {
      page.data.permalink = PATH_SEP + page.data.permalink;
    }

    page.data.permalink = page.data.permalink.replace(INDEX_RE, '');

    next();

  });

  callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};
