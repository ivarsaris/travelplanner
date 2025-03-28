import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
import { map, Observable, catchError, of } from 'rxjs';
import { TripStop } from '../trips/trip-stop.model';


@Component({
  selector: 'app-display-route-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, MapDirectionsRenderer],
  templateUrl: './display-route-map.component.html',
  styleUrl: './display-route-map.component.scss'
})

export class DisplayRouteMapComponent implements OnInit {
  // the component requires an array of a minimum of 2 stops
  @Input() stops!: TripStop[];
  display: any;
  center: google.maps.LatLngLiteral = { lat: 13, lng: 6 };
  zoom = 12;
  directionsResults$?: Observable<google.maps.DirectionsResult | undefined>;

  constructor(private mapDirectionsService: MapDirectionsService) {
  }

  ngOnInit() {
    if (this.stops && this.stops.length > 1) {
      this.initDirections();
    }
  }

  initDirections() {
    const origin = this.stops[0];
    const destination = this.stops[this.stops.length - 1];
    const waypoints: google.maps.DirectionsWaypoint[] = [];
    if (this.stops.length > 2) {
      for (let i = 1; i < this.stops.length - 1; i++) {
        waypoints.push({location: {lat: this.stops[i].lat, lng: this.stops[i].lng}, stopover: true})
      }
    }
    
    const request = {
      origin: origin,
      destination: destination,
      waypoints: waypoints.length > 0 ? waypoints : undefined,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(
      map(response => {
        return response.result;
      }),
      catchError(error => {
        console.error('Error in directions request:', error);
        return of(undefined);
      })
    );
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}
