/**
*	File Name:	    package-tab.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      PackageTabPage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*	2019/06/25	Wian		  1.1		    Added changes to allow navigation on tap of location
*	2019/06/28	Wian		  1.2		    Added functionality to add visitor packages
*	2019/08/10	Wian		  1.3		    Added functionality to gain access and pay using NFC
*
*	Functional Description:   This file provides the component that allows viewing shared cards
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { NfcControllerService } from '../services/nfc-controller.service';
import { LocationService } from '../services/location.service';
import { WifiService } from '../services/wifi.service';
import { LocationModel } from '../models/location.model';
import { VisitorPackage } from '../models/visitor-package.model';
import { VisitorPackagesService } from '../services/visitor-packages.service';
import { EventEmitterService } from '../services/event-emitter.service';   
import { FilterService } from '../services/filter.service';   
import { DateService } from '../services/date.service';
import { MessageType } from '../tabs/tabs.page';
import { AlertController } from '@ionic/angular';
import { UniqueIdService } from '../services/unique-id.service';

/**
* Purpose:	This class provides the component that allows viewing of shared cards as well as adding new ones
*	Usage:		This component can be used to view and add business cards to a locally stored list
*	@author:	Wian du Plooy
*	@version:	1.3
*/
@Component({
  selector: 'app-package-tab',
  templateUrl: 'package-tab.page.html',
  styleUrls: ['package-tab.page.scss']
})
export class PackageTabPage implements OnInit{
  packages: VisitorPackage[] = [];
  activePackages: VisitorPackage[] = [];
  inactivePackages: VisitorPackage[] = [];
  detailToggles = [];
  check;

  /**
   * Constructor that takes all injectables
   * @param nfcService NfcControllerService injectable
   * @param locationService LocationService injectable
   * @param packageService VisitorPackagesService injectable
   * @param wifiService WifiService injectable
   * @param eventEmitterService EventEmitterService injectable
   * @param filterService FilterService injectable
   * @param dateService DateService injectable
   * @param alertController AlertController injectable
   * @param uidService UniqueIdService injectable
   */
  constructor(
    private nfcService: NfcControllerService,
    private locationService: LocationService,
    private packageService: VisitorPackagesService,
    private wifiService: WifiService,
    private eventEmitterService: EventEmitterService,
    public filterService: FilterService,
    private dateService: DateService,
    private alertController: AlertController,
    private uidService: UniqueIdService,
  ) { }

  ngOnInit() {    
    this.eventEmitterService.menuSubscribe(
      this.eventEmitterService.invokeMenuButtonEvent.subscribe(functionName => {    
          this.menuEvent(functionName);
        })
    );  
    this.loadPackages();
  }

  /**
   * Function triggers when the tab is navigated to
   */
  ionViewDidEnter() {
    this.showMessage('', MessageType.reset);
    this.loadPackages();
  }

  /**
   * Function triggers when the tab is left
   */
  ionViewWillLeave(){
    // Stops the NFC if the action wasn't completed
    this.nfcService.Finish();
    clearInterval(this.check);
  }

  menuEvent(functionName: string) {
    switch(functionName) {
      case 'Link to Package': this.shareId()
        break;
      case 'Receive Package': this.addVisitorPackage()
        break;
      case 'Refresh All Packages': this.showMessage('Refresh feature coming soon.', MessageType.error);
        break;
    }
  }

  /**
   * Function that loads the visitor packages from the service or sets it to empty if it doesn't exist
   */
  loadPackages(){
    // Get cards
    this.packageService.getVisitorPackages().then((val) => {   
      let currDate = new Date();
      if (val !== null) {
        // Delete expired packages
        val = val.filter(elem => {
          return (new Date(elem.endDate)) > currDate;
        })
        this.packageService.setVisitorPackages(val).then(() => {   
          this.packages = val;
          this.setupToggles();
        }).then(() => {
          // Populate active and inactive packages
          this.activePackages = this.packages.filter(elem => {
            return this.checkInEffect(elem.startDate, elem.endDate);
          });
          this.inactivePackages = this.packages.filter(elem => {
            return !this.checkInEffect(elem.startDate, elem.endDate);
          })
        });  
      }
      else {   
        // If no packages has been saved previously     
        this.packages = [];
        this.activePackages = [];
        this.inactivePackages = [];
        this.packageService.setVisitorPackages([]);
        this.setupToggles();
      }
    });
  }

