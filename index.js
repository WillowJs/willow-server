require('node-jsx').install({extension: '.jsx'});
GLOBAL.React = require('react');
// var server = require('./server.jsx');
var http = require('http');
var express = require('express');
var path = require('path');
// var config = require('./core/config-loader/config-loader')();
// var serverEventRunner = require('./core/willow/server-event-runner');
var _ = require('lodash');
var underscoreDeepExtend = require('underscore-deep-extend');
_.mixin({deepExtend: underscoreDeepExtend(_)});

module.exports = function(options) {
	options = options || {};
	if(!options.componentNamespace) {
		options.componentNamespace = 'component';
	}
	if(!options.port) {
		options.port = 3000;
	}
	if(!options.host) {
		options.host = '127.0.0.1';
	}

	var app = express();
	var componentRoute = path.join(
		'/',
		options.componentNamespace,
		':component',
		':event',
		':handler'
	);

	app.use(componentRoute, function(req, res) {
		console.log(req.params);
		// var eventObj = _.deepExtend(req.query, req.body);
		// var result = serverEventRunner(
		// 	req.params.component,
		// 	req.params.event,
		// 	req.params.handler,
		// 	eventObj,
		// 	// resolve
		// 	function(data) {
		// 		res.json(data);
		// 	},
		// 	// reject
		// 	function(error) {
		// 		res.status(error.status).json(error);
		// 	}
		// );
	});
	app.use('/', server);

	http.createServer(app).listen(options.port, options.host);
};
