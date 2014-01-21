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

  var escRegEx = function(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  var PATH_SEP = path.sep.slice(-1);
  var INDEX    = 'index.html';
  var INDEX_RE = new RegExp(escRegEx(PATH_SEP + INDEX) + '$');

  // parse lodash template <%= %>
  var parseTpl = function(input, data, page) {
    try {
      return _.template(input, data);
    } catch (error) {
      grunt.fail.fatal(error.message + ' at ' + page.src);
    }
  };

  // convert {{ variable }} to <%= variable %>
  // {{{{ not_variable }}}} to {{ not_variable }}
  var unescTpl = function(input) {
    return input.replace(/\{{2,}/g, function(match) {
      return match.length > 2 ? match.substr(2) : '<%=';
    }).replace(/\}{2,}/g, function(match) {
      return match.length > 2 ? match.substr(2) : '%>';
    });
  };

  // standardize permalink output
  var standard = function(permalink) {
    permalink = permalink || '';
    if (permalink.slice(0, 1) !== PATH_SEP) {
      permalink = PATH_SEP + permalink;
    }
    permalink = permalink.replace(INDEX_RE, PATH_SEP);
    return permalink;
  };

  if (_.isString(defaults) && !_.isEmpty(defaults)) {
    defaults = unescTpl(defaults);
  }

  async.each(pages, function(page, next) {

    page.data = page.data || {};

    var yfm = page.data;
    var permalink = defaults;
    var dirname = page.dirname;
    if (page.filePair && page.filePair.dest) {
      dirname = page.filePair.dest_for_permalink || page.filePair.dest;
    }

    if (!_.isUndefined(yfm.permalink)) {
      permalink = yfm.permalink;
    }

    if (!_.isEmpty(permalink)) {

      var data = _.assign({}, options, page, yfm);
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

        page.data.permalink = standard(permalink);

        if (i > 0) {
          page = _.cloneDeep(page);
          pages.push(page);
        }
      }
    }

    if (!page.data.permalink) {
      page.data.permalink = page.dest.substr(dirname.length);
    }

    page.data.permalink = standard(page.data.permalink);

    next();

  });

  callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};
