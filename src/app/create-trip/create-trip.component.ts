import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PlacesSearchComponent } from '../places-search/places-search.component';
import { NgFor, NgIf } from '@angular/common';
import { Place } from '../place.model';
import { TripStop } from '../trips/trip-stop.model';
import { TripsService } from '../trips/trips.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [PlacesSearchComponent, NgIf, NgFor, CdkDrag, CdkDropList, CdkDropListGroup, MatTooltipModule],
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

  /**
   *
   * @param event drag and drop event
   *
   * allow for changing the order of the stops by drag and drop
   *
   */
  drop(event: CdkDragDrop<any>): void {
    moveItemInArray(this.places, event.previousIndex, event.currentIndex);

    this.places.forEach((stop, index) => stop.order = (index + 1).toString());
  }
}
