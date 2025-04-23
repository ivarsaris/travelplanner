import { Component, inject, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { Trip } from '../trip.model';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { TripStop } from '../trip-stop.model';
import { DecimalPipe } from '@angular/common';
import { DisplayRouteMapComponent } from '../../display-route-map/display-route-map.component';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [NgIf, NgFor, DisplayRouteMapComponent, DecimalPipe],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.scss'
})
export class TripDetailComponent implements OnInit {
  private tripsService = inject(TripsService);
  trip!: Trip;
  stops!: TripStop[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    const trip = this.tripsService.getTripById(id ?? '');
    if (trip) {
      this.trip = trip;
      this.stops = trip.stops;
    }
  }

  trackByOrder(index: number, stop: TripStop) {
    return stop.order;
  }

  getTripDuration(trip: Trip) {
    return this.tripsService.getTripDuration(trip);
  }

  onDeleteTripFromList(id: string) {
    this.tripsService.removeTripFromList(id);
  }
}

