assemble-permalink
==================

A stupid permalink plugin for Assemble.

Now, you have the freedom to customize the permalink of any page.

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

See Also
--------

* [assemble-contrib-permalinks](https://github.com/assemble/assemble-contrib-permalinks)

Developers
----------

* caiguanhao &lt;caiguanhao@gmail.com&gt;