  /**
   * Sets the array to check which packages where toggled
   */
  setupToggles(){
    this.detailToggles = [];
    this.packages.forEach(card => {
      this.detailToggles[card.packageId] = false;
    });
  }

  /**
   * Function toggles the package detail
   * @param packageId number Id of visitor package to toggle
   */
  toggleDetails(packageId: number){
    this.detailToggles[packageId] = !this.detailToggles[packageId];
  }

  /**
   * Function waits for NFC to become enabled and retries adding
   */
  retry(){
    // Show NFC settings to the user
    this.nfcService.ShowSettings();
    this.check = setInterval(() => {
      this.nfcService.IsEnabled().then(() => {
        // If NFC got enabled, remove the check and try to add the card again
        clearInterval(this.check);
        this.addVisitorPackage();
      })
    }, 1500);
  }

  /**
   * Function that opens the navigator with directions from current position to destination
   * @param destination where to go to
   */
  navigate(destination){
    this.showMessage('', MessageType.reset);
    let dest = new LocationModel(destination.latitude, destination.longitude, destination.label);    
    this.showMessage(`Please wait while navigator is launched.`, MessageType.info, 5000);
    this.locationService.navigate(dest)
    .then(() => {
      this.showMessage(`Navigator launching.`, MessageType.success, 5000);
    })
    .catch( (err) => {
      this.showMessage(`Could not open launcher: ${err}`, MessageType.error, 5000);
    });
  }

  /**
   * Function that shares the device ID using NFC
   */
  public shareId(){
    this.showMessage('', MessageType.reset);
    this.showMessage(`Hold the phone against the receiving phone.`, MessageType.info, 0);
    let uid = this.uidService.getUniqueId();
    this.nfcService.SendData(uid, uid)
    .then(() => {
      this.showMessage(`Device linked to package.`, MessageType.success, 5000);
    })
    .catch((err) => {
      this.showMessage(`NFC and/or Android Beam seems to be off. Please try turing it on.`, MessageType.error, 5000);
    })
    .finally(() => {
      this.nfcService.Finish();
    });
  }

  /**
   * Function listens for an NFC Tag with the Visitor Package
   */
  public addVisitorPackage(){
    this.showMessage('', MessageType.reset);
    this.nfcService.IsEnabled()
    .then(() => {
      this.showMessage(`Hold the phone against the sharing device.`, MessageType.info, 0);
      this.nfcService.ReceiveData().subscribe(data => {
        let payload = this.nfcService.BytesToString(data.tag.ndefMessage[0].payload);    
        this.nfcService.Finish();
        let json = JSON.parse(payload.slice(3));
        this.showMessage(`Received ${json.companyName} Visitor Package.`, MessageType.success, 5000);
        let newPackage: VisitorPackage = this.packageService.createVisitorPackage(json.packageId, json.companyName, json.startDate, json.endDate, json.access,
          json.location, json.wifiSsid, json.wifiPassword, json.wifiType, json.spendingLimit, json.amountSpent);
        this.packageService.addVisitorPackage(newPackage)
        .then(() => {
          this.loadPackages();
        });
      });
    })
    .catch(() => {
      this.showMessage(`NFC seems to be off. Please try turing it on.`, MessageType.error, 5000);
    })
  }

