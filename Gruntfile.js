module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      tmp: [ 'test/tmp' ]
    },
    assemble: {
      options: {
        language: 'javascript',
        plugins: [ './permalink.js' ]
      },
      basic: {
        files: {
          'test/tmp/basic/': [ 'test/case/index.hbs', 'test/case/case_*.hbs' ]
        }
      },
      with_opts: {
        options: {
          title: 'untitled',
          permalink: '/{{ title }}/'
        },
        files: {
          'test/tmp/with_opts/': [ 'test/case/index.hbs', 'test/case/case_*.hbs' ]
        }
      },
      advanced: {
        options: {
          flatten: true,
          reverse: function(string) {
            return string.split("").reverse().join("");
          },
          require: require,
          title: 'untitled',
          permalink: '/{{ reverse(title) }}/'
        },
        files: {
          'test/tmp/advanced/': [ 'test/case/index.hbs', 'test/case/case_*.hbs', 'test/case/adv_case_*.hbs' ]
        }
      }
    }
  });

  grunt.registerTask('check_files', 'Check files.', function() {
    var assert = require('assert');
    var test = function(base, filepath) {
      var file = base + filepath;
      try {
        assert.strictEqual(grunt.file.read(file).trim(),
          filepath.replace(/index\.html$/, ''));
        grunt.log.ok(file + ' passed.');
      } catch (e) {
        grunt.fail.fatal(e.message);
      }
    };

    var dest;

    dest = 'test/tmp/basic';
    test(dest, '/somewhere-else/index.html');
    test(dest, '/test/case/case_empty.html');
    test(dest, '/somewhere/else.html');
    test(dest, '/test/case/case_null.html');
    test(dest, '/test/case/case_undefined.html');
    test(dest, '/' + grunt.config('assemble.options.language') + '.html');
    test(dest, '/var_yfm.html');
    test(dest, '/multiple/1.html');
    test(dest, '/multiple/2.html');
    test(dest, '/multiple/3.html');
    test(dest, '/multiple/4.html');
    test(dest, '/articles/index.html');
    test(dest, '/articles/long/index.html');
    test(dest, '/articles/short/index.html');
    test(dest, '/test/case/index.html');

    dest = 'test/tmp/with_opts';
    test(dest, '/somewhere-else/index.html');
    test(dest, '/test/case/case_empty.html');
    test(dest, '/somewhere/else.html');
    test(dest, '/test/case/case_null.html');
    test(dest, '/' + grunt.config('assemble.with_opts.options.title') + '/index.html');
    test(dest, '/' + grunt.config('assemble.options.language') + '.html');
    test(dest, '/var_yfm.html');
    test(dest, '/multiple/1.html');
    test(dest, '/multiple/2.html');
    test(dest, '/multiple/3.html');
    test(dest, '/multiple/4.html');
    test(dest, '/articles/index.html');
    test(dest, '/articles/long/index.html');
    test(dest, '/articles/short/index.html');
    test(dest, '/' + grunt.config('assemble.with_opts.options.title') + '/index.html');

    dest = 'test/tmp/advanced';
    var r = grunt.config('assemble.advanced.options.reverse');
    test(dest, '/somewhere-else/index.html');
    test(dest, '/case_empty.html');
    test(dest, '/somewhere/else.html');
    test(dest, '/case_null.html');
    test(dest, '/' + r(grunt.config('assemble.advanced.options.title')) + '/index.html');
    test(dest, '/' + grunt.config('assemble.options.language') + '.html');
    test(dest, '/var_yfm.html');
    test(dest, '/c4ca4238a0b923820dcc509a6f75849b.html');
    test(dest, '/multiple/1.html');
    test(dest, '/multiple/2.html');
    test(dest, '/multiple/3.html');
    test(dest, '/multiple/4.html');
    test(dest, '/articles/index.html');
    test(dest, '/articles/long/index.html');
    test(dest, '/articles/short/index.html');
    test(dest, '/' + r(grunt.config('assemble.advanced.options.title')) + '/index.html');
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', [ 'clean', 'assemble', 'check_files' ]);
  grunt.registerTask('default', [ 'test' ]);

};