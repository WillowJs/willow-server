var WillowServer = require('../../index.js');
var TestUtils = require('react/addons').addons.TestUtils;
var path = require('path');
var request = require('request');

describe('willow-server', function() {

	before(function() {
		var server = new WillowServer({
			componentDir: path.join(__dirname, '../fixtures/components'),
			port: 3000
		});
	});

	describe('other', function() {
		it('should return 200', function (done) {
			request('http://localhost:3000', function(err, res, body) {
				expect(res.statusCode).to.equal(404);
				expect(body).to.equal('{"message":"Not found","params":{},"status":404}');
				done();
			});
		});
	});
});