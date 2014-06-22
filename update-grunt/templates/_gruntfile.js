module.exports = function (grunt) {

  "use strict";
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  global.frameworkPath = '<%= framework_directory %>';
  global.sectionsMap = {
    'cf': 'Config',
    'c': 'Colors',
    's': 'Spacing',
    't': 'Typo',
    'u': 'Utility',
    'bp': 'Breakpoints',
    'sk': 'Skin Globals',
    'l': 'Layout'
  };

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    lessvarfile: {
      frontend: {
        options: {
          sectionDelimiter: '__',
          alignAt: 70,
          sectionsmap: global.sectionsMap,
          includeAllComponents: true
        },
        files: {
          'variables.less': [global.frameworkPath + '/**/*.less']
        }
      }
    },
    lessimportfile: {
      frameworkAbstract: {
        files: {
          'framework.less': <%= framework_files %>
        }
      },
      ui: {
        files: {
          'main.less': [ global.frameworkPath + '/setup/**/*.less', '__framework.less', 'plugins/shared/**/*.less', 'plugins/frontend/**/*.less', 'ui/shared/**/*.less', 'ui/frontend/**/*.less', 'ui/responsive-frontend.less', 'variables-frontend.less']
        }
      }
    },
    less: {
      frameworkAbstract: {
        src: 'framework.less', dest: '__framework.less'
      },
      ui: {
        src: 'main.less',
        dest: 'css/main.css',
        options: {
          cleancss: true
        }
      }
    },
    watch: {
      lessWatch: {
        files: ['**/*.less', global.frameworkPath + '/**/*.less'],
        tasks: ['css'],
        options: {
          spawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['css']);
  grunt.registerTask('css', ['lessvarfile', 'lessimportfile', 'less']);
  grunt.registerTask('watchit', ['watch']);

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

};
