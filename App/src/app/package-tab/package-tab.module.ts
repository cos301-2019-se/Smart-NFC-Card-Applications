import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PackageTabPage } from './package-tab.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: PackageTabPage }]),    
    SharedModule
  ],
  declarations: [
    PackageTabPage
  ]
})
export class PackageTabPageModule {}
