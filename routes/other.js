var WillowError = require('willow-error');
var React = require('react');
var url = require('url');
var _ = require('lodash');
module.exports = function(options) {
	var AppComponent = options.app.build();

	return function(req, res) {

		var fullUrl = req.protocol+'://'+req.get('host')+req.url;
		var u = url.parse(fullUrl);

		var params = options.app.metadata(u);
		params.params = JSON.stringify(params);
		params.body = React.renderToString(<AppComponent url={u} />).trim();
		params.url = JSON.stringify(u)

		res.status(params.status || 200).render('index', params);
	};

};