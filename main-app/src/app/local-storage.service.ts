import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private storage: Storage
  ) { }

  Save(key: string, value){
    return this.storage.set(key, value);
  }

  Load(key: string){
    return this.storage.get(key);
  }
}
