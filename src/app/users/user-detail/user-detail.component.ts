import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../users.service';
import { TripsService } from '../../trips/trips.service';
import { User } from '../user.model';
import { Trip } from '../../trips/trip.model';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './user-detail.component.html',
    styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
    private usersService = inject(UsersService);
    private tripsService = inject(TripsService);

    currentUser: User | undefined;
    currentUserTrips: Trip[] = [];

    ngOnInit() {
        /**
         * subscribe to usersService to get current user
         */
        this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.getPersonalTripsFromUser(user.id);
            }
        });
    }

    getPersonalTripsFromUser(userId: string) {
        /**
         * subscribe to tripsService to get up to date tripdata
         */
        this.tripsService.tripsList$.subscribe(trips => {
            this.currentUserTrips = this.tripsService.getTripsByUserId(userId);
        });
    }

    /**
     * return number of trips a user has created
     */
    get tripCount(): number {
        return this.currentUserTrips.length;
    }

    /**
     *
     * @param date
     * @returns legible date string
     */
    formatDate(date: Date) {
        return new Date(date).toDateString();
    }
}
