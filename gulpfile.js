'use strict';

var gulp = require('gulp'),
    chalk = require('chalk'),
    fs = require('fs'),
    xsd = require('libxml-xsd');
    
gulp.task('validate-xml1', function() {
  xsd.parseFile('./manifest.xsd', function(err, schema) {
    console.log('--schema parsed');
    schema.validateFile('./manifest-invalid-attribute-value.xml', function(err, validationErrors) {
      console.log(err);
      console.log(validationErrors);
    });
  });
});

gulp.task('validate-xml', function () {
  xsd.parseFile('./manifest.xsd', function(err, schema) {
    gulp.src('./*.xml')
      .pipe(validateXml(schema));
  });
});

function validateXml(schema) {
  function doValidate(file, cb) {
    schema.validate(file.contents, function(err, validationErrors) {
      console.log('Validation results for ' + chalk.blue(file.path.substring(file.path.lastIndexOf('/')+1)) + ':');
      console.log(err);
      console.log(validationErrors);
    });
  }

  return require('event-stream').map(doValidate);
}