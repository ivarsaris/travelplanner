import { Component, inject, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TripsComponent } from '../trips.component';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.model';
import { Trip } from '../trip.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-personal-trips',
    standalone: true,
    imports: [NgFor, RouterLink, MatIconModule],
    templateUrl: '../trips.component.html',
    styleUrl: '../trips.component.scss'
})

/**
 * extends the tripsComponent. Only difference is that is displays the personal trips for a certain user
 *
 */
export class PersonalTripsComponent extends TripsComponent implements OnDestroy {
    private usersService = inject(UsersService);
    private currentUserSubscription!: Subscription;
    currentUser: User | undefined = undefined;

    /**
     * override ngOnInit to only get peronsal trips i.o. all of them
     *
     */
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

    /**
     * unsunscribe on component destroy
     *
     */
    ngOnDestroy() {
        if (this.currentUserSubscription) {
            this.currentUserSubscription.unsubscribe();
        }
        if (this.tripsListSubscription) {
            this.tripsListSubscription.unsubscribe();
        }
    }
}
