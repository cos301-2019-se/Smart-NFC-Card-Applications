/**
 *	File Name:      consoleReporter.js
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
 *	Functional Description:	This file defines the console reporter helper function
 *                          that jasmine will use to visually display the tests ran
 *                          in the console.
 *	Error Messages:
 *	Assumptions: jasmine-console-reporter is installed
 *	Constraints:
 */

const JasmineConsoleReporter = require('jasmine-console-reporter');
let jasmineConsoleReporter = new JasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    timeUnit: 'ms',
    timeThreshold: {ok: 500, warn: 1000, ouch: 3000},
    activity: true,
    emoji: true
});
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(jasmineConsoleReporter);