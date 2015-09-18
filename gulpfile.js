'use strict';

var gulp = require('gulp'),
  chalk = require('chalk'),
  fs = require('fs'),
  xmllint = require('xmllint');

gulp.task('validate-xml', function () {
  var xsd = fs.readFileSync('./manifest.xsd');
  gulp.src('./*.xml')
    .pipe(validateXml(xsd));
});

function validateXml(xsd) {
  function doValidate(file, cb) {
    console.log('\nValidating ' + chalk.blue(file.path.substring(file.path.lastIndexOf('/')+1)) + ':');
    
    var result = xmllint.validateXML({
      xml: file.contents,
      schema: xsd
    });
    
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

  return require('event-stream').map(doValidate);
}