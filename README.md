assemble-permalink
==================

A stupid permalink plugin for Assemble.

✓ Customize the permalink of any page.  
✓ Generate more than one page using the same template.  
✓ Dynamic permalink based on Assemble options or page data.  
✓ Read ``{{permalink}}`` from all pages.  

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

Now, you can use ``permalink`` on your pages:

    ---
    permalink: /somewhere/else/
    ---
    <p>example</p>

then you'll have a /somewhere/else/index.html relative to the destination directory.

Multiple Permalinks
-------------------

You can use a multiline string or an array to generate more than one page using the same template:

    ---
    permalink: |
      /location/a/
      /location/b/
    ---
    {{permalink}}

or

    ---
    permalink:
      - /location/a/
      - /location/b/
    ---
    {{permalink}}

Both examples will generate two pages: /location/a/index.html and /location/b/index.html with content /location/a/ and /location/b/ respectively.

Permalink Template
------------------

You can also use template to create a dynamic permalink:

    ---
    title: somewhere-else
    permalink: /<%= pkg.name %>/<%= title %>/
    ---
    <p>example</p>

then you'll have /example-package/somewhere-else/index.html. For more info about this template syntax, see [lodash documentation](http://lodash.com/docs#template).

The template data come from three ways and in this order (the latter property will overwrite the former property):

* Assemble options defined in Gruntfile.js.
* The page object that contains these attributes: dirname, filename, pageName, pagename, basename, src, dest, assets, ext, extname, page, data, filePair.
* Page's YAML Front Matter.

Variable
--------

You can access ``{{permalink}}`` on all pages and:

* it starts with a path separator such as "/"
* "/index.html" at the end of permalink string will be replaced with "/"

Assemble Options
----------------

You can set ``permalink`` option for all pages in your Gruntfile.js.

Since grunt also parses lodash template (``<%= ... %>``), you can use ``{{`` and ``}}`` to escape ``<%=`` and ``%>``. If you really want ``{{`` and ``}}`` in the string, use ``{{{{`` and ``}}}}``.

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

Now, each of your pages in ``site`` scope has the permalink option as ``/<%= pkg.name %>/<%= title %>/``, which ``pkg.name`` is defined in package.json and ``title`` can be different in pages.

If you don't want to use global permalink option on some pages, add ``permalink:`` or ``permalink: ''`` to YAML front matter.

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

And here is a simple text explaining how the conversion works:

    { title }         -> { title }
    {{ title }}       -> <%= title %>
    {{{ title }}}     -> { title }
    {{{{ title }}}}   -> {{ title }}
    {{{{{ title }}}}} -> {{{ title }}}
    ...

See Also
--------

* [assemble-contrib-permalinks](https://github.com/assemble/assemble-contrib-permalinks)

Developers
----------

* caiguanhao &lt;caiguanhao@gmail.com&gt;
