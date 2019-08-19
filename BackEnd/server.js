/**
 *	File Name:      server.js
 *	Project:        Smart-NFC-Application
 *	Organization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:	    
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/05/17	Tjaart		1.0		    Original
 *	2019/05/19	Jared		1.1			Added routing capabilities to the app and admin subsystems
										and returns errors if invalid subsystem specified
 *	2019/05/21	Duncan		1.2			Added callback functions to enable server to be run with tests
 *
 *	Functional Description:	This class is used by the (other)Logic.js files i.e. the (Other)Logic
							classes, and performs some common request data parsing, extraction, validation,
							authentication and response functions for these (Other)Logic classes.
							They include this class and make a new instance of it, allowing them to
							use the functionality defined here (hence, SHARED).
 *	Error Messages:
 *	Assumptions: This file assumes that a there exists 'AdminLogic' and 'AppLogic' classes.
 *	Constraints:
 */

const http = require('http');
const path = require('path');
const fs = require("fs");
const port=process.env.PORT || 3000;

/**
 *  This run function takes in a callback function pointer, enabling the server to be run with tests.
 *	This function extracts the first part of the url (i.e. the desired subsystem) and plugs it into a
 *	switch statement, which creates an instance of the appropriate class and calls the handle() method
 *	of the class, effectively routing the request to that class and allowing it to handle the response.
 *	If an invalid subsystem is specified, then a failure response is returned to the caller.
 *
 *  @param callback function The function to be called after the server has started that executes tests
 *	@return the created http server
*/
	
function run(callback) {
	const server = http.createServer((req, res) => {

		var urlToSwitchOn = req.url.substring(1, req.url.substring(1).indexOf("/")+1);
		switch(urlToSwitchOn)
		{
			case "test":
				var TestLogic = require('./EndPoints/testLogic.js');
				var testLogic = new TestLogic(req, res);
				testLogic.handle();
				break;

			case "app":
				console.log("url:" + req.url);
				var AppLogic = require('./EndPoints/appLogic.js');
				var appLogic = new AppLogic(req, res);
				appLogic.handle();
				break;

			case "client":
				var ClientLogic = require('./EndPoints/clientLogic.js');
				var clientLogic = new ClientLogic(req, res);
				clientLogic.handle();
				break;

			case "admin":
				console.log("url:" + req.url);
				var AdminLogic = require('./EndPoints/adminLogic.js');
				var adminLogic = new AdminLogic(req, res);
				adminLogic.handle();
				break;

			case "payment":
				var PaymentLogic = require('./EndPoints/paymentLogic.js');
				var paymentLogic = new PaymentLogic(req, res);
				paymentLogic.handle();
				break;

			case "access":
				var AccessLogic = require('./EndPoints/accessLogic.js');
				var accessLogic = new AccessLogic(req, res);
				accessLogic.handle();
				break;
				
			case "/":
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/html');
				
				if(req.url == "/")
				{
					fs.readFile("./AdminInterface/login.html", (err,fileContent) =>
					{
						res.end(fileContent);
					});
				}
				else
				{
					fs.readFile("./AdminInterface" + req.url, (err,fileContent) =>
					{
						res.end(fileContent);
					});
				}
				break;

			case "Css":
				//console.log(req.url);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/css');
				fs.readFile("./AdminInterface"+req.url, (err,fileContent) =>
				{
					res.end(fileContent);
				});
				break;

			case "Js":
				//console.log(req.url);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/javascript');
				fs.readFile("./AdminInterface"+req.url, (err,fileContent) =>
				{
					res.end(fileContent);
				});
				break;

			case "Image":
				//console.log(req.url);
				res.statusCode = 200;
				if(req.url.match("jpe") || req.url.match("jpeg") || req.url.match("jpg")){
					res.setHeader('Content-Type', 'image/jpeg');
				}
				else if(req.url.match("png")){
					res.setHeader('Content-Type', 'image/png');
				}
				fs.readFile("./AdminInterface"+req.url, (err,fileContent) =>
				{
					res.end(fileContent);
				});
				break;


			default:

				var responseObject = new Object();
				var json = null;
				responseObject.success = false;
				responseObject.message = "Invalid Endpoint "+ req.url;
				responseObject.data = {};
				json = JSON.stringify(responseObject);

				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.end(json);
		}
	});

	server.listen(port,() => {
		console.log('\nServer running at port ' + port);

		if(callback){
			callback();
		}
	});

	server.on('close', function(){
		console.log('\nServer shut down');
	});

	return server;
}

if(require.main === module){
	run();
}

exports.run = run;
