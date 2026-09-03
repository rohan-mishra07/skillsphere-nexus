import { Routes } from '@angular/router';
import { CareerComponent } from './pages/career/career.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

export const routes: Routes = [
  { path: 'career', component: CareerComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '', redirectTo: 'analytics', pathMatch: 'full' }
];
