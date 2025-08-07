import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../users.service';
import { TripsService } from '../../trips/trips.service';
import { User } from '../user.model';
import { Trip } from '../../trips/trip.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, MatIconModule],
    templateUrl: './user-detail.component.html',
    styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
    private usersService = inject(UsersService);
    private tripsService = inject(TripsService);

    currentUser: User | undefined;
    currentUserTrips: Trip[] = [];

    /**
     * subscribe to usersService on init to get current user
     *
     */
    ngOnInit() {
        this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.getPersonalTripsFromUser(user.id);
            }
        });
    }

    /**
     * subscribe to tripsService to get up to date tripdata
     *
     */
    getPersonalTripsFromUser(userId: string) {
        this.tripsService.tripsList$.subscribe(trips => {
            this.currentUserTrips = this.tripsService.getTripsByUserId(userId);
        });
    }

    /**
     * get value with number of trips a user has created
     *
     */
    get tripCount(): number {
        return this.currentUserTrips.length;
    }

    /**
     * @param date
     * @returns legible date string
     *
     */
    formatDate(date: Date) {
        return new Date(date).toDateString();
    }
}
