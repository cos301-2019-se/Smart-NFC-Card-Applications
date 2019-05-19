/**
 *	File Name:      testLogic.spec.js
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
 *	Functional Description:	This file is used to show examples on what and how tests
 *                          tests can be run.
 *	Error Messages:
 *	Assumptions: appLogic.js exists
 *	Constraints:
 */

// describe - Suites 'describe' your tests
describe('A suite is just a function', function(){
    // this - a global object shared by each spec in the suite
    // beforeEach is ran before every spec in a suite
    beforeEach(function(){
       this.a = false;
    });

    // afterEach is ran after every spec in a suite
    afterEach(function(){
       this.a = true;
    });

    // spec - defined by calling global function 'it'
    it('and so is a spec', function(){
        this.a = true;

        // expectations - expect -> actual value, matcher -> expected value
        // matchers: (all matchers has an associated '*.not.*' which matches the apposite)
        //  * toBe()
        //  * toEqual()
        //  * toMatch()
        //  * toBeDefined()
        //  * toBeNull()
        //  * toBeTruthy()
        //  * toBeFalsy()
        //  * toContain()
        //  * toThrow()
        expect(this.a).toBe(true);
    });

    // can have multiple specs in a suite
    // all variables declared in describe is global inside the suite
    it('this is the second spec', function(){
        this.a = false;

        expect(this.a).not.toBe(true);
    });

    // you can nest describes in other describes
    describe('A suite inside of the first suite', function(){
        it('spec inside of a suite inside of a suite', function(){
            expect(this.a).toBe(false);
        })
    });
});

// run tests on a class/module
// @TODO set up unit testing with a mock api
const TestLogic = require('../BackEnd/EndPoints/testLogic.js');

describe('TestLogic', function(){
    let testLogic = new TestLogic("testReq","testRes");

    it('should be defined', function(){
        expect(testLogic).toBeDefined();
    });

    describe('constructor', function(){


        it('should instantiate req', function(){
            expect(testLogic.req).toBeDefined();
        });

        it('should instantiate res', function(){
            expect(testLogic.res).toBeDefined();
        });

        it('should instantiate sharedLogic', function(){
            expect(testLogic.res).toBeDefined();
        });

        it('should instantiate body', function(){
            expect(testLogic.body).toBeDefined();
        });

        it('should instantiate endpoint', function(){
            expect(testLogic.endpoint).toBeDefined();
        });
    });

    describe('handle', function(){
        it('should call testLogic.sharedLogic.initialHandle()', function(){
            spyOn(testLogic.sharedLogic, "initialHandle");
            testLogic.handle();
            expect(testLogic.sharedLogic.initialHandle).toHaveBeenCalled();
        });
    });

    // describe('Serve', function(){
    //    it('should call endServe once business logic is handled', function(){
    //        spyOn(testLogic.sharedLogic, "endServe");
    //        testLogic.serve();
    //        expect(testLogic.sharedLogic.endServe).toHaveBeenCalled();
    //    })
    // });

    describe('getBusinessCard', function(){
        // it('should create a data object to return', function(){
        //     testLogic.getBusinessCard(1);
        //     expect(testLogic.data).toBeDefined();
        // });

        it('should call endServe after data has been retrieved', function(){
            spyOn(testLogic.sharedLogic, "endServe");
            testLogic.getBusinessCard(1);
            expect(testLogic.sharedLogic.endServe).toHaveBeenCalled();
        });
    })
});