var WillowServer = require('../../index.js');
var TestUtils = require('react/addons').addons.TestUtils;
var path = require('path');
var request = require('request');

describe('willow-server', function() {

	before(function() {
		var server = new WillowServer({
			componentNamespace: 'component',
			componentDir: path.join(__dirname, '../fixtures/components'),
			port: 3000
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
		// @todo test valid call
	});

	describe('other', function() {
		it('should return 200', function (done) {
			request('http://localhost:3000', function(err, res, body) {
				expect(res.statusCode).to.equal(404);
				expect(body).to.equal('{"message":"Not found","params":{},"status":404}');
				done();
			});
		});
		// @todo test valid call
	});
});