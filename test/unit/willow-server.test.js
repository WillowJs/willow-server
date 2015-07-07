var WillowServer = require('../../index.js');
var TestUtils = require('react/addons').addons.TestUtils;
var path = require('path');
var request = require('request');
var App = require('../fixtures/components/test');

describe('willow-server', function() {

	before(function() {
		var server = new WillowServer({
			componentNamespace: 'component',
			componentDir: path.join(__dirname, '../fixtures/components'),
			port: 3000,
			app: App
		});
	});

	describe('component', function() {
		it('should return an error for components that don\'t exist.', function (done) {
			request('http://localhost:3000/component/hello/event/handler', function(err, res, body) {
				expect(res.statusCode).to.equal(404);
				var json = JSON.parse(body);
				expect(json.id).to.equal('NOCOMPONENT');
				expect(json.message).to.equal('{{component}} not found.');
				expect(json.params.component).to.equal('hello');
				done();
			});
		});
		it('should return an error for components that aren\'t functions.', function (done) {
			request('http://localhost:3000/component/bad/event/handler', function(err, res, body) {
				expect(res.statusCode).to.equal(404);
				var json = JSON.parse(body);
				expect(json.id).to.equal('NOCOMPONENT');
				expect(json.message).to.equal('{{component}} is not a component.');
				expect(json.params.component).to.equal('bad');
				done();
			});
		});
		it('should return run successfully for valid parameters.', function (done) {
			request.post('http://localhost:3000/component/test/baz/b2', function(err, res, body) {
				expect(res.statusCode).to.equal(200);
				var json = JSON.parse(body);
				expect(json.b2).to.deep.equal({ success: true });
				done();
			});
		});
	});

	describe('other', function() {
		it('should return 200', function (done) {
			request('http://localhost:3000/hello/world?face=book&foo=bar#wasf', function(err, res, body) {
				expect(body).to.have.string('<!DOCTYPE html>');
				expect(body).to.match(/.*<div id="app">.*<\/div>/);
				expect(body).to.match(/.*<h1.*test<\/h1>/);
				done();
			});
		});
		// @todo test valid call
	});
});