import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripsComponent } from '../trips.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-recommended-trips',
    standalone: true,
    imports: [NgFor, RouterLink, MatIconModule],
    templateUrl: '../trips.component.html',
    styleUrl: '../trips.component.scss'
})

/**
 * extends the tripsComponent. Only difference is that is displays the recommended trips
 *
 */
export class RecommendedTripsComponent extends TripsComponent {

    /**
     * override ngOnInit to only get recommended trips i.o. all of them
     *
     */
    override ngOnInit() {
        this.tripsListSubscription = this.tripsService.tripsList$.subscribe(tripsList => {

            this.tripsList = this.tripsService.getRecommendedTrips();
        });
    }
}
