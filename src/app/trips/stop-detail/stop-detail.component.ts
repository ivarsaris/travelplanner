import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stop-detail',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './stop-detail.component.html',
  styleUrl: './stop-detail.component.scss'
})
export class StopDetailComponent implements AfterViewInit {
  center: google.maps.LatLngLiteral | undefined = undefined;
  zoom = 8;
  markers = [
    { lat: 40.73061, lng: -73.935242 },
    { lat: 40.74988, lng: -73.968285 }
  ];

  googlePlaceID!: string | null;
  googlePlacesService?: google.maps.places.PlacesService;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('placesServiceDataEl') placesServiceDataEl!: ElementRef;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) { }

  ngAfterViewInit() {
    this.googlePlaceID = this.route.snapshot.paramMap.get('id');
    if (this.googlePlaceID && typeof (this.googlePlaceID) == 'string') {
      this.displayLocationById(this.googlePlaceID);
    }
  }

  displayLocationById(placedId: string) {
    this.googlePlacesService = new google.maps.places.PlacesService(this.placesServiceDataEl.nativeElement);

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placedId,
      fields: ['name', 'formatted_address', 'geometry']
    };

    this.googlePlacesService.getDetails(request, (place, status) => {

      if (status === 'OK' && place?.formatted_address) {

        this.ngZone.run(() => {

          if (place?.geometry?.location) {

            this.center = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
          }
        });
      } else {
        console.error('error fetching place: ' + status);
      }
    });
  }
}
