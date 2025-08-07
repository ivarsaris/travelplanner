import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Trip } from './trip.model';
import { TripsService } from './trips.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-trips',
    standalone: true,
    imports: [NgFor, RouterLink, MatIconModule],
    templateUrl: './trips.component.html',
    styleUrl: './trips.component.scss'
})

export class TripsComponent implements OnInit {
    protected tripsService = inject(TripsService);
    protected tripsListSubscription!: Subscription;
    tripsList: Trip[] = [];

    /**
     * subscribe to tripsService on init
     *
     */
    ngOnInit() {
        this.tripsListSubscription = this.tripsService.tripsList$.subscribe(tripsList => {
            this.tripsList = tripsList;
        });
    }

    /**
     * @param trip
     * @returns trips duration in days
     *
     */
    getTripDuration(trip: Trip) {
        return this.tripsService.getTripDuration(trip);
    }
}
