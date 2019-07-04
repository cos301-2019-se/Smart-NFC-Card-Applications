import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  activeTab: string = 'loginTab';

  setActive(activeTab: string) {
    this.activeTab = activeTab;
  }
}
