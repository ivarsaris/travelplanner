import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
export const routes: Routes = [
    {
        path: 'trips',
        component: TripsComponent,
    },
    {
        path: 'trip/:id',
        component: TripDetailComponent,
    }
];
