import { Component, inject } from '@angular/core';
import { PlacesSearchComponent } from '../places-search/places-search.component';
import { NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [PlacesSearchComponent, NgIf, NgFor],
  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.scss'
})
export class CreateTripComponent {
  places: any[] = [];
  googleMapsLocation: any;

  onPlaceSelected(event: any) {
    this.googleMapsLocation = event;
  }

  onAddLocationToTrip() {
    this.places.push(this.googleMapsLocation);
    console.log('place', this.places);
  }
}

