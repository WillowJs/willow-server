'use strict';
var Willow = require('willow-component');

module.exports = Willow.createClass({
	render: function() {
		return (<h1>test</h1>);
	},
	test: function(foo) {
		console.log('bar');
	}
})
.require('_server', 'lodash', 'server')
.require('_client', 'lodash', 'client')
.require('_both', 'lodash', 'both')
.metadata(function(url) {
	var metadata = {
		title: 'Unknown',
		status: 404
	};

	if(url.pathname === '/hello/world') {
		metadata.status = 200;
		metadata.title = 'Hello World!';
	}

	return metadata;
})
.on('baz', {
	name: 'b1',
	method: 'local',
	dependencies: [],
	run: function(e, resolve, reject) {
		resolve({success: true});
	}
})
.on('baz', {
	name: 'b2',
	method: 'post',
	dependencies: ['b1'],
	run: function(e, resolve, reject) {
		resolve({success: true});
	}
})
.on('baz', {
	name: 'b3',
	method: 'get',
	dependencies: ['b1', 'b2'],
	run: function(e, resolve, reject) {
		resolve({success: true});
	}
})
.on('test', {
	name: 'requires',
	method: 'get',
	dependencies: [],
	run: function(e, resolve, reject) {;
		resolve({
			_client: this.require._client ? true : false,
			_server: this.require._server ? true : false,
			_both: this.require._both ? true : false
		});
	}
});