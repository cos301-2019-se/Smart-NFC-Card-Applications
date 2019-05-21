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
 *  2019/05/20  Duncan     1.1         Fixed posting to endpoints
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

    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
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
                apiKey : "21321654adshakdha5464",
                name : "VastExpanse",
                website : "www.Google.com",
                username : "username123",
                password : "pass123",
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
            '        "id": 5\n\t' +
            '    }\n\t' +
            '}', function () {
            expect(data.body).toEqual({
                "success": true,
                "message": "VastExpanse Added! - Mock",
                "data": {
                    "id": 5
                }
            })

        });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
                apiKey : "21321654adshakdha5464",
                firstName : "Duncan",
                surname : "Vodden",
                title : "Mr",
                cellphone : "0724904274",
                email : "vastexpanse@gmail.com",
                password : "pass123",
                companyId : 5,
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
            '        "id": 10\n\t' +
            '    }\n\t' +
            '}', function () {
            expect(data.body).toEqual({
                "success": true,
                "message": "Employee Added! - Mock",
                "data": {
                    "id": 10
                }
            })
            
        });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function(done){
            var jsonDataObj = {
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
});
