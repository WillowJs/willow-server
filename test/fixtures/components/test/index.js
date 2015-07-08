var WillowComponent = require('willow-component');

module.exports = WillowComponent.extend({
	render: function() {
		return (<h1>test</h1>);
	},
	test: function(foo) {
		console.log('bar');
	}
})
.metadata(function(url) {
	var metadata = {
		title: 'Unknown',
		status: 404
	};

	if(url.pathname === '/hello/world') {
		metadata.status = 200;
		metadata.title = 'Hello World!'
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
});