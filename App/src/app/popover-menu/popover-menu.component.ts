/**
*	File Name:	    popover-menu.component.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      ManageTabPage
*	Related documents:	PopoverMenuComponent
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/10	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the popover menu component
*	Error Messages:   “Error”
*	Assumptions:  None
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

/**
* Purpose:	This class provides the popover menu component
*	Usage:		This class is used as a template for a popup menu given custom buttons
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-popover-menu',
  templateUrl: './popover-menu.component.html',
  styleUrls: ['./popover-menu.component.scss'],
})
export class PopoverMenuComponent implements OnInit {

  items: Object[];

  constructor(
    private popoverController: PopoverController,
    private navParams: NavParams
  ) { 
    this.items = navParams.data.buttons;
  }

  ngOnInit() {}

  itemClick(item){
    this.popoverController.dismiss(item)
  }

}
