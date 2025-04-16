import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
  @ViewChild('durationInput') durationInput!: ElementRef;
  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;


  onPlaceSelected(event: Place) {
    this.googleMapsLocation = event;
  }

  onAddLocationToTrip() {
    if (this.googleMapsLocation) {
      this.places.push({order: (this.places.length + 1).toString(), duration: this.durationInput.nativeElement.value, location:this.googleMapsLocation});
      console.log('place', this.places);
    }
  }

  onAddTripToTripList() {
    const trip: Trip = {
      id: '4',
      image: 'https://via.placeholder.com/150',
      title: this.titleInput.nativeElement.value,
      description: this.descriptionInput.nativeElement.value,
      stops: this.places
    }
    this.tripsService.addTripToList(trip);
  }
}

