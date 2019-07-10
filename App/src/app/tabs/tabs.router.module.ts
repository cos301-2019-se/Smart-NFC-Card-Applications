import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'manage-tab',
        children: [
          {
            path: '',
            loadChildren: '../manage-tab/manage-tab.module#ManageTabPageModule'
          }
        ]
      },
      {
        path: 'share-tab',
        children: [
          {
            path: '',
            loadChildren: '../share-tab/share-tab.module#ShareTabPageModule'
          }
        ]
      },
      {
        path: 'card-tab',
        children: [
          {
            path: '',
            loadChildren: '../card-tab/card-tab.module#CardTabPageModule'
          }
        ]
      },
      {
        path: 'package-tab',
        children: [
          {
            path: '',
            loadChildren: '../package-tab/package-tab.module#PackageTabPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/manage-tab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/manage-tab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
