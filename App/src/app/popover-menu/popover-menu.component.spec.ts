import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverMenuComponent } from './popover-menu.component';
import { PopoverController, AngularDelegate, NavParams } from '@ionic/angular';

export class NavParamsMocks{
  data = {
  };

  get(param){
    return this.data[param];
  }
}

describe('PopoverMenuComponent', () => {
  let component: PopoverMenuComponent;
  let fixture: ComponentFixture<PopoverMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        PopoverMenuComponent
      ],
      providers: [
        PopoverController,
        AngularDelegate,
        {provide: NavParams, useClass: NavParamsMocks},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
