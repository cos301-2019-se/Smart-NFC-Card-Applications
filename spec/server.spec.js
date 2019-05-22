/**
 *	File Name:      server.spec.js
 *	Project:        Smart-NFC-Application
 *	Organization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/05/19	Tjaart		1.0		    Original
 *  2019/05/20  Duncan     	1.1         Fixed posting to endpoints
 *	2019/05/22	Jared		1.2			Added unit tests for sharedLogic and server
 *
 *	Functional Description:	This file is used to run Unit tests on the server
 *	Error Messages:
 *	Assumptions: server.js exists
 *	Constraints:
 */

const Request = require('request');
const Server = require("./../BackEnd/server");

describe('Server.js Unit Testing', function(){
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function(){
        server = Server.run();
    });

    afterAll(function(){
        server.close();
    });

    //http://localhost:3000 - {}
    describe("POST " + endpoint, function () {
        let data = {};

        beforeAll(function(done){
            Request.post(endpoint, {}, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = JSON.parse(body);
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return success = false', function(){
            expect(data.body['success']).toEqual(false);
        });

        it('should return message = \'Invalid Endpoint\'', function(){
            expect(data.body['message']).toEqual('Invalid Endpoint');
        });

        it('should return data = {}', function(){
            expect(data.body['data']).toEqual({});
        })
    });

/*
    //http://localhost:3000/test - {}
    describe("POST " + endpoint + "/test", function () {
        let data = {};

        beforeAll(function(done){
            var jsonDataObj = {}; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/test",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should return a json object', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return success = false', function(){
            expect(data.body['success']).toEqual(false);
        });

        it('should return message = \'Invalid Endpoint\'', function(){
            expect(data.body['message']).toEqual('Invalid Endpoint');
        });

        it('should return data = {}', function(){
            expect(data.body['data']).toEqual({});
        })
    });

    //http://localhost:3000/test/getBusinessCard - {}
    describe("POST " + endpoint + "/test/getBusinessCard", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {}; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/test/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should return a json object', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return success = true', function(){
            expect(data.body['success']).toEqual(false);
        });

        it('should return message = \'Invalid employeeId given\'', function(){
            expect(data.body['message']).toEqual('Invalid employeeId given');
        });

        it('should return data = {}', function(){
            expect(data.body['data']).toEqual({});
        })
    });
	
	*/
    // Duncan
    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode : true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: name, website, username, password",\n\t' +
            '    "data": {}\n\t' +
            '}', function(){
            expect(data.body).toEqual({
                "success": false,
                "message": "Missing Parameters: name, website, username, password",
                "data": {}
            });
        });
    });

    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                name : "Vast Expanse",
                website : "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                username : "piet.pompies@gmail.com",
                password : "1234",
                demoMode : true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "VastExpanse Added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
            expect(data.body).toEqual({
                "success": true,
                "message": "Vast Expanse Added! - Mock",
                "data": {
                    "companyId": 0
                }
            })

        });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                firstName : "Piet",
                surname : "Pompies",
                title : "Mr",
                cellphone : "0791637273",
                email : "piet.pompies@gmail.com",
                password : "1234",
                companyId : 0,
                demoMode : true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Employee Added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
            expect(data.body).toEqual({
                "success": true,
                "message": "Employee Added! - Mock",
                "data": {
                    "employeeId": 0
                }
            })
            
        });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode : true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: firstName, surname, title, cellphone, email, companyId, password",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual({
                "success": false,
                "message": "Missing Parameters: firstName, surname, title, cellphone, email, companyId, password",
                "data": {}
            })

        });
    });
	



	//jared
    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "No API Key or not all login details provided",
				"data": {}
			})

        });
    });


    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
				username: "jaredoreilly@gmail.com"
			}; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "No API Key or not all login details provided",
				"data": {}
			})

        });
    });


    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
				password: "CoolPassword1"
			}; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "No API Key or not all login details provided",
				"data": {}
			})

        });
    });


    describe("POST " + endpoint + "/app", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/app",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Invalid Endpoint",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "Invalid Endpoint",
				"data": {}
			})

        });
    });


    describe("POST " + endpoint + "/blahblah", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/blahblah",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Invalid Endpoint",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "Invalid Endpoint",
				"data": {}
			})

        });
    });


    describe("POST " + endpoint + "/wrong/getBusinessCard", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/wrong/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Invalid Endpoint",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "Invalid Endpoint",
				"data": {}
			})

        });
    });



    describe("POST " + endpoint + "/app/login", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
				username : "jaredoreilly@gmail.com",
				password : "1234",
				demoMode : true
			}; // no data sent
            Request.post({
                url: endpoint + "/app/login",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Login successful.",\n\t' +
            '    "data": {"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",\n\t' +
			'		"id": 0}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": true,
				"message": "Login successful.",
				"data": {
					"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
					"id": 0
				}
			})

        });
    });

    describe("POST " + endpoint + "/app/login", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
				username : "jaredoreilly@gmail.com",
				password : "WrongPassword",
				demoMode : true
			}; // no data sent
            Request.post({
                url: endpoint + "/app/login",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Incorrect username and/or password.",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "Incorrect username and/or password.",
				"data": {}
			})

        });
    });



    describe("POST " + endpoint + "/admin/login", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
				username : "piet.pompies@gmail.com",
				password : "1234",
				demoMode : true
			}; // no data sent
            Request.post({
                url: endpoint + "/admin/login",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Login successful.",\n\t' +
            '    "data": {"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",\n\t' +
			'		"id": 0}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": true,
				"message": "Login successful.",
				"data": {
					"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
					"id": 0
				}
			})

        });
    });

    describe("POST " + endpoint + "/admin/login", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
				username : "piet.pompies@gmail.com",
				password : "WrongPassword",
				demoMode : true
			}; // no data sent
            Request.post({
                url: endpoint + "/admin/login",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Incorrect username and/or password.",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual(
			{
				"success": false,
				"message": "Incorrect username and/or password.",
				"data": {}
			})

        });
    });

});

//Integration Testing
describe('Server.js Integration Testing', function(){
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function(){
        server = Server.run();
    });

    afterAll(function(){
        server.close();
    });

    // Duncan
    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: name, website, username, password",\n\t' +
            '    "data": {}\n\t' +
            '}', function(){
            expect(data.body).toEqual({
                "success": false,
                "message": "Missing Parameters: name, website, username, password",
                "data": {}
            });
        });
    });

    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                name : "Vast Expanse",
                website : "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                username : "piet.pompies@gmail.com",
                password : "1234"
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "VastExpanse Added!",\n\t' +
            '    "data": {\n\t' +
            '        "companyId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
            expect(data.body).toEqual({
                "success": true,
                "message": "Vast Expanse Added!",
                "data": {
                    "companyId": 0
                }
            })

        });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                firstName : "Piet",
                surname : "Pompies",
                title : "Mr",
                cellphone : "0791637273",
                email : "piet.pompies@gmail.com",
                password : "1234",
                companyId : 0
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Employee Added!",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
            expect(data.body).toEqual({
                "success": true,
                "message": "Employee Added!",
                "data": {
                    "employeeId": 0
                }
            })

        });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
                body: jsonDataObj,
                json: true
            }, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function(){
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function(){
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: firstName, surname, title, cellphone, email, companyId, password",\n\t' +
            '    "data": {}\n\t' +
            '}' , function () {
            expect(data.body).toEqual({
                "success": false,
                "message": "Missing Parameters: firstName, surname, title, cellphone, email, companyId, password",
                "data": {}
            })

        });
    });

});

