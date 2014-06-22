'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var GruntfileEditor = require('gruntfile-editor');

var UpdateGruntGenerator = yeoman.generators.Base.extend({
  _sortByKey: function (array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];

      if (typeof x == "string") {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }

      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  },
  _flatFileArray: function (array) {
    var flatFileArray = '[';
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i].files != 'undefined' && array[i].files.length)
        for (var j = 0; j < array[i].files.length; j++) {
          flatFileArray += "'" + array[i].files[j] + "',";
        }
    }
    flatFileArray += ']';
    return flatFileArray;
  },
  init: function () {
    this.frameworkfiles = [];
    this.uifiles = [];
    console.log('You called the update-grunt subgenerator with no argument');
  },
  createGruntFile: function () {

    this.bowerDirectory = this.dest.readJSON('.bowerrc').directory;
    var bowerFiles = this.expandFiles(this.bowerDirectory + "/**/bower.json");
    for (var i = 0; i < bowerFiles.length; i++) {
      var bowerConfig = this.dest.readJSON(bowerFiles[i]);
      if (typeof bowerConfig.nsdcss != 'undefined') {
        if (typeof bowerConfig.nsdcss.scope != 'undefined') {
          if (bowerConfig.nsdcss.scope == "framework") {
            this.frameworkfiles.push({
                files: this.expandFiles(path.dirname(bowerFiles[i]) + "/**/*.less"),
                order: bowerConfig.nsdcss.order || '999'
              });
          }
        }
      }
    }
    this.frameworkfiles = this._sortByKey(this.frameworkfiles, 'order');
    console.log('this.template:', typeof this.template);
    var context = {
      framework_directory: this.bowerDirectory,
      framework_files: this._flatFileArray(this.frameworkfiles)
    };
    this.template("_gruntfile.js", "Gruntfile.js", context);
  }
});

module.exports = UpdateGruntGenerator;