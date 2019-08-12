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

describe('Server.js Unit Testing', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    // Tjaart
    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true
            };
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "No API Key or not all login details provided",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0
            };
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Business card information loaded successfully - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "businessCardId": "0_0",\n\t' +
            '        "companyName": "Vast Expanse",\n\t' +
            '        "companyWebsite": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",\n\t' +
            '        "branchName": "University of Pretoria",\n\t' +
            '        "latitude": "10",\n\t' +
            '        "longitude": "11",\n\t' +
            '        "employeeName": "Tjaart",\n\t' +
            '        "employeeSurname": "Booyens",\n\t' +
            '        "employeeTitle": "Mr",\n\t' +
            '        "employeeCellphone": "0791807734",\n\t' +
            '        "employeeEmail": "u17021775@tuks.co.za"\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Business card information loaded successfully - MOCK",
                    "data": {
                        "businessCardId": "0_0",
                        "companyName": "Vast Expanse",
                        "companyWebsite": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                        "branchName": "University of Pretoria",
                        "latitude": "10",
                        "longitude": "11",
                        "employeeName": "Tjaart",
                        "employeeSurname": "Booyens",
                        "employeeTitle": "Mr",
                        "employeeCellphone": "0791807734",
                        "employeeEmail": "u17021775@tuks.co.za",
                    }
                });
            });
    });

    describe("POST " + endpoint + "/app/getEmployeeDetails", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/getEmployeeDetails",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/getEmployeeDetails", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0
            };
            Request.post({
                url: endpoint + "/app/getEmployeeDetails",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Successfully retrieved employee details - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "building": {\n\t' +
            '           "buildingId": 0,\n\t' +
            '           "latitude": "10",\n\t' +
            '           "longitude": "11",\n\t' +
            '           "branchName": "Mock Building"\n\t' +
            '        },\n\t' +
            '        "rooms": [\n\t' +
            '           {\n\t' +
            '               "roomId": 0,\n\t' +
            '               "roomName": "Mock Room",\n\t' +
            '               "parentRoomList": ""\n\t' +
            '           },\n\t' +
            '           {\n\t' +
            '               "roomId": 1,\n\t' +
            '               "roomName": "Mock Room 2",\n\t' +
            '               "parentRoomList": "0"\n\t' +
            '           }\n\t' +
            '       ],\n\t' +
            '       "wifi": {\n\t' +
            '           "wifiAccessParamsId": 0,\n\t' +
            '           "ssid": "Mock Wifi",\n\t' +
            '           "networkType": "WPA",\n\t' +
            '           "password": "MockPass"\n\t' +
            '       }\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Successfully retrieved employee details - Mock",
                    "data": {
                        "building": {
                            "buildingId": 0,
                            "latitude": "10",
                            "longitude": "11",
                            "branchName": "Mock Building"
                        },
                        "rooms": [
                            {
                                "roomId": 0,
                                "roomName": "Mock Room",
                                "parentRoomList": ""
                            },
                            {
                                "roomId": 1,
                                "roomName": "Mock Room 2",
                                "parentRoomList": "0"
                            }
                        ],
                        "wifi": {
                            "wifiAccessParamsId": 0,
                            "ssid": "Mock Wifi",
                            "networkType": "WPA",
                            "password": "MockPass"
                        }
                    }
                });
            });
    });

    describe("POST " + endpoint + "/app/addVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/addVisitorPackage",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId, startTime, endTime, macAddress, wifiAccessParamsId, roomId, limit, spent",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId, startTime, endTime, macAddress, wifiAccessParamsId, roomId, limit, spent",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/addVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                startTime: "2019-07-02 10:26:54.123",
                endTime: "2019-07-03 10:26:54.123",
                macAddress: "c4:86:e9:04:00:02",
                wifiAccessParamsId: 0,
                roomId: 0,
                limit: 100,
                spent: 0
            };
            Request.post({
                url: endpoint + "/app/addVisitorPackage",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Visitor Package created - MOCK",\n\t' +
            '    "data": {\n\t' +
            '       "visitorPackageId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Visitor Package created - MOCK",
                    "data": {
                        "visitorPackageId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/app/editVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/editVisitorPackage",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: visitorPackageId, employeeId, startTime, endTime, wifiAccessParamsId, roomId, limit",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: visitorPackageId, employeeId, startTime, endTime, wifiAccessParamsId, roomId, limit",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/editVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                visitorPackageId: 0,
                employeeId: 0,
                startTime: "2019-07-02 10:26:54.123",
                endTime: "2019-07-03 10:26:54.123",
                wifiAccessParamsId: 0,
                roomId: 0,
                limit: 100
            };
            Request.post({
                url: endpoint + "/app/editVisitorPackage",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Edited Visitor Package - MOCK",\n\t' +
            '    "data": {\n\t' +
            '       "visitorPackageId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Edited Visitor Package - MOCK",
                    "data": {
                        "visitorPackageId": 0
                    }
                });
            });
    });

    //Duncan
    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '"success": false,\n\t' +
            '"message": "Missing Parameters: companyName, companyWebsite, companyUsername, companyPassword",\n\t' +
            '"data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyName, companyWebsite, companyUsername, companyPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyName: "Vast Expanse",
                companyWebsite: "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                companyUsername: "piet.pompies@gmail.com",
                companyPassword: "1234",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
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

    describe("POST " + endpoint + "/admin/editCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editCompany",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object =\n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: companyId, companyName, companyWebsite, companyUsername",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId, companyName, companyWebsite, companyUsername",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                companyName: "Vast Expanse",
                companyWebsite: "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                companyUsername: "pet.pompies@gmail.com",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editCompany",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Vast Expanse edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Vast Expanse edited! - Mock",
                    "data": {
                        "companyId": 0
                    }
                });

            });
    });

    describe("POST " + endpoint + "/admin/deleteCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteCompany",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });

            });
    });

    describe("POST " + endpoint + "/admin/deleteCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteCompany",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Company Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Company Deleted! - Mock",
                    "data": {
                        "companyId": 0
                    }
                });

            });
    });

    describe("POST " + endpoint + "/admin/getCompanyByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getCompanyByCompanyId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });

            });
    });

    describe("POST " + endpoint + "/admin/getCompanyByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getCompanyByCompanyId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Retrieved Vast Expanse! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyName": "Vast Expanse",\n\t' +
            '        "companyWebsite": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",\n\t' +
            '        "companyId": 0,\n\t' +
            '        "username": "piet.pompies@gmail.com",\n\t' +
            '        "passwordId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Retrieved Vast Expanse! - Mock",
                    "data": {
                        "companyName": "Vast Expanse",
                        "companyWebsite": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                        "companyId": 0,
                        "username": "piet.pompies@gmail.com",
                        "passwordId": 0
                    }
                });

            });
    });

    describe("POST " + endpoint + "/admin/getCompanies", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getCompanies",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Successfully Retrieved - Mock!",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "companyId": 0,\n\t' +
            '            "companyName": "Comp1",\n\t' +
            '            "companyWebsite": "www.Comp1.com",\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "comp1"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "companyId": 1,\n\t' +
            '            "companyName": "Comp2",\n\t' +
            '            "companyWebsite": "www.Comp2.com",\n\t' +
            '            "passwordId": 1,\n\t' +
            '            "username": "comp2"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Successfully Retrieved - Mock!",
                    "data": [
                        {
                            "companyId": 0,
                            "companyName": "Comp1",
                            "companyWebsite": "www.Comp1.com",
                            "passwordId": 0,
                            "username": "comp1"
                        },
                        {
                            "companyId": 1,
                            "companyName": "Comp2",
                            "companyWebsite": "www.Comp2.com",
                            "passwordId": 1,
                            "username": "comp2"
                        }
                    ]
                });

            });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeName: "Duncan",
                employeeSurname: "Vodden",
                employeeTitle: "Mr",
                employeeCellphone: "0791637273",
                employeeEmail: "duan@gmail.com",
                employeePassword: "1234",
                companyId: 0,
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, companyId, buildingId, employeePassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, companyId, buildingId, employeePassword",
                    "data": {}
                })

            });
    });

    describe("POST " + endpoint + "/admin/editEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editEmployee",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId, employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, username, buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId, employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, username, buildingId",
                    "data": {}
                })

            });
    });

    describe("POST " + endpoint + "/admin/editEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                employeeName: "Piet",
                employeeSurname: "Pompies",
                employeeTitle: "Mr",
                employeeCellphone: "0791637273",
                employeeEmail: "peat.pompies@gmail.com",
                username: "Duncan",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editEmployee",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Employee edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employee edited! - Mock",
                    "data": {
                        "employeeId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteEmployee",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteEmployee",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "employeeId Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "employeeId Deleted! - Mock",
                    "data": {
                        "employeeId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeeByEmployeeId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeeByEmployeeId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeeByEmployeeId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeeByEmployeeId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Employee Retrieved! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0,\n\t' +
            '        "firstName": "Piet",\n\t' +
            '        "surname": "Pompies",\n\t' +
            '        "title": "Mr",\n\t' +
            '        "cellphone": "0791637273",\n\t' +
            '        "email": "piet.pompies@gmail.com",\n\t' +
            '        "companyId": 0,\n\t' +
            '        "buildingId": 0,\n\t' +
            '        "passwordId": 0\n\t' +
            '        "username": "piet12"\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employee Retrieved! - Mock",
                    "data": {
                        "employeeId": 0,
                        "firstName": "Piet",
                        "surname": "Pompies",
                        "title": "Mr",
                        "cellphone": "0791637273",
                        "email": "piet.pompies@gmail.com",
                        "companyId": 0,
                        "buildingId": 0,
                        "passwordId": 0,
                        "username": "piet12"
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByCompanyId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByCompanyId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Employees Retrieved!- Mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "employeeId": 0,\n\t' +
            '            "firstName": "Duncan",\n\t' +
            '            "surname": "Vodden",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0724904115",\n\t' +
            '            "email": "duncan@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "dunc1"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "employeeId": 1,\n\t' +
            '            "firstName": "Piet",\n\t' +
            '            "surname": "Pompies",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0791637273",\n\t' +
            '            "email": "piet.pompies@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "dunc2"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employees Retrieved!- Mock",
                    "data": [
                        {
                            "employeeId": 0,
                            "firstName": "Duncan",
                            "surname": "Vodden",
                            "title": "Mr",
                            "cellphone": "0724904115",
                            "email": "duncan@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 0,
                            "username": "dunc1"
                        },
                        {
                            "employeeId": 1,
                            "firstName": "Piet",
                            "surname": "Pompies",
                            "title": "Mr",
                            "cellphone": "0791637273",
                            "email": "piet.pompies@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 0,
                            "username": "dunc2"
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByBuildingId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByBuildingId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Employees Retrieved!- Mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "employeeId": 0,\n\t' +
            '            "firstName": "Duncan",\n\t' +
            '            "surname": "Vodden",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0724904115",\n\t' +
            '            "email": "duncan@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "dunc1"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "employeeId": 1,\n\t' +
            '            "firstName": "Piet",\n\t' +
            '            "surname": "Pompies",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0791637273",\n\t' +
            '            "email": "piet.pompies@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 1,\n\t' +
            '            "username": "dunc2"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employees Retrieved!- Mock",
                    "data": [
                        {
                            "employeeId": 0,
                            "firstName": "Duncan",
                            "surname": "Vodden",
                            "title": "Mr",
                            "cellphone": "0724904115",
                            "email": "duncan@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 0,
                            "username": "dunc1"
                        },
                        {
                            "employeeId": 1,
                            "firstName": "Piet",
                            "surname": "Pompies",
                            "title": "Mr",
                            "cellphone": "0791637273",
                            "email": "piet.pompies@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 1,
                            "username": "dunc2"
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/addBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addBuilding",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: buildingBranchName, buildingLatitude, buildingLongitude, companyId, networkSsid, networkType, networkPassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingBranchName, buildingLatitude, buildingLongitude, companyId, networkSsid, networkType, networkPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/addBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingBranchName: "Vast Expanse PTA",
                buildingLatitude: "201250",
                buildingLongitude: "201250",
                companyId: 0,
                networkSsid: "Vast Expanse Guests",
                networkType: "TYPE",
                networkPassword: "1234",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addBuilding",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Building added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building added! - Mock",
                    "data": {
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/editBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editBuilding",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: buildingId, buildingBranchName, buildingLatitude, buildingLongitude",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId, buildingBranchName, buildingLatitude, buildingLongitude",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                buildingBranchName: "Vast Expanse JHB",
                buildingLatitude: "201250",
                buildingLongitude: "201251",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editBuilding",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Building edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building edited! - Mock",
                    "data": {
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteBuilding",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteBuilding",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Building Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building Deleted! - Mock",
                    "data": {
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingByBuildingId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingByBuildingId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Retrieved Building! - mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0,\n\t' +
            '        "latitude": "20,120,10",\n\t' +
            '        "longitude": "20,120,10",\n\t' +
            '        "branchName": "Vast Expanse JHB",\n\t' +
            '        "companyId": 0,\n\t' +
            '        "wifiParamsId": 0,\n\t' +
            '        "networkSsid": "SSID",\n\t' +
            '        "networkType": "TYPE",\n\t' +
            '        "networkPassword": "PASS123"\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Retrieved Building! - mock",
                    "data": {
                        "buildingId": 0,
                        "latitude": "20,120,10",
                        "longitude": "20,120,10",
                        "branchName": "Vast Expanse JHB",
                        "companyId": 0,
                        "wifiParamsId": 0,
                        "networkSsid": "SSID",
                        "networkType": "TYPE",
                        "networkPassword": "PASS123"
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingsByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingsByCompanyId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingsByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingsByCompanyId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Retrieved Building! - mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "buildingLatitude": "20,120,10",\n\t' +
            '            "buildingLongitude": "20,120,10",\n\t' +
            '            "buildingBranchName": "Vast Expanse JHB",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "wifiParamsId": 0,\n\t' +
            '            "networkSsid": "Vast Expanse Guests",\n\t' +
            '            "networkType": "TYPE",\n\t' +
            '            "networkPassword": "1234"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "buildingId": 1,\n\t' +
            '            "buildingLatitude": "20,120,10",\n\t' +
            '            "buildingLongitude": "20,120,10",\n\t' +
            '            "buildingBranchName": "Vast Expanse PTA",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "wifiParamsId": 1,\n\t' +
            '            "networkSsid": "Vast Expanse Guests",\n\t' +
            '            "networkType": "TYPE",\n\t' +
            '            "networkPassword": "1234"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Retrieved Building! - mock",
                    "data": [
                        {
                            "buildingId": 0,
                            "buildingLatitude": "20,120,10",
                            "buildingLongitude": "20,120,10",
                            "buildingBranchName": "Vast Expanse JHB",
                            "companyId": 0,
                            "wifiParamsId": 0,
                            "networkSsid": "Vast Expanse Guests",
                            "networkType": "TYPE",
                            "networkPassword": "1234"
                        },
                        {
                            "buildingId": 1,
                            "buildingLatitude": "20,120,10",
                            "buildingLongitude": "20,120,10",
                            "buildingBranchName": "Vast Expanse PTA",
                            "companyId": 0,
                            "wifiParamsId": 1,
                            "networkSsid": "Vast Expanse Guests",
                            "networkType": "TYPE",
                            "networkPassword": "1234"
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/addRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addRoom",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: roomName, parentRoomList, buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomName, parentRoomList, buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/addRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomName: "New York",
                parentRoomList: "1,2",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addRoom",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Room added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Room added! - Mock",
                    "data": {
                        "roomId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/editRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editRoom",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: roomId, roomName, parentRoomList",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId, roomName, parentRoomList",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomId: 0,
                roomName: "Kansas",
                parentRoomList: "2,3",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editRoom",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Room edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Room edited! - Mock",
                    "data": {
                        "roomId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteRoom",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: roomId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteRoom",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Building Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building Deleted! - Mock",
                    "data": {
                        "roomId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomByRoomId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomByRoomId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: roomId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomByRoomId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomByRoomId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Room Retrieved!- Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0,\n\t' +
            '        "roomName": "Houston",\n\t' +
            '        "parentRoomList": "0,1",\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Room Retrieved!- Mock",
                    "data": {
                        "roomId": 0,
                        "roomName": "Houston",
                        "parentRoomList": "0,1",
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomsByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomsByBuildingId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomsByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomsByBuildingId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Rooms Retrieved!- Mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "roomId": 2,\n\t' +
            '            "roomName": "Houston",\n\t' +
            '            "parentRoomList": "0,1",\n\t' +
            '            "buildingId": 0\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "roomId": 3,\n\t' +
            '            "roomName": "Houston",\n\t' +
            '            "parentRoomList": "0,1,2",\n\t' +
            '            "buildingId": 0\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Rooms Retrieved!- Mock",
                    "data": [
                        {
                            "roomId": 2,
                            "roomName": "Houston",
                            "parentRoomList": "0,1",
                            "buildingId": 0
                        },
                        {
                            "roomId": 3,
                            "roomName": "Houston",
                            "parentRoomList": "0,1,2",
                            "buildingId": 0
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/editPassword", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editPassword",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: oldPassword, newPassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: oldPassword, newPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editPassword", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                oldPassword: "5678",
                newPassword: "1234",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editPassword",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Password Successfully changed!",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Password Successfully changed!",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editWifiParam", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editWifiParam",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: wifiParamsId, networkSsid, networkType, networkPassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: wifiParamsId, networkSsid, networkType, networkPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editWifiParam", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                wifiParamsId: 0,
                networkSsid: "VE guests",
                networkType: "TYPEY",
                networkPassword: "hello",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editWifiParam",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "WiFi edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "wifiParamsId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "WiFi edited! - Mock",
                    "data": {
                        "wifiParamsId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/access/getAccess", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                roomId: 0,
                visitorPackageId: 0,
                macAddress: "macAddress",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/access/getAccess",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": " Access Allowed ! - Mock",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": " Access Allowed ! - Mock",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/access/getAccess", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/access/getAccess",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: roomId, visitorPackageId, macAddress",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId, visitorPackageId, macAddress",
                    "data": {}
                });
            });
    });
    //jared
    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "jaredoreilly@gmail.com"
            }; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                password: "CoolPassword1"
            }; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/app",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = text/html', function () {
            expect(data.contentType).toEqual('text/html');
        });

        it('should return undefined' +
            '}', function () {
                expect(data.body).toEqual(
                    undefined)

            });
    });

    describe("POST " + endpoint + "/blahblah", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/blahblah",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = text/html', function () {
            expect(data.contentType).toEqual('text/html');
        });

        it('should return undefined' +
            '}', function () {
                expect(data.body).toEqual(
                    undefined)

            });
    });

    describe("POST " + endpoint + "/wrong/getBusinessCard", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {}; // no data sent
            Request.post({
                url: endpoint + "/wrong/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Invalid Endpoint",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual(
                    {
                        "success": false,
                        "message": "Invalid Endpoint /wrong/getBusinessCard",
                        "data": {}
                    })

            });
    });

    describe("POST " + endpoint + "/app/login", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.coms",
                password: "1234",
                demoMode: true
            }; // no data sent
            Request.post({
                url: endpoint + "/app/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Login successful.",\n\t' +
            '    "data": {"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",\n\t' +
            '		"id": 0}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.com",
                password: "WrongPassword",
                demoMode: true
            }; // no data sent
            Request.post({
                url: endpoint + "/app/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Incorrect username and/or password.",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.com",
                password: "1234",
                demoMode: true
            }; // no data sent
            Request.post({
                url: endpoint + "/admin/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Login successful.",\n\t' +
            '    "data": {"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",\n\t' +
            '		"id": 0}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.com",
                password: "WrongPassword",
                demoMode: true
            }; // no data sent
            Request.post({
                url: endpoint + "/admin/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Incorrect username and/or password.",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual(
                    {
                        "success": false,
                        "message": "Incorrect username and/or password.",
                        "data": {}
                    })

            });
    });

    //Demo mode Unit test for make payment
    describe("POST " + endpoint + "/payment/makePayment", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                nfcPaymentPointId: 2,
                visitorPackageId: 1,
                amount: 9.5,
                macAddress: "AA-BB-CC-DD-EE-FF",
                description: "My payment!",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/payment/makePayment",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it(`should return a json object: {
            "success": true,
            "message": "Demo Transaction successful",
            "data": {
                "transactionId": 0
            }
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Demo Transaction successful",
                    "data": {
                        "transactionId": 0
                    }
                });
            });
    });

    //Invalid mac address for make payment
    describe("POST " + endpoint + "/payment/makePayment", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                nfcPaymentPointId: 2,
                visitorPackageId: 1,
                amount: 9.5,
                description: "My payment!"
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/payment/makePayment",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it(`should return a json object: {
            "success": false,
            "message": "No valid Mac Address provided",
            "data": {}
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "No valid Mac Address provided",
                    "data": {}
                });
            });
    });

    //Invalid amount for make payment
    describe("POST " + endpoint + "/payment/makePayment", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                nfcPaymentPointId: 2,
                visitorPackageId: 1,
                amount: -500,
                macAddress: "AA-bb-CC-DD-EE-FF",
                description: "My payment!"
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/payment/makePayment",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it(`should return a json object: {
            "success": false,
            "message": "Negative payments or payments of zero credits are not allowed (payment amount must be positive)",
            "data": {}
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Negative payments or payments of zero credits are not allowed (payment amount must be positive)",
                    "data": {}
                });
            });
    });

    //Get all transactions demo mode test
    describe("POST " + endpoint + "/admin/getAllTransactionsByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                "companyId": 3,
                "apiKey": "apikey",
                "endDate": "2019-07-21 22:00:00",
                "employeeUsername": "test",
                "demoMode": true

            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getAllTransactionsByCompanyId",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it(`should return a json object: {
            "success": true,
            "message": "Demo Mode Transactions Fetched",
            "data": [
                {
                    "employeeName": "DemoName",
                    "employeeSurname": "DemoSurname",
                    "employeeEmail": "demo@gmail.com",
                    "amountSpent": 50,
                    "paymentDesc": "",
                    "paymentPointDesc": "New desc",
                    "transactiontime": "2019-07-21T19:15:18.028Z"
                }
            ]
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Demo Mode Transactions Fetched",
                    "data": [
                        {
                            "employeeName": "DemoName",
                            "employeeSurname": "DemoSurname",
                            "employeeEmail": "demo@gmail.com",
                            "amountSpent": 50,
                            "paymentDesc": "",
                            "paymentPointDesc": "New desc",
                            "transactiontime": "2019-07-21T19:15:18.028Z"
                        }
                    ]
                });
            });
    });



	/*
    // Unit Tests for CrudController
    describe("Crud Controller - getEmployee correct ID", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getEmployee(0);
            done();
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Employee Retrieval Successful",\n\t' +
            '    "data": { employeeId: 0,\n\t' +
            '	 employeeTitle: \'Mr\',\n\t' +
            '	 employeeName: \'Piet\',\n\t' +
            '	 employeeSurname: \'Pompies\',\n\t' +
            '	 employeeEmail: \'piet.pompies@gmail.com\',\n\t' +
            '	 employeeCellphone: \'0791637273\',\n\t' +
            '	 companyId: 0,\n\t' +
            '	 passwordId: 0 \n\t' +
            '	} \n\t' +
            '}', function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Employee Retrieval Successful',
                        data:
                        {
                            employeeId: 0,
                            employeeTitle: 'Mr',
                            employeeName: 'Piet',
                            employeeSurname: 'Pompies',
                            employeeEmail: 'piet.pompies@gmail.com',
                            employeeCellphone: '0791637273',
                            companyId: 0,
                            passwordId: 0
                        }
                    })

            });
    });

    describe("Crud Controller - getEmployee correct username", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getEmployee("vast.exanse@gmail.com");
            console.log(result);
            done();
        });

        it(`should return a json object (expects email)
        { success: true,
            message: 'Employee Retrieval Successful',
            data:
             { employeeId: 0,
               employeeTitle: 'Mr',
               employeeName: 'Piet',
               employeeSurname: 'Pompies',
               employeeEmail: 'piet.pompies@gmail.com',
               employeeCellphone: '0791637273',
               companyId: 0,
               passwordId: 0 }
             }`, function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Employee Retrieval Successful',
                        data:
                        {
                            employeeId: 0,
                            employeeTitle: 'Mr',
                            employeeName: 'Piet',
                            employeeSurname: 'Pompies',
                            employeeEmail: 'piet.pompies@gmail.com',
                            employeeCellphone: '0791637273',
                            companyId: 0,
                            passwordId: 0
                        }
                    })
            });
    });

    describe("Crud Controller - getEmployee incorrect username", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getEmployee("fake.mail");
            console.log(result);
            done();
        });

        it(`should return a json object
        { success: false,
            message: 'Employee ID Does Not Exist',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Employee ID Does Not Exist',
                        data: null
                    })
            });
    });

    describe("Crud Controller - getEmployee incorrect ID", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getEmployee(123);
            done();
        });

        it(`should return a json object
            {  success: false,
               message: 'Employee ID Does Not Exist',
               data: null
            }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Employee ID Does Not Exist',
                        data: null
                    })
            });
    });

    describe("Crud Controller - getCompany correct ID", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getCompany(123);
            done();
        });

        it(`should return a json object
            {  success: false,
               message: 'Company ID Does Not Exist',
               data: null
            }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Company ID Does Not Exist',
                        data: null
                    })
            });
    });

    describe("Crud Controller - getCompany correct username", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getCompany("Vast Expanse 19");
            done();
        });

        it(`should return a json object
            {   success: true,
                message: 'Company Retrieval Successful',
                data:
                    {   companyId: 0,
                        companyName: 'Vast Expanse',
                        website: 'https://github.com/cos301-2019-se/Smart-NFC-Card-Applications',
                        passwordId: 0
                    }
             }`, function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Company Retrieval Successful',
                        data:
                        {
                            companyId: 0,
                            companyName: 'Vast Expanse',
                            website: 'https://github.com/cos301-2019-se/Smart-NFC-Card-Applications',
                            passwordId: 0
                        }
                    })
            });
    });

    describe("Crud Controller - getCompany incorrect ID", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getCompany(1);
            done();
        });

        it(`should return a json object
        {
            success: false,
            message: 'Company ID Does Not Exist',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Company ID Does Not Exist',
                        data: null
                    })
            });
    });

    //should modify after overload fix
    describe("Crud Controller - getCompany incorrect Company parameter", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getCompany(" "); //space
            done();
        });

        it(`should return a json object
        {
            success: false,
            message: 'Invalid Company Parameters Provided',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Invalid Company Parameters Provided',
                        data: null
                    })
            });
    });

    describe("Crud Controller - getCompany incorrect Company parameter", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getCompany(" "); //space
            done();
        });

        it(`should return a json object
        {
            success: false,
            message: 'Invalid Company Parameters Provided',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Invalid Company Parameters Provided',
                        data: null
                    })
            });
    });

    describe("Crud Controller - getPassword correct ID", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getPassword(0);
            done();
        });

        it(`should return a json object
        { success: true,
            message: 'Password Retrieval Successful',
            data:
             { passwordId: 0,
               username: 'piet.pompies@gmail.com',
               passwordHash:
                'b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7',
               salt: '40qY4HyU',
               apiKey: 'lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^',
               expiryDate: '9999-99-99'
            }
        }`, function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Password Retrieval Successful',
                        data:
                        {
                            passwordId: 0,
                            username: 'piet.pompies@gmail.com',
                            passwordHash:
                                'b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7',
                            salt: '40qY4HyU',
                            apiKey: 'lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^',
                            expiryDate: '9999-99-99'
                        }
                    })
            });
    });

    describe("Crud Controller - getPassword correct API Key", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getPassword("lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"); //hardcoded key for now
            done();
        });

        it(`should return a json object
        { success: true,
            message: 'Password Retrieval Successful',
            data:
             { passwordId: 0,
               username: 'piet.pompies@gmail.com',
               passwordHash:
                'b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7',
               salt: '40qY4HyU',
               apiKey: 'lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^',
               expiryDate: '9999-99-99'
            }
        }`, function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Password Retrieval Successful',
                        data:
                        {
                            passwordId: 0,
                            username: 'piet.pompies@gmail.com',
                            passwordHash:
                                'b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7',
                            salt: '40qY4HyU',
                            apiKey: 'lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^',
                            expiryDate: '9999-99-99'
                        }
                    })
            });
    });

    describe("Crud Controller - getPassword incorrect API Key", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getPassword("l!LZx6jzvf5wP^"); //hardcoded key for now
            done();
        });

        it(`should return a json object
        { success: false,
            message: 'Password API Key Does Not Exist',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Password API Key Does Not Exist',
                        data: null
                    })
            });
    });

    describe("Crud Controller - getPassword incorrect ID", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.getPassword(1);
            done();
        });

        it(`should return a json object
        { success: false,
            message: 'Password ID Does Not Exist',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Password ID Does Not Exist',
                        data: null
                    })
            });
    });

    describe("Crud Controller - createCompany correct parameters", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.createCompany("Vast", "www.vast.expanse.com", 0);
            done();
        });

        it(`should return a json object
        { success: true,
            message: 'Company Creation Successful',
            data: { companyId: 0 }
        }`, function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Company Creation Successful',
                        data: { companyId: 0 }
                    })
            });
    });

    describe("Crud Controller - createCompany incorrect parameters", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.createCompany("Vast", "notawebsite.", 0);
            done();
        });

        it(`should return a json object
        { success: false,
            message: 'Invalid Company Details Provided',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Invalid Company Details Provided',
                        data: null
                    })
            });
    });

    describe("Crud Controller - createEmployee valid parameters", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.createEmployee("name", "surname", "Mr", "0789887673", "vast.expanse@gmail.com", 0, 0);
            console.log(result)
            done();
        });

        it(`should return a json object
        { success: true,
            message: 'Successfully Created Employee',
            data: { employeeId: 0 }
        }`, function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Successfully Created Employee',
                        data: { employeeId: 0 }
                    })
            });
    });

    describe("Crud Controller - createEmployee invalid parameters", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.createEmployee("name", "234", "Mr", "44", "vast.expanse.gmail.com", 0, 0);
            console.log(result)
            done();
        });

        it(`should return a json object
        { success: false,
            message: 'Invalid Employee Information Provided',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Invalid Employee Information Provided',
                        data: null
                    })
            });
    });

    describe("Crud Controller - createPassword valid parameters", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.createPassword("vast", "p@ssW0rd");
            console.log(result)
            done();
        });

        it(`should return a json object
        { success: true,
            message: 'Password Creation Successful',
            data: { passwordId: 0 }
        }`, function () {
                expect(result).toEqual(
                    {
                        success: true,
                        message: 'Password Creation Successful',
                        data: { passwordId: 0 }
                    })
            });
    });

    describe("Crud Controller - createPassword invalid parameters", function () {
        let result = new Object();
        beforeAll(function (done) {
            var CrudController = require("./../BackEnd/CrudController/crudController.js");
            var crudController = new CrudController();
            result = crudController.createPassword("", "p@ssW0rd");
            console.log(result)
            done();
        });

        it(`should return a json object
        { success: false,
            message: 'Invalid Password Information Provided',
            data: null
        }`, function () {
                expect(result).toEqual(
                    {
                        success: false,
                        message: 'Invalid Password Information Provided',
                        data: null
                    })
            });
    });
	*/

});

