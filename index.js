var rest = require('restify');

function response(req, res, next) {
	var timeString = req.params.timestr;
	var d;
	var ret = {};
	if (isNaN(Number(timeString))) {
		d = new Date(decodeURIComponent(timeString));
		if (!isNaN(d.getDate())) {
			ret.unix = Math.round(d.getTime() / 1000);
			ret.natural = decodeURIComponent(timeString);
		} else {
			ret.unix = null;
			ret.natural = null;
		}
	} else {
		d = new Date(Number(timeString*1000));
		ret.unix = Number(timeString);

		ret.natural = d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	res.send(ret);
	next();
}

var server = rest.createServer();

server.pre(function(req, res, next) {
	req.headers.accept = 'application/json'; // screw you client!
	return next();
});

server.get('/:timestr', response);
server.head('/:timestr', response);

server.listen(80, function() {
	console.log('%s listening at %s', server.name, server.url);
});