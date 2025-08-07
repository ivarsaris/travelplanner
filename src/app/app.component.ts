import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, OnDestroy } from '@angular/core';
import { DisplayRouteMapComponent } from './display-route-map/display-route-map.component';
import { PlacesSearchComponent } from './places-search/places-search.component';
import { TripsComponent } from './trips/trips.component';
import { CreateTripComponent } from './create-trip/create-trip.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
import { StopDetailComponent } from './trips/stop-detail/stop-detail.component';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { UsersService } from './users/users.service';
import { User } from './users/user.model';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NotificationComponent } from './notification/notification/notification.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [DisplayRouteMapComponent, PlacesSearchComponent, RouterOutlet, RouterLink, RouterLinkActive, TripsComponent, TripDetailComponent, StopDetailComponent, NgIf, CreateTripComponent, MatIconModule, NotificationComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent implements OnInit, OnDestroy {
    private usersService = inject(UsersService);
    private currentUserSubscription!: Subscription;

    currentUser: User | undefined = undefined;
    isDropdownOpen = false;

    constructor(private router: Router) { }

    /**
     * subscribe to current logged in user on init
     *
     */
    ngOnInit() {
        this.currentUserSubscription = this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    /**
     * unsubscribe on destroy
     *
     */
    ngOnDestroy() {
        if (this.currentUserSubscription) {
            this.currentUserSubscription.unsubscribe();
        }
    }

    /**
     * toggle account dropdown
     *
     */
    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    /**
     * log out user using service
     *
     */
    onLogout() {
        this.usersService.logout();
        this.isDropdownOpen = false;
    }
}