/*

//Integration Testing
describe('Server.js Integration Testing', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    //Tjaart
    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0
            }; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Business card information loaded successfully",\n\t' +
            '    "data": {\n\t' +
            '        "employeeTitle": "Mr",\n\t' +
            '        "employeeName": "Piet",\n\t' +
            '        "employeeSurname": "Pompies",\n\t' +
            '        "employeeCellphone": "0791637273",\n\t' +
            '        "employeeEmail": "piet.pompies@gmail.com",\n\t' +
            '        "companyName": "Vast Expanse",\n\t' +
            '        "website": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications"\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Business card information loaded successfully",
                    "data": {
                        "employeeTitle": "Mr",
                        "employeeName": "Piet",
                        "employeeSurname": "Pompies",
                        "employeeCellphone": "0791637273",
                        "employeeEmail": "piet.pompies@gmail.com",
                        "companyName": "Vast Expanse",
                        "website": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications"
                    }
                });
            });
    });

    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 1
            }; // no data sent
            Request.post({
                url: endpoint + "/app/getBusinessCard",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Employee ID Does Not Exist",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Employee ID Does Not Exist",
                    "data": {}
                });
            });
    });


	/*
    // Jared
    describe("POST " + endpoint + "/app/login", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.com",
                password: "1234"
            }; // no data sent
            Request.post({
                url: endpoint + "/app/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Login successful.",\n\t' +
            '    "data": {"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",\n\t' +
            '		"id": 0}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.com",
                password: "WrongPassword"
            }; // no data sent
            Request.post({
                url: endpoint + "/app/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Incorrect username and/or password.",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.com",
                password: "1234"
            }; // no data sent
            Request.post({
                url: endpoint + "/admin/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Login successful.",\n\t' +
            '    "data": {"apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",\n\t' +
            '		"id": 0}\n\t' +
            '}', function () {
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
        beforeAll(function (done) {
            var jsonDataObj = {
                username: "piet.pompies@gmail.com",
                password: "WrongPassword"
            }; // no data sent
            Request.post({
                url: endpoint + "/admin/login",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Incorrect username and/or password.",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual(
                    {
                        "success": false,
                        "message": "Incorrect username and/or password.",
                        "data": {}
                    })

            });
    });

});
*/
