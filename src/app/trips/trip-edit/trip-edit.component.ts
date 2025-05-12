import { Component, ElementRef, inject, Inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Trip } from '../trip.model';
import { TripsService } from '../trips.service';
import { TripStop } from '../trip-stop.model';
import { FormsModule } from '@angular/forms';
import { PlacesSearchComponent } from '../../places-search/places-search.component';
import { Place } from '../../place.model';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [FormsModule, PlacesSearchComponent, CdkDrag, CdkDropList, CdkDropListGroup, NgFor, MatTooltipModule],
  templateUrl: './trip-edit.component.html',
  styleUrl: './trip-edit.component.scss'
})
export class TripEditComponent {
  private tripsService = inject(TripsService);

  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('descriptionTextarea') descriptionTextarea!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChildren('stopOrderInputs') stopOrderInputs!: QueryList<ElementRef>;
  @ViewChildren('stopDurationInputs') stopDurationInputs!: QueryList<ElementRef>;

  googleMapsLocation: Place | null = null;
  @ViewChild('newStopDurationInput') newStopDurationInput!: ElementRef;

  tripStops!: TripStop[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Trip,
    private dialog: MatDialogRef<TripEditComponent>) {

    this.tripStops = this.data.stops;
  }

  onUpdateTrip() {

    const updatedTrip: Trip = {
      id: this.data.id,
      image: this.imageInput.nativeElement.value,
      title: this.titleInput.nativeElement.value,
      description: this.descriptionTextarea.nativeElement.value,
      stops: this.tripStops.map((stop, index) => {
        return {
          order: stop.order,
          duration: this.stopDurationInputs.toArray()[index].nativeElement.value,
          location: stop.location
        }
      })
    };

    this.tripsService.updateTrip(updatedTrip);
    this.dialog.close(true);
  }

  onPlaceSelected(event: Place) {
    this.googleMapsLocation = event;
  }

  onDeleteStopFromTrip(name: string, order: string) {
    document.getElementById(`stop-${order}`)?.remove();
    this.data.stops = this.data.stops.filter((stop) => stop.location.name !== name);
    this.data.stops.forEach((stop, index) => stop.order = (index + 1).toString());
    this.tripStops = this.data.stops;
  }

  onAddStopToTrip() {
    if (this.googleMapsLocation) {
      this.data.stops.push({ order: (this.data.stops.length + 1).toString(), duration: this.newStopDurationInput.nativeElement.value, location: this.googleMapsLocation });
      this.tripStops = this.data.stops;
    }
  }

  onCloseModal() {
    this.dialog.close(true);
  }

  drop(event: CdkDragDrop<any>): void {
    moveItemInArray(this.data.stops, event.previousIndex, event.currentIndex);

    this.data.stops.forEach((stop, index) => stop.order = (index + 1).toString());
    this.tripStops = this.data.stops;
  }
}
