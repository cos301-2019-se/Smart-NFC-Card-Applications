/**
 *	File Name:      test.js
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
 *	Functional Description:	This file instantiates jasmine and sets the configuration
 *                          for jasmine
 *	Error Messages:
 *	Assumptions: jasmine is installed
 *	Constraints:
 */

const Jasmine = require("jasmine");
let jasmine = new Jasmine();
jasmine.loadConfigFile('./spec/support/jasmine.json');
jasmine.execute();