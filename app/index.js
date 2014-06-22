'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var GruntfileEditor = require('gruntfile-editor');

var NsdcssGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Nsdcss generator!'));

    var prompts = [
      {
        name: 'appName',
        message: 'What is your app\'s name ?'
      }
    ];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      done();
    }.bind(this));
  },
  createDirectories: function () {
    this.mkdir('app');
    this.mkdir('app/less');
    this.mkdir('app/less/framework');
    this.mkdir('app/less/ui');
    this.mkdir('app/css');
  },
  copyFiles: function () {
    this.copy('_package.json', 'package.json');
    this.copy('_.bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');

  },
  createSimpleDynamicFiles: function () {

    var context = {
      site_name: this.appName
    };
  },
  installLessFramework: function () {
    var done = this.async();
    var that = this;
    this.bowerInstall(['nsdcss'], function () {
      that.invoke("nsdcss:update-grunt", null, function () {
        done();
      });
    });
  }

});

module.exports = NsdcssGenerator;
