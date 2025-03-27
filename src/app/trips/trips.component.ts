import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Trip } from './trip.model';
import { TripsService } from './trips.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent {
  private tripsService = inject(TripsService);
  private tripsListSubscription!: Subscription;
  tripsList: Trip[] = [];

  ngOnInit() {
    this.tripsListSubscription = this.tripsService.tripsList$.subscribe(tripsList => {
      this.tripsList = tripsList;
    });
  }
}
