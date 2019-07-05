import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

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
