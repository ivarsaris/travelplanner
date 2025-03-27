import { Component, inject, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { Trip } from '../trip.model';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { TripStop } from '../trip-stop.model';
@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.scss'
})
export class TripDetailComponent implements OnInit {
  private tripsService = inject(TripsService);
  trip!: Trip;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    const trip = this.tripsService.getTripById(id ?? '');
    if (trip) {
      this.trip = trip;
    }

    console.log(this.trip);
  }

  trackByOrder(index: number, stop: TripStop) {
    return stop.order;
  }
}

