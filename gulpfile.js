'use strict';

var gulp = require('gulp'),
  chalk = require('chalk'),
  fs = require('fs'),
  xmllint = require('xmllint'),
  $ = require('gulp-load-plugins')({lazy: true}),
  path = require('path'),
  minimist = require('minimist');

var cwd = process.cwd();
var options = minimist(process.argv.slice(2));

gulp.task('test', function(done){
    gulp.src([path.join(cwd, 'test/**/*.js')])
      .pipe($.mocha()) // run tests
      .on('error', handleError)
      .pipe($.istanbul.writeReports()) // write coverage reports
      .on('end', done);
});

gulp.task('validate-xml', function () {
  var xsd = fs.readFileSync('./manifest.xsd');
  var xmlFilePath = options.xmlfile || './manifest.xml';
  var resultsAsJson = options.json || false;
  var xml = fs.readFileSync(xmlFilePath);
  
  if (!resultsAsJson) {
    console.log('\nValidating ' + chalk.blue(xmlFilePath.substring(xmlFilePath.lastIndexOf('/')+1)) + ':');
  } 
  var result = xmllint.validateXML({
    xml: xml,
    schema: xsd
  });
  
  if (resultsAsJson) {
    console.log(JSON.stringify(result));
  }
  else {
    if (result.errors === null) {
      console.log(chalk.green('Valid'));
    }
    else {
      console.log(chalk.red('Invalid'));
      result.errors.forEach(function(e) {
        console.log(chalk.red(e));
      });
    }
  }
});

function log(msg){
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

function handleError(err){
  $.util.log(err.toString());
  this.emit('end'); // jshint ignore:line
}