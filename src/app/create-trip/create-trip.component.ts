import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PlacesSearchComponent } from '../places-search/places-search.component';
import { NgFor, NgIf } from '@angular/common';
import { Place } from '../place.model';
import { TripStop } from '../trips/trip-stop.model';
import { TripsService } from '../trips/trips.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import * as uuid from 'uuid';

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
  @ViewChild('imageInput') imageInput!: ElementRef;

  onPlaceSelected(event: Place) {
    this.googleMapsLocation = event;
  }

  onAddLocationToTrip() {
    if (this.googleMapsLocation) {
      this.places.push({ id: uuid.v7(), order: (this.places.length + 1).toString(), duration: this.durationInput.nativeElement.value, location: this.googleMapsLocation });
    }
  }

  onAddTripToTripList() {
    const tripData = {
      image: this.imageInput.nativeElement.value,
      title: this.titleInput.nativeElement.value,
      description: this.descriptionInput.nativeElement.value,
      stops: this.places
    }
    this.tripsService.addTripToList(tripData);
  }
}
