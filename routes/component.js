'use strict';
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var WillowError = require('willow-error');
var context = require('willow-context');

module.exports = function(options) {

	var components = {};
	var files = [];

	if(options.componentDir) {
		files = fs.readdirSync(options.componentDir);
		files.forEach(function(file) {
			var filepath = path.join(options.componentDir, file);
			if(fs.statSync(filepath).isDirectory()) {
				var ComponentClass = require(filepath);
				if(!ComponentClass.prototype || !ComponentClass.prototype._willow) {
					components[file] = false;
					return;
				}

				var state = ComponentClass.prototype._willow;
				var contextObj = state.getContext();
				var config = context(contextObj.config, 'server');
				var moduleInfo = context(contextObj.requires, 'server');
				var requires = {};

				for(var i in moduleInfo) {
					if(moduleInfo[i].charAt(0) === '.'){
						requires[i] = require(path.join(filepath, moduleInfo[i]));
					}
					else {
						requires[i] = require(moduleInfo[i]);
					}
				}

				state.setRequires(requires);
				state.setConfig(config);

				components[file] = ComponentClass;
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
				{component: component},
				404,
				'NOCOMPONENT'
			)).send(res);
		}

		if(!_.isObject(components[component]) || !components[component].run) {
			return (new WillowError(
				'{{component}} is not a component.',
				{component: component},
				404,
				'NOCOMPONENT'
			)).send(res);
		}

		components[component].run(
			eventName,
			handler,
			eventObj,
			req.method,
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