import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateVisitorPackagePage } from './create-visitor-package.page';

const routes: Routes = [
  {
    path: '',
    component: CreateVisitorPackagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateVisitorPackagePage]
})
export class CreateVisitorPackagePageModule {}
