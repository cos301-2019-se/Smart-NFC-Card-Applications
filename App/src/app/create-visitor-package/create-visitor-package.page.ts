/**
*	File Name:	    create-visitor-package.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      CreateVisitorPackagePage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/26	Wian		  1.0		    Original
*
*	Functional Description:   This file provides the modal to create visitor packages
*	Error Messages:   “Error”
*	Assumptions:  None
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

/**
* Purpose:	This class provides visitor package creation component
*	Usage:		This class can be used to allow an employee to create a visitor package for a client
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-create-visitor-package',
  templateUrl: './create-visitor-package.page.html',
  styleUrls: ['./create-visitor-package.page.scss'],
})
export class CreateVisitorPackagePage implements OnInit {

  currentDate: Date = new Date();
  placeholderDate: string;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { 
    this.placeholderDate = `${this.currentDate.getDate()}/${this.currentDate.getMonth()+1}/${this.currentDate.getFullYear()}`;
  }

  ngOnInit() {
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
