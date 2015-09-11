'use strict';

var gulp = require('gulp'),
    chalk = require('chalk'),
    validator = require('xsd-schema-validator');

gulp.task('validate-xml', function () {
  gulp.src('./*.xml')
    .pipe(validateXml());
});

function validateXml() {
  function doValidate(file, cb) {
    validator.validateXML(file.contents, './manifest.xsd', function (err, result) {
      console.log('Validation results for ' + chalk.blue(file.path.substring(file.path.lastIndexOf('/')+1)) + ':');
      if (err) {
        if (result) {
          result.messages.forEach(function (m) {
            console.log(chalk.red(m));
          });
        }
        else {
          console.log(chalk.red(err));
        }
      }
      else {
        console.log(chalk.green('OK'));
      }
      
      console.log('\n');
    });
  }

  return require('event-stream').map(doValidate);
}