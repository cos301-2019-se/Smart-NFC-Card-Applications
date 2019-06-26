import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVisitorPackagePage } from './create-visitor-package.page';

describe('CreateVisitorPackagePage', () => {
  let component: CreateVisitorPackagePage;
  let fixture: ComponentFixture<CreateVisitorPackagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVisitorPackagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVisitorPackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
