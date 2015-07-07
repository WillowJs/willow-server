var WillowComponent = require('willow-component');
// var w = GLOBAL.window;
// delete GLOBAL.window;

var component = WillowComponent.extend({
	render: function() {
		return (<h1>test</h1>);
	},
	test: function(foo) {
		console.log('bar');
	}
})
.build();

// console.log(component);

// component.willow.events = null;

// GLOBAL.window = w;

module.exports = component;