  /**
   * Function removes a visitor package from the list
   * @param packageId number Id of visitor package to remove
   */
  async removeVisitorPackage(packageId: number){
    let visitorPackage: VisitorPackage = this.packages.find(visitorPackage => visitorPackage.packageId == packageId);
    const alert = await this.alertController.create({
      header: 'Delete Visitor Package',
      message: `Are you sure you want to <strong>delete the ${visitorPackage.companyName}</strong> package?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Delete',
          handler: () => {
            this.packageService.removeVisitorPackage(packageId)
            .then(() => {
              this.loadPackages();
              this.showMessage(`Deleted the ${visitorPackage.companyName} package`, MessageType.success);
            })
            .catch(err => {
              this.showMessage(`Couldn't delete: ${err}`, MessageType.error);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Function attempts to connect to WiFi
   * @param ssid string network name
   * @param password string network password
   * @param type string algorithm type
   */
  connectToWiFi(ssid: string, password: string, type: string){
    this.showMessage(`Attempting to connect to WiFi`, MessageType.info);
    this.wifiService.connectToWifi(ssid, password, type)
    .then(() => {
      this.showMessage('Connected to WiFi', MessageType.success, 2000);
    })
    .catch(err => {
      this.showMessage(`Could not connect to WiFi: ${err}`, MessageType.error, 5000);
    });
  }  

  /**
   * Function that formats the date for display
   * @param date any string or date object
   */
  displayDate(date: Date){
    return this.dateService.displayDateFull(date);
  }

  /**
   * Function that is used to check if a package is currently in effect
   * @param startDate Date when package takes effect
   * @param endDate Date when package expires
   * @return boolean whether or not the package is currently active
   */
  checkInEffect(startDate: Date, endDate: Date) {
    let currDate = new Date();
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    return (startDate <= currDate && endDate >= currDate);
  }

  /**
   * Function that displays a message to the user
   * @param message string message to display
   * @param type number from enum, type of message to display
   * @param timeout number after how long it should disappear (0 = don't dissappear)
   */
  showMessage(message: string, type: number, timeout: number = 5000) {
    this.eventEmitterService.messageEvent(message, type, timeout);
  }

  /**
   * Function refreshes a visitor package from db
   * @param packageId number Id of visitor package to refresh
   */
  refreshVisitorPackage(packageId: number){
    this.packageService.refreshVisitorPackage(packageId).subscribe(res => {
      if (res['success'] === true) {
        this.loadPackages();
        this.showMessage(`Successfully refreshed package`, MessageType.success);
      }
      else {
        this.showMessage(`Could not refresh package: ${res['message']}`, MessageType.error);
      }
    });
  }

  /**
   * Function checks against access control if it can unlock door
   * @param packageId number Id of visitor package to check
   */
  unlock(packageId: number){
    this.showMessage('Hold the phone against the NFC device.', MessageType.info);
    this.nfcService.SendData(packageId, `{
      "visitorPackageId": ${packageId},
      "macAddress": "${this.uidService.getUniqueId()}"
    }`)
    .catch((err) => {
      this.showMessage(`NFC and/or Android Beam seems to be off. Please try turing it on.`, MessageType.error, 5000);
    })
    .finally(() => {
      this.nfcService.Finish();
    });
  }

  /**
   * Function attempts to pay using a visitor rpackage
   * @param packageId number Id of visitor package to check
   */
  pay(packageId: number){
    this.showMessage('Hold the phone against the NFC device.', MessageType.info);
    this.nfcService.SendData(packageId, `{
      "visitorPackageId": ${packageId},
      "macAddress": "${this.uidService.getUniqueId()}"
    }`)
    .catch((err) => {
      this.showMessage(`NFC and/or Android Beam seems to be off. Please try turing it on.`, MessageType.error, 5000);
    })
    .finally(() => {
      this.nfcService.Finish();
      setTimeout(() => {
        // Refresh the visitor package after a while to get amount spent
        this.refreshVisitorPackage(packageId);
      }, 5000);
    });
  }
}
