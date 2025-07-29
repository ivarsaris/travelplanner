import { Component, ElementRef, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { PlacesSearchComponent } from '../places-search/places-search.component';
import { NgFor, NgIf } from '@angular/common';
import { Place } from '../place.model';
import { TripStop } from '../trips/trip-stop.model';
import { TripsService } from '../trips/trips.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import * as uuid from 'uuid';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-create-trip',
    standalone: true,
    imports: [PlacesSearchComponent, NgIf, NgFor, CdkDrag, CdkDropList, CdkDropListGroup, MatTooltipModule, MatIconModule],
    templateUrl: './create-trip.component.html',
    styleUrl: './create-trip.component.scss'
})
export class CreateTripComponent implements OnInit, OnDestroy {
    places: TripStop[] = [];
    googleMapsLocation: Place | null = null;
    currentUser: User | undefined = undefined;
    saveButtonText: string = '';
    private currentUserSubscription!: Subscription;

    private tripsService = inject(TripsService);
    private usersService = inject(UsersService);

    @ViewChild('durationInput') durationInput!: ElementRef;
    @ViewChild('titleInput') titleInput!: ElementRef;
    @ViewChild('descriptionInput') descriptionInput!: ElementRef;
    @ViewChild('tripImageEl') tripImageEl!: ElementRef;

    /**
     * get logged in user from users service on init
     */
    ngOnInit() {
        this.currentUserSubscription = this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;

            if (this.currentUser?.role === 'admin') {
                this.saveButtonText = 'Save to Recommended Trips';
            }
            this.saveButtonText = 'Save to My Trips';
        });
    }

    ngOnDestroy() {
        if (this.currentUserSubscription) {
            this.currentUserSubscription.unsubscribe();
        }
    }

    onPlaceSelected(event: Place) {
        this.googleMapsLocation = event;
    }

    onAddLocationToTrip() {
        if (this.googleMapsLocation) {
            this.places.push({ id: uuid.v7(), order: (this.places.length + 1).toString(), duration: this.durationInput.nativeElement.value, location: this.googleMapsLocation });
        }
    }

    /**
     *
     * add trip to list if user is logged in
     */
    onAddTripToTripList() {
        if (!this.currentUser) {
            console.error('User must be logged in to save a trip');
            return;
        }

        const tripData = {
            image: this.tripImageEl.nativeElement.src,
            title: this.titleInput.nativeElement.value,
            description: this.descriptionInput.nativeElement.value,
            stops: this.places,
            userId: this.currentUser.id,
            isRecommended: this.currentUser.role === 'admin'
        }
        this.tripsService.addTripToList(tripData);
    }

    /**
     *
     * @param index
     *
     * delete stop from trip at given index
     */
    onDeleteStopFromTrip(index: number) {
        document.getElementById(`stop-${index}`)?.remove();
        this.places = this.places.filter((stop) => stop.order !== (index + 1).toString());
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
