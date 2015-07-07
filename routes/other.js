var WillowError = require('willow-error');
var React = require('react');
var url = require('url');
module.exports = function(options) {
	var AppComponent = options.app.build();

	return function(req, res) {

		var fullUrl = req.protocol+'://'+req.get('host')+req.url;
		var u = url.parse(fullUrl);

		res.render('index', {
			title: 'Hello world',
			body: React.renderToString(<AppComponent url={u} />).trim(),
			url: JSON.stringify(u)
		});
	};

};