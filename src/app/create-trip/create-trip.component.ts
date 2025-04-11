import { Component, inject } from '@angular/core';
import { PlacesSearchComponent } from '../places-search/places-search.component';
import { NgFor, NgIf} from '@angular/common';
import { Place } from '../place.model';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [PlacesSearchComponent, NgIf, NgFor],
  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.scss'
})
export class CreateTripComponent {
  places: Place[] = [];
  googleMapsLocation: Place | null = null;

  onPlaceSelected(event: Place) {
    this.googleMapsLocation = event;
  }

  onAddLocationToTrip() {
    if (this.googleMapsLocation) {
      this.places.push(this.googleMapsLocation);
      console.log('place', this.places);
    }
  }
}

