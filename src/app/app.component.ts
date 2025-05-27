import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DisplayRouteMapComponent } from './display-route-map/display-route-map.component';
import { PlacesSearchComponent } from './places-search/places-search.component';
import { TripsComponent } from './trips/trips.component';
import { CreateTripComponent } from './create-trip/create-trip.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
import { StopDetailComponent } from './trips/stop-detail/stop-detail.component';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DisplayRouteMapComponent, PlacesSearchComponent, RouterOutlet, RouterLink, RouterLinkActive, TripsComponent, TripDetailComponent, StopDetailComponent, NgIf, CreateTripComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {

  constructor(private router: Router) { }

  getCurrentRoute() {
    switch (this.router.url) {
      case '/trips':
        return 'Trips';
        break;
      case '/trip-details':
        return 'Trip Details';
        break;
      case '/create-trip':
        return 'Create Trip';
        break;
      default:
        return '';
    }
  }
}