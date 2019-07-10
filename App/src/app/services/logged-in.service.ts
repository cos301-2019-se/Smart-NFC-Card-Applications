/**
*	File Name:	    logged-in.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      LoggedInService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/10	Wian		  1.0		    Original
*
*	Functional Description:   This service is used to check if the user is logged in or not
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';

/**
* Purpose:	This class provides the logged in service injectable
*	Usage:		This class can be used to check whether or not the user is logged in
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class LoggedInService {

  private loggedIn: boolean = false;

  constructor() { }

  /**
   * Function that returns whether or not the user is logged in
   * @return boolean whether or not the user is logged in
   */
  IsLoggedIn(){
    return this.loggedIn;
  }

  /**
   * Function to set the logged in status
   * @param isLoggedIn boolean to set loggedIn to
   */
  SetLoggedIn(isLoggedIn: boolean){
    this.loggedIn = isLoggedIn;
  }
}
