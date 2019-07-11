/**
*	File Name:	    tabs.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      TabsPage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/28	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the component that manages tabs for the app
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/
import { Component, ViewChild } from '@angular/core';
import { PopoverController, IonSearchbar } from '@ionic/angular';
import { PopoverMenuComponent } from '../popover-menu/popover-menu.component';
import { EventEmitterService } from '../services/event-emitter.service';   
import { FilterService } from '../services/filter.service';
import { LoggedInService } from '../services/logged-in.service';

/**
* Purpose:	This class provides the component that manages tabs
*	Usage:		This class is used show and change the selected tab
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild('search') searchbar : IonSearchbar;

  showSearchBar: Boolean = false;
  loggedIn: Boolean = false;
  searchFilter: string = '';

  tabButtons: Object = {
    'manage-tab': [
      {name: 'Login', requiresLogin: false},
      {name: 'Create Visitor Package', requiresLogin: true},
      {name: 'Delete Expired Packages', requiresLogin: true},
      {name: 'Logout', requiresLogin: true}
    ],
    'share-tab': [
      {name: 'Share'}
    ],
    'card-tab': [
      {name: 'Add Business Card'}
    ],
    'package-tab': [
      {name: 'Link to Package'},
      {name: 'Receive Package'}
    ]
  };
  activeTab: string = 'manage-tab'; 

  /**
   * Constructor that takes all the injectables
   * @param popoverController PopoverController Injectable
   * @param eventEmitterService EventEmitterService Injectable
   * @param filter FilterService injectable
   * @param loginService: LoggedInService
   */
  constructor(
    private popoverController: PopoverController,    
    private eventEmitterService: EventEmitterService,
    private filter: FilterService,
    private loginService: LoggedInService
  ){}

  /**
   * Function that sets the active tab parameter
   * @param activeTab string name of the active tab
   */
  setActive(activeTab: string) {
    this.activeTab = activeTab;
  }

  /**
   * Function opens menu and passes it the buttons to display
   * @param e Event that triggered the menu open
   */
  async openMenu(e) {
    this.loggedIn = this.loginService.isLoggedIn();
    let buttons: Object[] = this.tabButtons[this.activeTab];
    buttons = buttons.filter(button => {
      if (button['requiresLogin'] != undefined) {
        return this.loggedIn == button['requiresLogin'];
      }
      else {
        return true;
      }
    })
    const menu = await this.popoverController.create({
      component: PopoverMenuComponent,
      componentProps: {
        buttons: buttons
      },
      event: e,
      translucent: true
    });
    menu.present();
    menu.onDidDismiss().then(res => {
      if (res.data != undefined) {        
        this.eventEmitterService.menuButtonEvent(res.data.name);   
      }
    });
  }

  /**
   * Function toggles the search bar visibility
   */
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    this.searchFilter = '';
    this.filter.setFilter('');
  }

  /**
   * Function updates the search term
   */
  updateSearch() {
    this.filter.setFilter(this.searchFilter);
  }

  /**
   * Function sets focus to the search bar after 500ms
   */
  focusButton() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 500);
  }
}
