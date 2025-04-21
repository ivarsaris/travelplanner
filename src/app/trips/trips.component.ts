import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Trip } from './trip.model';
import { TripsService } from './trips.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit {
  private tripsService = inject(TripsService);
  private tripsListSubscription!: Subscription;
  tripsList: Trip[] = [];
  private httpClient = inject(HttpClient);

  ngOnInit() {
    this.tripsListSubscription = this.tripsService.tripsList$.subscribe(tripsList => {
      this.tripsList = tripsList;
    });

    this.httpClient.get<Trip[]>('http://localhost:3000/trips-list').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error fetching trips:', error);
      }
    });
  }

  getTripDuration(trip: Trip) {
    return this.tripsService.getTripDuration(trip);
  }
}
