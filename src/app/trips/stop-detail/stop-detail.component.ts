import { NgClass } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from '../trips.service';
import { RouterLink } from '@angular/router';
import { TripStop } from '../trip-stop.model';
import { Place } from '../../place.model';

@Component({
  selector: 'app-stop-detail',
  standalone: true,
  imports: [GoogleMapsModule, MapMarker, NgClass, RouterLink],
  templateUrl: './stop-detail.component.html',
  styleUrl: './stop-detail.component.scss'
})
export class StopDetailComponent implements AfterViewInit {
  tripsService = inject(TripsService);
  place: any;
  center: google.maps.LatLngLiteral | undefined = undefined;
  zoom = 12;
  markerInfoObjects: { index: number, type: string, markerInfo: any, location: google.maps.LatLngLiteral, image: string }[] = [];
  fetchingResults: Boolean = false;
  selectedIndex: number | null = null;
  hotelMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#dc2626', '#dc2626', 'hotel');
  activityMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#2626dc', '#2626dc', 'activity');
  regularMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#fe0000', '#ffa428');
  selectedMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#00af50', '#ffa428');
  googlePlaceID!: string | null;
  stopId: string | null = null;
  tripId: string | null = null;
  googlePlacesService?: google.maps.places.PlacesService;

  stopData: TripStop | undefined = undefined;
  hotelMarker: { location: google.maps.LatLngLiteral, options: google.maps.MarkerOptions } | undefined = undefined;
  activityMarkers: { location: google.maps.LatLngLiteral, options: google.maps.MarkerOptions }[] = [];

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('placesServiceDataEl') placesServiceDataEl!: ElementRef;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) { }

  ngAfterViewInit() {
    this.googlePlaceID = this.route.snapshot.paramMap.get('googlePlaceId');
    this.stopId = this.route.snapshot.paramMap.get('stopId');
    this.tripId = this.route.snapshot.paramMap.get('tripId');

    if (this.googlePlaceID && typeof (this.googlePlaceID) == 'string') {
      this.displayLocationById(this.googlePlaceID);
    }

    if (this.tripId && this.stopId) {
      this.stopData = this.tripsService.getStopByTripIdAndStopId(this.tripId, this.stopId);

      console.log(this.stopData);

      if (this.stopData?.hotel) {
        this.hotelMarker = {
          location: {
            lat: this.stopData.hotel?.lat, lng: this.stopData.hotel?.lng
          },
          options: this.createMarkerOptions('#dc2626', '#dc2626', 'hotel')
        };
      }
      if (this.stopData?.activities) {
        for (const activity of this.stopData.activities) {
          const marker = {
            location: {
              lat: activity.lat, lng: activity.lng
            },
            options: this.createMarkerOptions('#2626dc', '#2626dc', 'activity')
          };
          this.activityMarkers = [...this.activityMarkers, marker];
        }
      }
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
    this.fetchingResults = true;

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

            this.fetchingResults = false;

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
                index: this.markerInfoObjects.length,
                type: 'hotel',
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
   * send a request to google maps nearbySearch and retreives the 10 activities
   * with the most reviews
   */
  fetchActivitiesNearStop() {
    // show loading screen until fetching is done
    this.fetchingResults = true;

    // request to give to google maps places nearbySearch
    const request = {
      location: this.center,
      fields: ['displayName', 'location', 'businessStatus'],
      locationRestriction: {
        center: this.center,
      },
      keyword: 'activity',
      radius: 2000,
      includedPrimaryTypes: [
        'interest',
        'Things to do',
        'point_of_interest',
        'tourist_attraction'
      ],
      // maxResultCount: 5
    };

    const allFetchedActivities: google.maps.places.PlaceResult[] = [];

    // send request to google maps nearbySearch
    this.googlePlacesService?.nearbySearch(request, (places, status, pagination) => {

      if (status === 'OK' && places && places.length > 1) {

        this.ngZone.run(() => {

          allFetchedActivities.push(...places);

          // each 'page' of results has 20 results, we want to retreive
          // activities until the last page
          if (pagination && pagination.hasNextPage) {

            setTimeout(() => {
              pagination.nextPage();

            }, 500);
          } else {

            this.fetchingResults = false;

            console.log('all activities', allFetchedActivities);

            // of all the results, get the 5 with the highest rating (at least 50 ratings)
            const mostRatedActivities = allFetchedActivities.filter(

              (activity) => activity.user_ratings_total
                && activity.user_ratings_total > 50
                && activity.business_status === 'OPERATIONAL'
            )
              .sort((a, b) => (b.user_ratings_total ?? 0) - (a.user_ratings_total ?? 0))
              .slice(0, 15);

            mostRatedActivities.forEach((place, index) => {

              // display marker on maps for each hotel
              this.markerInfoObjects.push({
                index: this.markerInfoObjects.length,
                type: 'activity',
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

  /**
   *
   * @param i index of hotel and corresponding markerInfoObject
   *
   * triggers patch request in the trips service to update the trip object with a selected hotel
   */
  addHotelToStop(i: number) {
    const location = this.markerInfoObjects.find((marker) => marker.index === i);
    const hotel: Place = {
      name: location!.markerInfo.name,
      address: location!.markerInfo.vicinity,
      lat: location!.location.lat,
      lng: location!.location.lng,
      googlePlaceId: location!.markerInfo.place_id,
      image: location!.image
    };

    if (typeof (this.tripId) === 'string' && typeof (this.stopId) === 'string') {
      this.tripsService.addHotelToStop(this.tripId, this.stopId, hotel);
      if (this.stopData) {
        this.stopData.hotel = hotel;
      }

    } else {
      console.error('Hotel could not be added to stop');
    }
  }

  /**
   * triggers delete request in the trips service to remove the selected hotel from this stop
   */
  deleteHotelFromStop() {
    this.tripsService.deleteHotelFromStop(this.tripId!, this.stopId!);
  }

  /**
   *
   * @param i index of activity and corresponding markerInfoObject
   *
   * triggers put request in the trips service to update the trip object with a selected activity
   */
  addActivityToStop(i: number) {
    const location = this.markerInfoObjects.find((marker) => marker.index === i);
    const activity: Place = {
      name: location!.markerInfo.name,
      address: location!.markerInfo.vicinity,
      lat: location!.location.lat,
      lng: location!.location.lng,
      googlePlaceId: location!.markerInfo.place_id,
      image: location!.image
    };

    if (typeof (this.tripId) === 'string' && typeof (this.stopId) === 'string') {
      this.tripsService.addActivityToStop(this.tripId, this.stopId, activity);

      if (this.stopData) {
        if (this.stopData.activities) {
          this.stopData.activities.push(activity);
        } else {
          this.stopData.activities = [activity];
        }
      }
    } else {
      console.error('Activity could not be added to stop');
    }
  }

  /**
   *
   * @param i index of activity in stop
   */
  deleteActivityFromStop(i:number) {

  }

  /**
   *
   * @param marker the marker object to determine options for
   * @returns the appropriate marker options based on marker type and selection state
   */
  getMarkerOptionsForMarker(marker: { index: number, type: string, markerInfo: any, location: google.maps.LatLngLiteral, image: string }): google.maps.MarkerOptions {
    if (marker.index === this.selectedIndex) {
      return this.selectedMarkerOptions;
    } else if (marker.type === 'hotel') {
      return this.hotelMarkerOptions;
    } else if (marker.type === 'activity') {
      return this.activityMarkerOptions;
    } else {
      return this.regularMarkerOptions;
    }
  }

  /**
   *
   * @param fillColor background color of marker
   * @param strokeColor border color of marker
   * @returns marker icon to use on map
   */
  createMarkerOptions(fillColor: string, strokeColor: string, markerType: string = ''): google.maps.MarkerOptions {

    let path;

    switch (markerType) {
      case 'hotel':
        path = 'M -8,-16 L -8,0 L 8,0 L 8,-16 Z M -6,-14 L -6,-12 L -4,-12 L -4,-14 Z M -2,-14 L -2,-12 L 0,-12 L 0,-14 Z M 2,-14 L 2,-12 L 4,-12 L 4,-14 Z M -6,-10 L -6,-8 L -4,-8 L -4,-10 Z M -2,-10 L -2,-8 L 0,-8 L 0,-10 Z M 2,-10 L 2,-8 L 4,-8 L 4,-10 Z M -6,-6 L -6,-4 L -4,-4 L -4,-6 Z M -2,-6 L -2,-4 L 0,-4 L 0,-6 Z M 2,-6 L 2,-4 L 4,-4 L 4,-6 Z'
        break;
      case 'activity':
        path = 'M -8,-16 L -8,0 L 8,0 L 8,-16 Z M -6,-14 L -6,-12 L -4,-12 L -4,-14 Z M -2,-14 L -2,-12 L 0,-12 L 0,-14 Z M 2,-14 L 2,-12 L 4,-12 L 4,-14 Z M -6,-10 L -6,-8 L -4,-8 L -4,-10 Z M -2,-10 L -2,-8 L 0,-8 L 0,-10 Z M 2,-10 L 2,-8 L 4,-8 L 4,-10 Z M -6,-6 L -6,-4 L -4,-4 L -4,-6 Z M -2,-6 L -2,-4 L 0,-4 L 0,-6 Z M 2,-6 L 2,-4 L 4,-4 L 4,-6 Z'
        break;
      default:
        path = 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z';
    }

    return {
      icon: {
        path: path,
        fillColor: fillColor,
        fillOpacity: 1,
        strokeColor: strokeColor,
        strokeWeight: 2,
      }
    }
  }
}
