require('node-jsx').install({extension: '.jsx'});
GLOBAL.React = require('react');
GLOBAL.willow_server = true;
var http = require('http');
var express = require('express');
var path = require('path');
var _ = require('lodash');
var underscoreDeepExtend = require('underscore-deep-extend');
_.mixin({deepExtend: underscoreDeepExtend(_)});

var component = require('./routes/component');
var other = require('./routes/other');

module.exports = function(options) {
	options = _.deepExtend({
		componentNamespace: 'component',
		port: 3000,
		host: '127.0.0.1',
		componentDir: './components'
	}, options);

	var app = express();
	var componentRoute = path.join(
		'/',
		options.componentNamespace,
		':component',
		':event',
		':handler'
	);

	app.use(componentRoute, component({componentDir: options.componentDir}));
	app.use('/', other);

	http.createServer(app).listen(options.port, options.host);
};
