var WillowError = require('willow-error');
module.exports = function(req, res) {
	(new WillowError(
		'Not found',
		{},
		404
	)).send(res);
};