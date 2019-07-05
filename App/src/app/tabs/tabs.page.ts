import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverMenuComponent } from '../popover-menu/popover-menu.component';
import { EventEmitterService } from '../services/event-emitter.service';   

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  tabButtons: Object = {
    'loginTab': [
      {name: 'Login'},
      {name: 'Create Visitor Package'}
    ],
    'tab2': [
      {name: 'Share'}
    ],
    'tab3': [
      {name: 'Add Business Card'}
    ],
    'tab4': [
      {name: 'Share Device ID'},
      {name: 'Receive Package'}
    ]
  };
  activeTab: string = 'loginTab'; 

  constructor(
    private popoverController: PopoverController,    
    private eventEmitterService: EventEmitterService  
  ){}

  setActive(activeTab: string) {
    this.activeTab = activeTab;
  }

  async openMenu(e) {
    const menu = await this.popoverController.create({
      component: PopoverMenuComponent,
      componentProps: {
        buttons: this.tabButtons[this.activeTab]
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
}
