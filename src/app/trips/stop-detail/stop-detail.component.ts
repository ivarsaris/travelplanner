import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgModule } from '@angular/core';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stop-detail',
  standalone: true,
  imports: [GoogleMapsModule, MapMarker],
  templateUrl: './stop-detail.component.html',
  styleUrl: './stop-detail.component.scss'
})
export class StopDetailComponent implements AfterViewInit {
  place: any;
  center: google.maps.LatLngLiteral | undefined = undefined;
  zoom = 12;
  // markerPositions: { lat: number, lng: number }[] = [];
  markerPositions: google.maps.LatLngLiteral[] = [];

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

            this.place = place;
            this.center = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
          }
        });
      } else {
        console.error('error fetching place: ' + status);
      }
    });
  }

  fetchHotelsNearStop() {
    const request = {
      // required parameters
      location: this.center,
      fields: ['displayName', 'location', 'businessStatus'],
      locationRestriction: {
        center: this.center,
      },
      radius: 2000,
      includedPrimaryTypes: ['lodging'],
      maxResultCount: 5,
    };

    this.googlePlacesService?.nearbySearch(request, (places, status) => {
      if (status === 'OK' && places && places.length > 1) {
        this.ngZone.run(() => {
          console.log(places);

          places.forEach((place) => {
            if (place.business_status === 'OPERATIONAL') {
              this.markerPositions.push(place.geometry!.location!.toJSON());
            }
          });
        })
      } else {
        console.error('error fetching hotels: ' + status);
      }
    })
  }
}
