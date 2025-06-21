import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'log',
        loadComponent: () =>
          import('../log/log.page').then((m) => m.LogPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'settings/export',
        loadComponent: () => import('../settings/export/export.page').then( m => m.ExportPage)
      },
      {
        path: 'settings/privacy',
        loadComponent: () => import('../settings/privacy/privacy.page').then( m => m.PrivacyPage)
      },
      {
        path: '',
        redirectTo: '/tabs/log',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/log',
    pathMatch: 'full',
  },
];
