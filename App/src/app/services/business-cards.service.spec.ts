import { TestBed } from '@angular/core/testing';

import { BusinessCardsService } from './business-cards.service';
import { LocalStorageService } from './local-storage.service';
import { IonicStorageModule } from '@ionic/storage';
import { BusinessCard } from '../models/business-card.model';
import { LocationModel } from '../models/location.model';

describe('BusinessCardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot()
    ],
    providers: [
      LocalStorageService
    ]}));

  it('should be created', () => {
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    expect(service).toBeTruthy();
  });

  it('createBusinessCard should create and return a BusinessCard when valid data given', () => {    
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    let businessCard: BusinessCard = service.createBusinessCard('0_0', 'Company Name', 'Employee Name', '000 000 0000', 'email@gmail.com', 'http://website.co.za', new LocationModel(0,0,'Location'));
    expect(businessCard).toEqual(jasmine.objectContaining(service.stub));
  });

  it('setBusinessCards should clear business cards list when sent []', (done) => {
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    service.setBusinessCards([]).then(() => {
      return service.getBusinessCards()
    })
    .then(data => {
      expect(data).toEqual([]);
      done()
    })
  });

  it('addVisitorPackage add a visitor package to the list when valid data given', (done) => {
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    let date = new Date();
    service.addBusinessCard('0_0', 'Company Name', 'Employee Name', '000 000 0000', 'email@gmail.com', 'http://website.co.za', new LocationModel(0,0,'Location')).then(() => {
      return service.getBusinessCards()
    })
    .then(data => {
      expect(data[0]).toEqual(service.stub);
      done();
    })
  });

  it('removeVisitorPackage should not delete anything if the visitor package does not exist', (done) => {
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    let date = new Date();
    service.addBusinessCard('0_0', 'Company Name', 'Employee Name', '000 000 0000', 'email@gmail.com', 'http://website.co.za', new LocationModel(0,0,'Location')).then(() => {
      return service.removeBusinessCard('-1')
    })
    .then(() => {
      return service.getBusinessCards()
    })
    .then(data => {
      expect(data[0]).toEqual(service.stub);
      done();
    })
  });

  it('removeVisitorPackage should delete the visitor package if it is there to remove', (done) => {
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    let date = new Date();
    service.removeBusinessCard('0_0')
    .then(() => {
      return service.getBusinessCards()
    })
    .then(data => {
      expect(data).toEqual([]);
      done();
    })
  });
});
