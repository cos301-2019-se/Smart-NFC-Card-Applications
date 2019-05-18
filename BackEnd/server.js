// test application to test heroku

const http = require('http');
const port=process.env.PORT || 3000;

const server = http.createServer((req, res) => {

	//routes the url to the correct subsystem
	//looks at the first part (e.g. /app/endPoint1 would be app) and routes it based on that
	//also returns an error page with 404 if not a valid first part and second part not included
	var urlToSwitchOn = req.url.substring(1, req.url.substring(1).indexOf("/")+1);
	switch(urlToSwitchOn)
	{
		case "test":
			var TestLogic = require('./EndPoints/testLogic.js');
			var testLogic = new TestLogic(req, res);
			testLogic.handle();
			break;
			
		case "app":
			var AppLogic = require('./EndPoints/appLogic.js');
			var appLogic = new AppLogic(req, res);
			appLogic.handle();
			break;
			
		case "admin":
			var AdminLogic = require('./EndPoints/adminLogic.js');
			var adminLogic = new AdminLogic(req, res);
			adminLogic.handle();
			break;
			
		default:
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/html');
			res.end('<h1>The endpoint you are requesting does not exist.</h1>');
	}
	
});

server.listen(port,() => {
    console.log(`Server running at port `+port);
});