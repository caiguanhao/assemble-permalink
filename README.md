assemble-permalink
==================

A stupid permalink plugin for Assemble.

Now, you have the freedom to customize the permalink of any page.

[![Build Status](https://travis-ci.org/caiguanhao/assemble-permalink.png?branch=master)](https://travis-ci.org/caiguanhao/assemble-permalink)

Usage
-----

First, install this plugin and save the entry to devDependencies in package.json:

    npm install assemble-permalink --save-dev

Second, add ``'assemble-permalink'`` to your ``assemble.options.plugins``.

    module.exports = function(grunt) {
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assemble: {
          options: {
            pkg: '<%= pkg %>',
            plugins: [ 'assemble-permalink', ... ],
            ...
          },
          ...
        },
        ...
      });
      ...
    };

Now, you can add ``permalink`` to your pages:

    ---
    permalink: /somewhere/else/
    ---
    <p>example</p>

then you'll have a /somewhere/else/index.html relative to the destination directory.

Variable
--------

You can also use varialbes from assemble.options and the data in the YAML front matter:

    ---
    title: somewhere-else
    permalink: /<%= pkg.name %>/<%= title %>/
    ---
    <p>example</p>

then you'll have /example-package/somewhere-else/index.html.

Assemble Options
----------------

You can set ``permalink`` option for all pages in your Gruntfile.js. ``{{ variable }}`` will be converted to ``<%= varialbe %>``.

    module.exports = function(grunt) {
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assemble: {
          options: {
            pkg: '<%= pkg %>',
            plugins: [ 'assemble-permalink', 'other/plugins/*' ],
            permalink: '/{{ pkg.name }}/{{ pkg.version }}/{{ title }}/',
            ...
          },
          site: {
            options: {
              permalink: '/{{ pkg.name }}/{{ title }}/'
            },
            files: {
              'site/': [ 'pages/*.hbs' ]
            }
          },
          ...
        },
        ...
      });
      ...
    };

Now, each of your pages in ``site`` has the permalink option as ``/<%= pkg.name %>/<%= title %>/``, which ``pkg.name`` is defined in package.json and ``title`` can be different in pages.

If you don't want to use permalink option on some pages, add ``permalink:`` or ``permalink: ''`` to YAML front matter.

    ---
    permalink: ''
    ---
    <p>example</p>

Advanced
--------

You can define functions in assemble.options. For example:

    assemble: {
      blog: {
        options: {
          moment: require('moment'),
          permalink: '/{{ moment(date).format("YYYY/MM") }}/{{ title }}/'
        },
        ...
      },
      ...
    }

or

    assemble: {
      blog: {
        options: {
          require: require,
          permalink: '/{{ require("moment")(date).format("YYYY/MM") }}/{{ title }}/'
        },
        ...
      },
      ...
    }

and then in your pages, set title and moment.js-favored date:

    ---
    date: 2013-01-01T12:12:12+08:00
    title: example
    ---

there you'll have 2013/01/example/index.html.

Another example generating the permalink of page having a Unicode title:

    assemble: {
      blog: {
        options: {
          chinese2latin: function(chinese) {
            return require('pinyin_index')(chinese, {
              output: function(pinyin_array, replaced) {
                for (var i = 0; i < pinyin_array.length; i++) {
                  pinyin_array[i] = pinyin_array[i].join('-');
                }
                return pinyin_array.join('-');
              }
            });
          },
          permalink: '/{{ chinese2latin(title) }}/'
        },
        ...
      },
      ...
    }

In your page:

    ---
    title: 天生我材必有用，千金散尽还复来。
    ---

which is the same as:

    ---
    title: 天生我材必有用，千金散尽还复来。
    permalink: <%= chinese2latin(title) %>
    ---

and you'll get:

    /tian-sheng-wo-cai-bi-you-yong-qian-jin-san-jin-huan-fu-lai/index.html

Note
----

Avoid using JavaScript reserved words (e.g. ``case``) as variable name.

If you have variables in your option assemble.options.permalink, in case the variable could not be found on any page, you can set a default value for that variable in assemble.options:

    options: {
      title: 'untitled',
      permalink: '/{{ title }}/'
    }

See Also
--------

* [assemble-contrib-permalinks](https://github.com/assemble/assemble-contrib-permalinks)

Developers
----------

* caiguanhao &lt;caiguanhao@gmail.com&gt;
