import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
import { CreateTripComponent } from './create-trip/create-trip.component';
import { StopDetailComponent } from './trips/stop-detail/stop-detail.component';
import { LoginComponent } from './users/login/login.component';
import { RecommendedTripsComponent } from './trips/recommended-trips/recommended-trips.component';
import { PersonalTripsComponent } from './trips/personal-trips/personal-trips.component';
import { RegisterComponent } from './users/register/register.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UsersOverviewComponent } from './users/users-overview/users-overview.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: 'trips',
        component: TripsComponent,
    },
    {
        path: 'trips/recommended',
        component: RecommendedTripsComponent,
    },
    {
        path: 'trips/personal',
        component: PersonalTripsComponent,
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
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'account',
        component: UserDetailComponent,
    },
    {
        path: 'users',
        component: UsersOverviewComponent,
        canActivate: [adminGuard],
    },
];
