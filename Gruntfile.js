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
          'test/tmp/basic/': [ 'test/case/case_*.hbs' ]
        }
      },
      with_opts: {
        options: {
          title: 'untitled',
          permalink: '/{{ title }}/'
        },
        files: {
          'test/tmp/with_opts/': [ 'test/case/case_*.hbs' ]
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
          'test/tmp/advanced/': [ 'test/case/case_*.hbs', 'test/case/adv_case_*.hbs' ]
        }
      }
    }
  });

  grunt.registerTask('check_files', 'Check files.', function() {
    var assert = require('assert');
    var isFile = function(file) {
      try {
        assert(grunt.file.isFile(file));
        grunt.log.ok(file + ' is a file.');
      } catch (e) {
        grunt.fail.fatal(file + ' is not a file.');
      }
    };

    var dest;

    dest = 'test/tmp/basic';
    isFile(dest + '/somewhere-else/index.html');
    isFile(dest + '/test/case/case_empty.html');
    isFile(dest + '/somewhere/else.html');
    isFile(dest + '/test/case/case_null.html');
    isFile(dest + '/test/case/case_undefined.html');
    isFile(dest + '/' + grunt.config('assemble.options.language') + '.html');
    isFile(dest + '/var_yfm.html');
    isFile(dest + '/multiple/1.html');
    isFile(dest + '/multiple/2.html');
    isFile(dest + '/multiple/3.html');
    isFile(dest + '/multiple/4.html');
    isFile(dest + '/articles/index.html');
    isFile(dest + '/articles/long/index.html');
    isFile(dest + '/articles/short/index.html');

    dest = 'test/tmp/with_opts';
    isFile(dest + '/somewhere-else/index.html');
    isFile(dest + '/test/case/case_empty.html');
    isFile(dest + '/somewhere/else.html');
    isFile(dest + '/test/case/case_null.html');
    isFile(dest + '/' + grunt.config('assemble.with_opts.options.title') + '/index.html');
    isFile(dest + '/' + grunt.config('assemble.options.language') + '.html');
    isFile(dest + '/var_yfm.html');
    isFile(dest + '/multiple/1.html');
    isFile(dest + '/multiple/2.html');
    isFile(dest + '/multiple/3.html');
    isFile(dest + '/multiple/4.html');
    isFile(dest + '/articles/index.html');
    isFile(dest + '/articles/long/index.html');
    isFile(dest + '/articles/short/index.html');


    dest = 'test/tmp/advanced';
    var r = grunt.config('assemble.advanced.options.reverse');
    isFile(dest + '/somewhere-else/index.html');
    isFile(dest + '/case_empty.html');
    isFile(dest + '/somewhere/else.html');
    isFile(dest + '/case_null.html');
    isFile(dest + '/' + r(grunt.config('assemble.advanced.options.title')) + '/index.html');
    isFile(dest + '/' + grunt.config('assemble.options.language') + '.html');
    isFile(dest + '/var_yfm.html');
    isFile(dest + '/c4ca4238a0b923820dcc509a6f75849b.html');
    isFile(dest + '/multiple/1.html');
    isFile(dest + '/multiple/2.html');
    isFile(dest + '/multiple/3.html');
    isFile(dest + '/multiple/4.html');
    isFile(dest + '/articles/index.html');
    isFile(dest + '/articles/long/index.html');
    isFile(dest + '/articles/short/index.html');
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', [ 'clean', 'assemble', 'check_files' ]);
  grunt.registerTask('default', [ 'test' ]);

};