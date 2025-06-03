import { NgClass } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stop-detail',
  standalone: true,
  imports: [GoogleMapsModule, MapMarker, NgClass],
  templateUrl: './stop-detail.component.html',
  styleUrl: './stop-detail.component.scss'
})
export class StopDetailComponent implements AfterViewInit {
  place: any;
  center: google.maps.LatLngLiteral | undefined = undefined;
  zoom = 12;
  markerInfoObjects: { index: number, markerInfo: any, location: google.maps.LatLngLiteral, image: string }[] = [];
  fetchingHotelsActive: Boolean = false;
  selectedIndex: number | null = null;
  regularMarkerOptions: google.maps.MarkerOptions = this.getMarkerOptions('#fe0000', '#ffa428')
  selectedMarkerOptions: google.maps.MarkerOptions = this.getMarkerOptions('#00af50', '#ffa428')
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

  /**
   * 
   * @param placedId the google maps locationId of a location
   * 
   * gets details of a location by its locationId and focuses the map on this location
   */
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

  /**
   * sends a request to google maps nearbySearch and retreives the 5 hotels
   * near a location with the highest reviews
   */
  fetchHotelsNearStop() {
    // show loading screen until fetching is done
    this.fetchingHotelsActive = true;

    // request to give to google maps places nearbySearch
    const request = {
      location: this.center,
      fields: ['displayName', 'location', 'businessStatus'],
      locationRestriction: {
        center: this.center,
      },
      keyword: 'lodging',
      radius: 2000,
      includedPrimaryTypes: ['lodging'],
      maxResultCount: 5
    };

    const allFetchedHotels: google.maps.places.PlaceResult[] = [];

    // send request to google maps nearbySearch
    this.googlePlacesService?.nearbySearch(request, (places, status, pagination) => {

      if (status === 'OK' && places && places.length > 1) {

        this.ngZone.run(() => {

          allFetchedHotels.push(...places);

          // each 'page' of results has 20 results, we want to retreive
          // hotels until the last page
          if (pagination && pagination.hasNextPage) {

            setTimeout(() => {
              pagination.nextPage();

            }, 500);
          } else {

            this.fetchingHotelsActive = false;

            // of all the results, get the 5 with the highest rating (at least 50 ratings)
            const bestRatedHotels = allFetchedHotels.filter(

              (hotel) => hotel.user_ratings_total
                && hotel.user_ratings_total > 50
                && hotel.business_status === 'OPERATIONAL'
                && hotel.types?.includes('lodging'))
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, 5);

            bestRatedHotels.forEach((place, index) => {

              // display marker on maps for each hotel
              this.markerInfoObjects.push({
                index: index,
                markerInfo: place,
                location: place.geometry!.location!.toJSON(),
                image: place.photos ? place.photos[0].getUrl({
                  maxWidth: 720,
                  maxHeight: 480
                }) : ""
              });
            });
          }
        });
      } else {
        console.error('error fetching hotels: ' + status);
      }
    });
  }

  /**
   * 
   * @param priceLevel the price level of a location, number 1-5
   * @returns a string of euro signs symbolizing the price level
   */
  getPriceLevelString(priceLevel: number) {
    if (typeof priceLevel === 'number' && priceLevel > 0) {
      return '€'.repeat(priceLevel);
    }
    return '';
  }

  /**
   * 
   * @param i 
   */
  highlightMarker(i: number) {
    this.selectedIndex = i;
  }

  addHotelToStop(i: number) {

  }

  /**
   * 
   * @param fillColor background color of marker
   * @param strokeColor border color of marker
   * @returns marker icon to use on map
   */
  getMarkerOptions(fillColor: string, strokeColor: string): google.maps.MarkerOptions {
    return {
      icon: {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: fillColor,
        fillOpacity: 1,
        strokeColor: strokeColor,
        strokeWeight: 2,
      }
    }
  }
}
