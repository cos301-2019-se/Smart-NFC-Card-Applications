import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NFC, Ndef, NdefRecord } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NfcControllerService {

  subscriptions: Array<Subscription> = new Array<Subscription>();
  ndefMsg: NdefRecord;

  constructor(
    private nfc: NFC, 
    private ndef: Ndef, 
    private androidPermissions: AndroidPermissions
  ) { }

  /**
   * Checks if NFC permissions has been given
   */
  CheckPermissions(){
    return this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.NFC).then(
      result => console.log('Has nfc permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.NFC)
    );
  }

  /**
   * Checks if NFC is enabled on the phone
   */
  IsEnabled(){
    return this.nfc.enabled();
  }

  /**
   * Opens the NFC settings on the phone
   */
  ShowSettings(){
    this.nfc.showSettings();
  }

  /**
   * Sets the phone's NFC as a sharable tag
   * @param id String that will be used as the id of the tag
   * @param data String that will be used as the message of the tag.
   */
  SendData(id, data){
    this.ndefMsg = this.ndef.textRecord(data, null, id);    
    return this.nfc.share([this.ndefMsg]);
  }

  /**
   * Subscribes to an NdefListener to receive data
   * @param func function of what do do when data is received
   */
  ReceiveData(){
    let listener = this.nfc.addNdefListener(nfcEvent => {});
    this.subscriptions.push(listener.subscribe());
    return listener;
  }

  /**
   * Should be called once after SendData or ReceiveData to destroy the listeners / senders
   */
  Finish(){
    this.nfc.unshare();
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Converts bytes to a string
   * @param bytes what to convert
   */
  BytesToString(bytes){
    return this.nfc.bytesToString(bytes);
  }
}
