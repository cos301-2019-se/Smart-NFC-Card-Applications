/**
*	File Name:	    date.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      DateService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/25	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the date service to other components
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/
import { Injectable } from '@angular/core';

/**
* Purpose:	This class provides the date service injectable
*	Usage:		This class can be used to format and compare dates
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  /**
   * Function that formats the date for display
   * @param date any string or date object
   */
  displayDateFull(date){
    date = new Date(date);
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day.toString();
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month.toString();
    }
    let year = date.getFullYear();
    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours.toString();
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  /**
   * Function that formats only the date for display
   * @param date any string or date object
   */
  displayDate(date){
    date = new Date(date);
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day.toString();
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month.toString();
    }
    let year = date.getFullYear();
    return `${year}/${month}/${day}`;
  }

  /**
   * Function that formats only the time for display
   * @param date any string or date object
   */
  displayTime(date){
    date = new Date(date);
    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours.toString();
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }
    return `${hours}:${minutes}`;
  }

  /**
   * Function that formats the date for database usage
   * @param date any string or date object
   */
  databaseDate(date){
    date = new Date(date);
    return date.toString();
  }

  /**
   * Function that returns the display format
   * @return string display format
   */
  getDisplayFormat() {
    return 'YYYY/MM/DD H:mm';
  }

  /**
   * Function that returns the date picker display format
   * @return string picker format
   */
  getPickerFormat() {
    return 'YYYY MMM DD H mm';
  }
}
