import { Component, inject, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TripsComponent } from '../trips.component';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.model';
import { Trip } from '../trip.model';

@Component({
    selector: 'app-personal-trips',
    standalone: true,
    imports: [NgFor, RouterLink],
    templateUrl: '../trips.component.html',
    styleUrl: '../trips.component.scss'
})
export class PersonalTripsComponent extends TripsComponent implements OnDestroy {
    private usersService = inject(UsersService);
    private currentUserSubscription!: Subscription;
    currentUser: User | undefined = undefined;

    override ngOnInit() {
        this.currentUserSubscription = this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;

            if (this.currentUser) {
                this.tripsList = this.tripsService.getTripsByUserId(this.currentUser.id);

            } else {
                this.tripsList = [];
            }
        });
    }

    ngOnDestroy() {
        if (this.currentUserSubscription) {
            this.currentUserSubscription.unsubscribe();
        }
        if (this.tripsListSubscription) {
            this.tripsListSubscription.unsubscribe();
        }
    }
}
