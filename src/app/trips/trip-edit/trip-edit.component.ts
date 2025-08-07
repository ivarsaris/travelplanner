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
import * as uuid from 'uuid';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-trip-edit',
    standalone: true,
    imports: [FormsModule, PlacesSearchComponent, CdkDrag, CdkDropList, CdkDropListGroup, NgFor, MatTooltipModule, MatIconModule],
    templateUrl: './trip-edit.component.html',
    styleUrl: './trip-edit.component.scss'
})
export class TripEditComponent {
    private tripsService = inject(TripsService);

    // create viewchilds for all input fields
    @ViewChild('titleInput') titleInput!: ElementRef;
    @ViewChild('descriptionTextarea') descriptionTextarea!: ElementRef;
    @ViewChild('imageInput') imageInput!: ElementRef;
    @ViewChildren('stopOrderInputs') stopOrderInputs!: QueryList<ElementRef>;
    @ViewChildren('stopDurationInputs') stopDurationInputs!: QueryList<ElementRef>;
    @ViewChild(PlacesSearchComponent) placesSearchComponent!: PlacesSearchComponent;

    googleMapsLocation: Place | null = null;
    @ViewChild('newStopDurationInput') newStopDurationInput!: ElementRef;

    tripStops!: TripStop[];

    /**
     * get data from other component that calls this component
     * and open the dialog
     *
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: Trip,
        private dialog: MatDialogRef<TripEditComponent>) {

        this.tripStops = this.data.stops;
    }

    /**
     * trigger updateTrip in the trips service with new data from the dialog
     *
     */
    onUpdateTrip() {
        const updatedTrip: Trip = {
            id: this.data.id,
            image: this.imageInput.nativeElement.value,
            title: this.titleInput.nativeElement.value,
            description: this.descriptionTextarea.nativeElement.value,
            stops: this.tripStops.map((stop, index) => {
                return {
                    id: stop.id,
                    order: stop.order,
                    duration: this.stopDurationInputs.toArray()[index].nativeElement.value,
                    location: stop.location
                }
            })
        };

        this.tripsService.updateTrip(updatedTrip);
        this.dialog.close(true);
    }

    /**
     * set Google maps location based on output from PlacesSearchComponent
     *
     * @param event
     *
     */
    onPlaceSelected(event: Place) {
        this.googleMapsLocation = event;
    }

    /**
     * delete stop from trip and update the current trip stops in the component
     *
     * @param name
     * @param order
     *
     */
    onDeleteStopFromTrip(name: string, order: string) {
        // remove stop from DOM
        document.getElementById(`stop-${order}`)?.remove();

        // remove stop from data
        this.data.stops = this.data.stops.filter((stop) => stop.location.name !== name);
        this.data.stops.forEach((stop, index) => stop.order = (index + 1).toString());
        this.tripStops = this.data.stops;
    }

    /**
     * add stop to current trip
     *
     */
    onAddStopToTrip() {
        if (this.googleMapsLocation) {
            this.data.stops.push({ id: uuid.v7(), order: (this.data.stops.length + 1).toString(), duration: this.newStopDurationInput.nativeElement.value, location: this.googleMapsLocation });
            this.tripStops = this.data.stops;
            this.placesSearchComponent.clearInput();
            this.googleMapsLocation = null;
        }
    }

    /**
     * close modal
     *
     */
    onCloseModal() {
        this.dialog.close(true);
    }

    /**
     * allow user to drag and drop stops to change order
     *
     * @param event
     *
     */
    drop(event: CdkDragDrop<any>): void {
        moveItemInArray(this.data.stops, event.previousIndex, event.currentIndex);

        this.data.stops.forEach((stop, index) => stop.order = (index + 1).toString());
        this.tripStops = this.data.stops;
    }
}
