import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule, MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
import { map, Observable, catchError, of } from 'rxjs';


@Component({
  selector: 'app-display-route-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, MapDirectionsRenderer],
  templateUrl: './display-route-map.component.html',
  styleUrl: './display-route-map.component.scss'
})

export class DisplayRouteMapComponent implements OnInit {
  display: any;
  center: google.maps.LatLngLiteral = { lat: 13, lng: 6 };
  zoom = 12;
  directionsResults$?: Observable<google.maps.DirectionsResult | undefined>;

  constructor(private mapDirectionsService: MapDirectionsService) {
  }

  ngOnInit() {
    this.initDirections();
  }

  initDirections() {
    const request = {
      destination: { lat: 12, lng: 4 },
      origin: { lat: 14, lng: 8 },
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
