/**
*	File Name:	        business-card.model.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	    VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	        BusinessCard
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the business card model
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

/**
*   Purpose:	This class provides the BusinessCard model
*	Usage:		This class can be used to generate business card objects
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export class BusinessCard {
    companyId: number;
    companyName: string;
    employeeName: string;
    contactNumber: string;
    email: string;
    website: string;
    location: string;
}