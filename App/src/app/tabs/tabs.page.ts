/**
*	File Name:	    tabs.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      TabsPage, MessageType
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/28	Wian		  1.0		    Original
*	2019/07/28	Wian		  1.1		    Added double back press to exit app
*
*	Functional Description:   This class provides the component that manages tabs for the app
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Toast } from '@ionic-native/toast/ngx';
import { PopoverController, IonSearchbar, Platform, ToastController, LoadingController, NavController } from '@ionic/angular';
import { PopoverMenuComponent } from '../popover-menu/popover-menu.component';
import { EventEmitterService } from '../services/event-emitter.service';   
import { FilterService } from '../services/filter.service';
import { LoggedInService } from '../services/logged-in.service';
import { Subscription } from 'rxjs';

/**
* Purpose:	This enum provides message types
*	Usage:		This enum can be used to identify a type of message to display
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export enum MessageType{
    success, info, error, reset
}

/**
* Purpose:	This class provides the component that manages tabs
*	Usage:		This class is used show and change the selected tab
*	@author:	Wian du Plooy
*	@version:	1.1
*/
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy{

  @ViewChild('search') searchbar : IonSearchbar;

  showSearchBar: Boolean = false;
  loggedIn: Boolean = false;
  searchFilter: string = '';

  errorMessage: string = null;
  successMessage: string = null;
  infoMessage: string = null;

  doubleTapTimeframe: number = 3000;
  backButtonPressCount: number = 0;
  exitSubscription: Subscription;

  tabButtons: Object = {
    'manage-tab': [
      {name: 'Login', requiresLogin: false},
      {name: 'Refresh Account Details', requiresLogin: true},
      {name: 'Create Visitor Package', requiresLogin: true},
      {name: 'Delete Expired Packages', requiresLogin: true},
      {name: 'Logout', requiresLogin: true}
    ],
    'share-tab': [
      {name: 'Refresh', requiresLogin: true},
      {name: 'Share (NFC)'},
      {name: 'Share (QR Code)'}
    ],
    'card-tab': [
      {name: 'Receive Card (NFC)'},
      {name: 'Receive Card (QR Code)'},
      {name: 'Share Own Card', nav: 'share-tab'},
      {name: 'Refresh All Cards', requiresLogin: true}
    ],
    'package-tab': [
      {name: 'Link to Package'},
      {name: 'Receive Package'},
      {name: 'Create Package', nav: 'manage-tab'},
      {name: 'Refresh All Packages', requiresLogin: true}
    ]
  };
  activeTab: string = 'manage-tab'; 

  /**
   * Constructor that takes all the injectables and registers back button event
   * @param platform Platform Injectable
   * @param router NavController Injectable for changing tabs
   * @param toastController Toast Injectable
   * @param popoverController PopoverController Injectable
   * @param eventEmitterService EventEmitterService Injectable
   * @param filter FilterService injectable
   * @param loginService: LoggedInService
   */
  constructor(
    private platform: Platform,
    private router: NavController,
    private toastController: Toast,
    private popoverController: PopoverController,    
    private eventEmitterService: EventEmitterService,
    private filter: FilterService,
    private loginService: LoggedInService
  ){
    this.backButtonPressCount = 0;
    this.exitSubscription = this.platform.backButton.subscribe(() => {
      this.backButtonPressCount++;
      if (this.backButtonPressCount < 2) {
        this.toastController.show(`Tap again to exit`, this.doubleTapTimeframe.toString(), 'center');
        setTimeout(() => { this.backButtonPressCount = 0; }, this.doubleTapTimeframe);
      }
      else {
        navigator['app'].exitApp();
      }
    });
  }

  ngOnInit() {       
    this.eventEmitterService.messageSubscribe(
      this.eventEmitterService.invokeMessageEvent.subscribe(({message, type, timeout}) => { 
          this.showMessage(message, type, timeout);
        })
    );  
  }

  /**
   * Function that stops listening for the back button event when the app is being closed
   */
  ngOnDestroy(){
    this.exitSubscription.unsubscribe();
  }

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
        if (res.data.nav != undefined) {
          let tabName = Object.keys(this.tabButtons);
          this.router.navigateForward('tabs/' + res.data.nav);
          this.setActive(res.data.nav);
        }
        else {
          this.eventEmitterService.menuButtonEvent(res.data.name);   
        }
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

  /**
   * Function that displays a message to the user
   * @param message string message to display
   * @param type number from enum, type of message to display
   * @param timeout number after how long it should disappear (0 = don't dissappear)
   */
  showMessage(message: string, type: number, timeout: number = 5000) {
    this.successMessage = null;
    this.infoMessage = null;
    this.errorMessage = null;
    switch(type) {
      case MessageType.success: 
        this.successMessage = message;
        if (timeout != 0) { setTimeout(() => { this.successMessage = null;}, timeout); }
        break;
      case MessageType.info:
        this.infoMessage = message;
        if (timeout != 0) { setTimeout(() => { this.infoMessage = null;}, timeout); }
        break;
      case MessageType.error:
        this.errorMessage = message;
        if (timeout != 0) { setTimeout(() => { this.errorMessage = null;}, timeout); }
        break;
    }
  }
}
