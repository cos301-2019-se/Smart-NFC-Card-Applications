import { Component, ViewChild } from '@angular/core';
import { PopoverController, IonSearchbar } from '@ionic/angular';
import { PopoverMenuComponent } from '../popover-menu/popover-menu.component';
import { EventEmitterService } from '../services/event-emitter.service';   
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild('search') searchbar : IonSearchbar;

  showSearchBar: Boolean = false;
  searchFilter: string = '';

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
    private eventEmitterService: EventEmitterService,
    private filter: FilterService
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

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    this.filter.setFilter('');
  }

  updateSearch() {
    this.filter.setFilter(this.searchFilter);
  }

  focusButton() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 500);
  }
}
