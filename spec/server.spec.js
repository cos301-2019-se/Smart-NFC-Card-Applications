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
