'use strict';

var fs = require('fs'),
	path = require('path'),
	xmllint = require('xmllint'),
	exec = require('child_process').exec,
	chai = require('chai'),
  	expect = chai.expect;
	
describe('office:app', function(){	
	describe('add-in manifest', function() {
		this.timeout(10000);
		
		var projectRoot = path.join(__dirname, '../../');
		var gulp = '$(which gulp)';
		var validateXmlCmd = gulp + ' validate-xml --json --xmlfile ';

		it('valid manifest.xml is valid', function(done) {
			var xmlFilePath = './test/manifest/manifest-valid.xml';
			
			exec(validateXmlCmd + xmlFilePath, {
				cwd: projectRoot
			}, function(err, stdout) {
				try {
					var output = getValidateXmlCmdOutputContents(stdout);
					var result = JSON.parse(output);
					expect(result).to.be.a('object');
					expect(result.errors).to.be.null;
				}
				catch (e) {
					expect.fail('undefined', 'object', 'Error while parsing xml validation output')
				}
				done();
			});
		});
		
		it('manifest.xml with invalid attribute value is invalid', function(done) {
			var xmlFilePath = './test/manifest/manifest-invalid-attribute-value.xml';
			
			exec(validateXmlCmd + xmlFilePath, {
				cwd: projectRoot
			}, function(err, stdout) {
				try {
					var output = getValidateXmlCmdOutputContents(stdout);
					var result = JSON.parse(output);
					expect(result).to.be.an('object');
					expect(result.errors).not.to.be.null;
					expect(result.errors.length).to.equal(1);
					expect(result.errors[0]).to.contain("Element '{http://schemas.microsoft.com/office/appforoffice/1.1}SupportUrl', attribute 'DefaultValue': '[]' is not a valid value");
				}
				catch (e) {
					expect.fail('undefined', 'object', 'Error while parsing xml validation output')
				}
				done();
			});
		});
		
		it('manifest.xml with missing required attribute is invalid', function(done) {
			var xmlFilePath = './test/manifest/manifest-missing-required-attribute.xml';
			
			exec(validateXmlCmd + xmlFilePath, {
				cwd: projectRoot
			}, function(err, stdout) {
				try {
					var output = getValidateXmlCmdOutputContents(stdout);
					var result = JSON.parse(output);
					expect(result).to.be.an('object');
					expect(result.errors).not.to.be.null;
					expect(result.errors.length).to.equal(1);
					expect(result.errors[0]).to.contain("Element '{http://schemas.microsoft.com/office/appforoffice/1.1}SupportUrl': The attribute 'DefaultValue' is required but missing");
				}
				catch (e) {
					expect.fail('undefined', 'object', 'Error while parsing xml validation output')
				}
				done();
			});
		});
		
		it('manifest.xml with missing required attribute value is invalid', function(done) {
			var xmlFilePath = './test/manifest/manifest-missing-required-attribute-value.xml';
			
			exec(validateXmlCmd + xmlFilePath, {
				cwd: projectRoot
			}, function(err, stdout) {
				try {
					var output = getValidateXmlCmdOutputContents(stdout);
					var result = JSON.parse(output);
					expect(result).to.be.an('object');
					expect(result.errors).not.to.be.null;
					expect(result.errors.length).to.equal(2);
					expect(result.errors[0]).to.contain("Element '{http://schemas.microsoft.com/office/appforoffice/1.1}SupportUrl', attribute 'DefaultValue': [facet 'minLength'] The value '' has a length of '0'");
					expect(result.errors[1]).to.contain("Element '{http://schemas.microsoft.com/office/appforoffice/1.1}SupportUrl', attribute 'DefaultValue': '' is not a valid value");
				}
				catch (e) {
					expect.fail('undefined', 'object', 'Error while parsing xml validation output')
				}
				done();
			});
		});
		
		it('manifest.xml with missing required element is invalid', function(done) {
			var xmlFilePath = './test/manifest/manifest-missing-required-element.xml';
			
			exec(validateXmlCmd + xmlFilePath, {
				cwd: projectRoot
			}, function(err, stdout) {
				try {
					var output = getValidateXmlCmdOutputContents(stdout);
					var result = JSON.parse(output);
					expect(result).to.be.an('object');
					expect(result.errors).not.to.be.null;
					expect(result.errors.length).to.equal(1);
					expect(result.errors[0]).to.contain("Element '{http://schemas.microsoft.com/office/appforoffice/1.1}Version': This element is not expected. Expected is ( {http://schemas.microsoft.com/office/appforoffice/1.1}Id");
				}
				catch (e) {
					expect.fail('undefined', 'object', 'Error while parsing xml validation output')
				}
				done();
			});
		});
	});
});

function getValidateXmlCmdOutputContents(gulpOutputContents) {
	var pos = gulpOutputContents.indexOf('{');
	return gulpOutputContents.substr(pos, gulpOutputContents.lastIndexOf('}')+1-pos);
}