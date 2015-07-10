require('node-jsx').install();
GLOBAL.React = require('react');
var http = require('http');
var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var _ = require('lodash');
var WillowError = require('willow-error');
var underscoreDeepExtend = require('underscore-deep-extend');
_.mixin({deepExtend: underscoreDeepExtend(_)});

var component = require('./routes/component');
var other = require('./routes/other');

module.exports = function(options) {
	if(!options.app) {
		throw new WillowError(
			'Willow components requires an options object with an app property specifying the main app component.',
			{},
			400,
			'NOAPP'
		);
	}

	options = _.deepExtend({
		componentNamespace: 'component',
		port: 3000,
		host: '127.0.0.1',
		componentDir: './components'
	}, options);

	var app = express();

	app.engine('.hbs', exphbs({
		extname: '.hbs',
		defaultLayout: 'layout',
		layoutsDir: path.join(__dirname, 'views/layouts')
	}));
	app.set('view engine', '.hbs');
	app.set('views', path.join(__dirname, 'views'));

	var componentRoute = path.join(
		'/',
		options.componentNamespace,
		':component',
		':event',
		':handler'
	);

	app.use(componentRoute, component({componentDir: options.componentDir}));
	app.get('/*', other({app: options.app}));

	// error handlers
	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
		  message: err.message,
		  error: {}
		});
	});

	http.createServer(app).listen(options.port, options.host);
};