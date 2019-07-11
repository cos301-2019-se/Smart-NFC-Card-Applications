import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditVisitorPackagePage } from './edit-visitor-package.page';

const routes: Routes = [
  {
    path: '',
    component: EditVisitorPackagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditVisitorPackagePage]
})
export class EditVisitorPackagePageModule {}
