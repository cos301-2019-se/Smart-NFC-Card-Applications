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
 *
 *	Functional Description:	This file is used to run Unit tests on the server
 *	Error Messages:
 *	Assumptions: server.js exists
 *	Constraints:
 */

const Request = require('request');
const Server = require("./../BackEnd/server");

describe('Server.js', function(){
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

    //http://localhost:3000/test - {}
    describe("POST " + endpoint + "/test", function () {
        let data = {};

        beforeAll(function(done){
            Request.post(endpoint + "/test", {}, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = JSON.parse(body);
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
        let data = {};

        beforeAll(function(done){
            Request.post(endpoint + "/test/getBusinessCard", {employeeId: 1}, function(error, response, body){
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = JSON.parse(body);
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
});