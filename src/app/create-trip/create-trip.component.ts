import { Component, inject } from '@angular/core';
import { PlacesSearchComponent } from '../places-search/places-search.component';
import { NgFor, NgIf} from '@angular/common';
import { Place } from '../place.model';
import { TripStop } from '../trips/trip-stop.model';
import { Trip } from '../trips/trip.model';
import { TripsService } from '../trips/trips.service';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [PlacesSearchComponent, NgIf, NgFor],
  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.scss'
})
export class CreateTripComponent {
  places: TripStop[] = [];
  googleMapsLocation: Place | null = null;
  tripsService = inject(TripsService);
  onPlaceSelected(event: Place) {
    this.googleMapsLocation = event;
  }

  onAddLocationToTrip() {
    if (this.googleMapsLocation) {
      this.places.push({order: (this.places.length + 1).toString(), location:this.googleMapsLocation});
      console.log('place', this.places);
    }
  }

  onAddTripToTripList() {
    const trip: Trip = {
      id: '4',
      image: 'https://via.placeholder.com/150',
      title: 'Placeholder title',
      description: 'Placeholder description',
      duration: '10 days',
      stops: this.places
    }
    this.tripsService.addTripToList(trip);
  }
}

