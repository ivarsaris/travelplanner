import { Component, ElementRef, inject, Inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Trip } from '../trip.model';
import { TripsService } from '../trips.service';
import { TripStop } from '../trip-stop.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [FormsModule],
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Trip,
    private dialog: MatDialogRef<TripEditComponent>) { }

  onUpdateTrip() {

    const updatedTrip: Trip = {
      id: this.data.id,
      image: this.imageInput.nativeElement.value,
      title: this.titleInput.nativeElement.value,
      description: this.descriptionTextarea.nativeElement.value,
      stops: this.data.stops.map((stop, index) => {
        return {
          order: this.stopOrderInputs.toArray()[index].nativeElement.value,
          duration: this.stopDurationInputs.toArray()[index].nativeElement.value,
          location: stop.location
        }
      })
    };

    this.tripsService.updateTrip(updatedTrip);
    this.dialog.close(true);
  }

  onCloseModal() {
    this.dialog.close(true);
  }
}
