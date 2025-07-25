import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripsComponent } from '../trips.component';

@Component({
  selector: 'app-recommended-trips',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: '../trips.component.html',
  styleUrl: '../trips.component.scss'
})
export class RecommendedTripsComponent extends TripsComponent {

  override ngOnInit() {
    this.tripsListSubscription = this.tripsService.tripsList$.subscribe(tripsList => {

      this.tripsList = this.tripsService.getRecommendedTrips();
    });
  }
}
