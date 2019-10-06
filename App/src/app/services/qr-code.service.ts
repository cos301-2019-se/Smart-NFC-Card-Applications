/**
*	File Name:	    qr-code.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      QrCodeService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/09/05	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the qr code read and write service to other components
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Subject } from 'rxjs';
import { SharedModule } from '../shared.module';

/**
* Purpose:	This class provides the qr code service injectable
*	Usage:		This class can be used to create qr codes and read qr codes
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
    
  barcodeScannerOptions: BarcodeScannerOptions;

  /**
   * Construactor that takes all the injectables
   * @param barcodeScanner BarcodeScanner injectable
   */
  constructor(
    private barcodeScanner: BarcodeScanner
  ) {
    this.barcodeScannerOptions = {
      resultDisplayDuration: 0,
      prompt: "Place card QR code inside scan area"
    };
  }

  /**
   * Function that scans a qr code and returns the scanned data
   * @return Observable<Object> { success: boolean, message: string/data}  
   */
  scanCode(){  
    let subject = new Subject<Object>();  
    setTimeout(() => {
      this.barcodeScanner.scan(this.barcodeScannerOptions)
      .then(barcodeData => {
        subject.next({ success: true, message: barcodeData });
        subject.complete();
      })
      .catch(err => {
        subject.next({success: false, message: `Couldn't scan code: ${err.message}`});
        subject.complete();
      });
    }, SharedModule.timeoutDelay);
    return subject.asObservable();
  }

  /**
   * Function that encodes data as a qr code and return the data
   * @param data String to be encoded
   * @return Observable<Object> { success: boolean, message: string/data}  
   */
  encodeData(data: String){
    let subject = new Subject<Object>();  
    setTimeout(() => {
      this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,data).then(encodedData => {
        subject.next({ success: true, message: encodedData });
        subject.complete();
      }, (err) => {
        subject.next({success: false, message: `Couldn't encode: ${err.message}`});
        subject.complete();
      });  
    }, SharedModule.timeoutDelay);
    return subject.asObservable();               
  }
}
