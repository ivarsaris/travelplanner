import { Component, inject, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { Trip } from '../trip.model';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { TripStop } from '../trip-stop.model';
import { DecimalPipe } from '@angular/common';
import { DisplayRouteMapComponent } from '../../display-route-map/display-route-map.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TripEditComponent } from '../trip-edit/trip-edit.component';

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

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    const trip = this.tripsService.getTripById(id ?? '');
    if (trip) {
      this.trip = trip;
      this.stops = trip.stops;
    }
  }

  openDialog() {
    this.dialog.open(TripEditComponent, {
      data: this.trip
    });
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

  onUpdateTrip(trip: Trip) {
    trip = {
      "id": "1",
      "image": "https://img.static-kl.com/images/media/506F5E1C-28C1-4555-A238CB9D4AD6039E",
      "title": "European City Tour 1",
      "description": "Explore the beautiful cities of Europe from Antwerp to Zurich",
      "stops": [
        {
          "order": "1",
          "duration": "1",
          "location": {
            "name": "Antwerp",
            "address": "Antwerp, Belgium",
            "googlePlaceId": "ChIJfYjDv472w0cRuIqogoRErz4",
            "lat": 51.219448,
            "lng": 4.402464,
            "image": "https://www.in12uur.nl/wp-content/uploads/2025/01/antwerpen-in-12uur.jpg"
          }
        },
        {
          "order": "2",
          "duration": "1",
          "location": {
            "name": "Brussels",
            "address": "Brussels, Belgium",
            "googlePlaceId": "ChIJZ2jHc-2kw0cRpwJzeGY6i8E",
            "lat": 50.8503,
            "lng": 4.3517,
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDOyiluyZMOqfhw5FZx240PqsInYjDFjZFGA&s"
          }
        },
        {
          "order": "3",
          "duration": "1",
          "location": {
            "name": "Luxembourg City",
            "address": "Luxembourg City, Luxembourg",
            "googlePlaceId": "ChIJVyzznc1IlUcREG0F0dbRAAQ",
            "lat": 49.6116,
            "lng": 6.1319,
            "image": "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/93B0/production/_127980873_gettyimages-1168733050.jpg"
          }
        },
        {
          "order": "4",
          "duration": "1",
          "location": {
            "name": "Zurich",
            "address": "Zurich, Switzerland",
            "googlePlaceId": "ChIJGaK-SZcLkEcRA9wf5_GNbuY",
            "lat": 47.3769,
            "lng": 8.5417,
            "image": "https://www.foyer.lu/wp-content/uploads/2025/01/Quartiers-nouveaux-arrivants-Sticky-WP.jpg"
          }
        }
      ]
    }
    this.tripsService.updateTrip(trip);
  }
}

