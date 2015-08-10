'use strict';
var React = require('react');
var url = require('url');
module.exports = function(options) {
	var AppComponent = options.app;

	return function(req, res) {

		var fullUrl = req.protocol+'://'+req.get('host')+req.url;
		var u = url.parse(fullUrl);

		var params = {};
		params.metadata = options.app.getMetadata(u) || {};
		params.params = JSON.stringify(params);
		params.body = React.renderToString(<AppComponent url={u} />).trim();
		params.url = JSON.stringify(u);

		res.status(params.metadata.status || 200).render('index', params);
	};

};