/**
*	File Name:	        local-storage.service.ts
*	Project:		        Smart-NFC-Application
*	Orginization:	      VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	          LocalStorageService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the storage service to other components
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
* Purpose:	This class provides the storage service injectable
*	Usage:		This class can be used to save key, value pairs on the device
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private storage: Storage
  ) { }

  /**
   * Function that saves a key value pair to the device storage
   * @param key string key to identify the value by
   * @param value any value linked to the key
   * @return Promise<any> that contains info about the save
   */
  Save(key: string, value){
    return this.storage.set(key, value);
  }

  /**
   * Function that returns the value associated with a key
   * @param key string key to search for
   * @return any value
   */
  Load(key: string){
    return this.storage.get(key);
  }

  /**
   * Function that removes the value associated with a key
   * @param key string key to remove
   * @return any value
   */
  Remove(key: string){
    return this.storage.remove(key);
  }
}
