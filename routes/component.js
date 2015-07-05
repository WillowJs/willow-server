var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var WillowError = require('willow-error');

module.exports = function(options) {

	var components = {};
	var files = [];

	if(options.componentDir) {
		files = fs.readdirSync(options.componentDir);
		files.forEach(function(file) {
			var filepath = path.join(options.componentDir, file);
			if(fs.statSync(filepath).isDirectory()) {
				components[file] = require(filepath);
			}
		});
	}

	return function(req, res) {
		var eventObj = _.deepExtend(req.query, req.body);
		var component = req.params.component;
		var eventName = req.params.event;
		var handler = req.params.handler;

		if(!components.hasOwnProperty(component)) {
			return (new WillowError(
				'{{component}} not found.',
				404,
				'NOCOMPONENT',
				{component: component}
			)).send(res);
		}
		if(!_.isFunction(components[component])) {
			return (new WillowError(
				'{{component}} is not a component.',
				404,
				'NOCOMPONENT',
				{component: component}
			)).send(res);
		}

		var newComponent = new components[component]();

		if(!newComponent.willow || !_.isObject(newComponent.willow)) {
			return (new WillowError(
				'{{component}} has no willow property.',
				500,
				'BADCOMPONENT',
				{component: component}
			)).send(res);
		}

		var willow = newComponent.willow;

		if(!willow.events || !_.isObject(willow.events)) {
			return (new WillowError(
				'{{component}} has no events.',
				404,
				'NOEVENT',
				{component: component}
			)).send(res);
		}

		var handlers = willow.events.handlers;

		if(!handlers || !_.isObject(handlers)) {
			return (new WillowError(
				'{{component}} has no handlers.',
				404,
				'NOHANDLER',
				{component: component}
			)).send(res);
		}

		if(!handlers[eventName] || !_.isObject(handlers[eventName])) {
			return (new WillowError(
				'{{component}} has no handler for {{event}}.',
				404,
				'NOHANDLER',
				{component: component, event: eventName}
			)).send(res);
		}

		var handlerModel = handlers[eventName].handler;

		if(!handlerModel) {
			return (new WillowError(
				'{{component}} has no handler for {{event}}/{{handler}}.',
				404,
				'NOHANDLER',
				{component: component, event: eventName, handler: handler}
			)).send(res);
		}

		// We probably don't need to check validation here
		// if(!handlerModel.isValid()) {
		// 	return reject(error(component+'/'+eventName+'/'+handler+' is not a valid handler: '+handlerModel.validationError, 500, 'BADHANDLER'));
		// }

		if(handlerModel.method === 'local') {
			return (new WillowError(
				'{{component}}/{{event}}/{{handler}} is a local handler.',
				400,
				'LOCALHANDLER',
				{component: component, event: eventName, handler: handler}
			)).send(res);
		}

		var run = handlerModel.run;
		return run(
			eventObj,
			// Resolve 
			function(data) {
				res.json(data);
			},
			// Reject
			function(err) {
				if(_.isObject(err)) {
					if(err.status) {
						res.status(err.status);
					}
					res.json(err);
				}
				else {
					res.status(500);
					res.send(err.toString());
				}
			}
		);

	};
};

// module.exports = function(component, eventName, handler, eventObj, resolve, reject) {
// 	if(!components.hasOwnProperty(component)) return false;
// 	if(!_.isFunction(components[component])) {
// 		return reject(error(component+' is not a component', 404, 'NOCOMPONENT'));
// 	}
// 	var newComponent = new components[component]();

// 	if(!newComponent.willow || !_.isObject(newComponent.willow)) {
// 		return reject(error(component+' has no willow property', 500, 'BADCOMPONENT'));
// 	}

// 	var willow = newComponent.willow;

// 	if(!willow.events || !_.isObject(willow.events)) {
// 		return reject(error(component+' has no events', 404, 'NOEVENT'));
// 	}

// 	var handlers = willow.events.handlers;

// 	if(!handlers || !_.isObject(handlers)) {
// 		return reject(error(component+' has no handlers', 404, 'NOHANDLER'));
// 	}

// 	if(!handlers[eventName] || !_.isObject(handlers[eventName])) {
// 		return reject(error(component+' has no handler for '+eventName, 404, 'NOHANDLER'));
// 	}

// 	var handlerModel = handlers[eventName].get(handler);
// 	if(!handlerModel) {
// 		return reject(error(component+' has no handler for '+eventName+'/'+handler, 404, 'NOHANDLER'));
// 	}

// 	if(!handlerModel.isValid()) {
// 		return reject(error(component+'/'+eventName+'/'+handler+' is not a valid handler: '+handlerModel.validationError, 500, 'BADHANDLER'));
// 	}

// 	if(handlerModel.get('method') === 'local') {
// 		return reject(error(component+'/'+eventName+'/'+handler+' is a local handler', 400, 'LOCALHANDLER'));
// 	}

// 	var run = handlerModel.get('run');
// 	return run(eventObj, resolve, reject);
// };