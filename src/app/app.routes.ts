import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
import { CreateTripComponent } from './create-trip/create-trip.component';
import { StopDetailComponent } from './trips/stop-detail/stop-detail.component';
import { LoginComponent } from './users/login/login.component';

export const routes: Routes = [
    {
        path: 'trips',
        component: TripsComponent,
    },
    {
        path: 'create-trip',
        component: CreateTripComponent,
    },
    {
        path: 'trip/:id',
        component: TripDetailComponent,
    },
    {
        path: 'location/:googlePlaceId/:tripId/:stopId',
        component: StopDetailComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
];
