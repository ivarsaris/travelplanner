import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from '../trips.service';
import { RouterLink } from '@angular/router';
import { TripStop } from '../trip-stop.model';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.model';
import { Trip } from '../trip.model';

@Component({
    selector: 'app-stop-detail',
    standalone: true,
    imports: [GoogleMapsModule, MapMarker, NgClass, RouterLink, MatIconModule, NgIf, MatTooltipModule],
    templateUrl: './stop-detail.component.html',
    styleUrl: './stop-detail.component.scss'
})
export class StopDetailComponent implements AfterViewInit, OnDestroy {
    tripsService = inject(TripsService);
    usersService = inject(UsersService);
    place: any;
    center: google.maps.LatLngLiteral | undefined = undefined;
    zoom = 12;
    markerInfoObjects: { index: number, type: string, markerInfo: any, location: google.maps.LatLngLiteral, image: string }[] = [];
    fetchingResults: Boolean = false;
    selectedIndex: number | null = null;
    hotelMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#ffa428', '#dc2626');
    selectedHotelMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#dc2626', '#dc2626', 'hotel');
    activityMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#ffa428', '#2626dc');
    selectedActivityMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#2626dc', '#2626dc', 'activity');
    regularMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#fe0000', '#ffa428');
    selectedMarkerOptions: google.maps.MarkerOptions = this.createMarkerOptions('#00af50', '#00af50');
    googlePlaceID!: string | null;
    stopId: string | null = null;
    tripId: string | null = null;
    googlePlacesService?: google.maps.places.PlacesService;

    tripData: Trip | undefined = undefined;
    stopData: TripStop | undefined = undefined;
    hotelMarker: { location: google.maps.LatLngLiteral, options: google.maps.MarkerOptions } | undefined = undefined;
    activityMarkers: { location: google.maps.LatLngLiteral, options: google.maps.MarkerOptions }[] = [];

    highlightedHotel: boolean = false;
    highlightedActivityIndex: number | null = null;

    currentUser: User | undefined;
    private tripsSubscription?: Subscription;

    @ViewChild('mapContainer') mapContainer!: ElementRef;
    @ViewChild('placesServiceDataEl') placesServiceDataEl!: ElementRef;

    constructor(private route: ActivatedRoute, private ngZone: NgZone) { }

    ngAfterViewInit() {
        // get the ids from the current route
        this.googlePlaceID = this.route.snapshot.paramMap.get('googlePlaceId');
        this.stopId = this.route.snapshot.paramMap.get('stopId');
        this.tripId = this.route.snapshot.paramMap.get('tripId');

        this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });

        // display location of the stop
        if (this.googlePlaceID && typeof (this.googlePlaceID) == 'string') {
            this.displayLocationById(this.googlePlaceID);
        }

        if (this.tripId && this.stopId) {

            // Subscribe to tripsList changes to keep stopData in sync
            this.tripsSubscription = this.tripsService.tripsList$.subscribe(() => {
                this.tripData = this.tripsService.getTripById(this.tripId!);
                this.stopData = this.tripsService.getStopByTripIdAndStopId(this.tripId!, this.stopId!);
                this.displayHotelMarker();
                this.displayActivitiesMarkers();
            });
        }
    }

    /**
     * unsubscribe on destroy
     *
     */
    ngOnDestroy() {
        this.tripsSubscription?.unsubscribe();
    }

    /**
     * get value to use in the template. admins can edit recommended trips, users
     * can edit their personal trips
     *
     */
    get canEdit(): boolean {
        if (!this.currentUser || !this.tripData) {
            return false;
        }

        if (this.tripData.isRecommended) {
            return this.currentUser.role === 'admin';
        }

        return this.tripData.userId === this.currentUser.id;
    }

    /**
     * gets details of a location by its locationId and focuses the map on this location
     *
     * @param placedId the google maps locationId of a location
     *
     */
    displayLocationById(placedId: string) {
        this.googlePlacesService = new google.maps.places.PlacesService(this.placesServiceDataEl.nativeElement);

        const request: google.maps.places.PlaceDetailsRequest = {
            placeId: placedId,
            fields: ['name', 'formatted_address', 'geometry']
        };

        // send request to the googlePlacesService and set the current place to focus the map on
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
     *
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

                        // empty markerInfoObjects array
                        this.markerInfoObjects = [];

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
     * send a request to google maps nearbySearch and retreives the 15 activities
     * with the most reviews
     *
     */
    fetchActivitiesNearStop() {
        // show loading screen until fetching is done
        this.fetchingResults = true;

        // request to give to google maps places nearbySearch,
        // find the most prominent tourist attractions withing a 10km radius
        const request = {
            location: this.center,
            fields: ['displayName', 'location', 'businessStatus'],
            locationRestriction: {
                center: this.center,
            },
            keyword: 'tourist_attraction',
            rankby: 'prominence',
            radius: 10000,
            type: 'tourist_attraction',
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

                        // of all the results, get the 15 with the highest rating (at least 50 ratings)
                        const mostRatedActivities = allFetchedActivities.filter(

                            (activity) => activity.user_ratings_total
                                && activity.user_ratings_total > 50
                                && activity.business_status === 'OPERATIONAL'
                        )
                            .sort((a, b) => (b.user_ratings_total ?? 0) - (a.user_ratings_total ?? 0))
                            .slice(0, 15);

                        // empty markerInfoObjects array
                        this.markerInfoObjects = [];

                        mostRatedActivities.forEach((place, index) => {

                            // display marker on maps for each activity
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
     * clear map of search results
     *
     */
    clearSearchResultsMarkers() {
        this.markerInfoObjects = [];
    }

    /**
     * @param priceLevel the price level of a location, number 1-5
     * @returns a string of euro signs symbolizing the price level
     *
     */
    getPriceLevelString(priceLevel: number) {
        if (typeof priceLevel === 'number' && priceLevel > 0) {
            return '€'.repeat(priceLevel);
        }
        return '';
    }

    /**
     * @param i
     *
     */
    highlightMarker(i: number) {
        this.selectedIndex = i;
    }

    /**
     * highlight the hotel marker
     *
     */
    highlightHotelMarker() {
        this.highlightedHotel = !this.highlightedHotel;

        if (this.hotelMarker) {
            this.hotelMarker.options = this.highlightedHotel ? this.createMarkerOptions('#00af50', '#00af50', 'hotel') : this.createMarkerOptions('#dc2626', '#dc2626', 'hotel');
        }
    }

    /**
     * highlight the activity marker
     *
     * @param i index of the activity in selected list
     *
     */
    highlightActivityMarker(i: number) {
        this.highlightedActivityIndex = this.highlightedActivityIndex === i ? null : i;
        this.updateActivityMarkersOptions();
    }

    /**
     * triggers patch request in the trips service to update the trip object with a selected hotel
     *
     * @param i index of hotel and corresponding markerInfoObject
     *
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

            // empty markerInfoObjects array
            this.markerInfoObjects = [];
        } else {
            console.error('Hotel could not be added to stop');
        }
    }

    /**
     * triggers delete request in the trips service to remove the selected hotel from this stop
     *
     */
    deleteHotelFromStop() {
        this.tripsService.deleteHotelFromStop(this.tripId!, this.stopId!);
    }

    /**
     * triggers put request in the trips service to update the trip object with a selected activity
     *
     * @param i index of activity and corresponding markerInfoObject
     *
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
        } else {
            console.error('Activity could not be added to stop');
        }
    }

    /**
     * triggers delete request in the trips service to remove activity from stop at a certain index
     *
     * @param i index of activity in stop
     *
     */
    deleteActivityFromStop(i: number) {
        this.tripsService.deleteActivityFromStop(this.tripId!, this.stopId!, i);
    }

    /**
     * @param marker the marker object to determine options for
     * @returns the appropriate marker options based on marker type and selection state
     *
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
     * @param fillColor background color of marker
     * @param strokeColor border color of marker
     * @returns marker icon to use on map
     *
     */
    createMarkerOptions(fillColor: string, strokeColor: string, markerType: string = ''): google.maps.MarkerOptions {

        let path, scale = 1;

        switch (markerType) {
            case 'hotel':
                path = 'M40-200v-600h80v400h320v-320h320q66 0 113 47t47 113v360h-80v-120H120v120H40Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240 40h320v-160q0-33-23.5-56.5T760-640H520v240ZM280-520q17 0 28.5-11.5T320-560q0-17-11.5-28.5T280-600q-17 0-28.5 11.5T240-560q0 17 11.5 28.5T280-520Zm0-40Zm240-80v240-240Z';
                scale = 0.03;
                break;
            case 'activity':
                path = 'm233-80 54-122q-14-11-27-21.5T235-246q-8 3-15.5 4.5T203-240q-33 0-56.5-23.5T123-320q0-20 8.5-36.5T155-384q-8-23-11-46.5t-3-49.5q0-26 3-49.5t11-46.5q-15-11-23.5-27.5T123-640q0-33 23.5-56.5T203-720q9 0 16.5 1.5T235-714q33-36 75.5-60t90.5-36q5-30 27.5-50t52.5-20q30 0 52.5 20.5T561-810q48 12 90.5 35.5T727-716q8-3 15-4.5t15-1.5q33 0 56.5 23.5T837-642q0 20-8 35.5T807-580q8 24 11 49t3 51q0 26-3 50.5T807-382q14 11 22 26.5t8 35.5q0 33-23.5 56.5T757-240q-8 0-15-1.5t-15-4.5q-12 12-24.5 23.5T675-200l52 120h-74l-38-88q-14 6-27 10.5t-27 7.5q-5 29-27.5 49.5T481-80q-30 0-52.5-20T401-150q-15-3-28.5-7.5T345-168l-38 88h-74Zm76-174 62-140q-14-18-22-40t-8-46q0-57 41.5-98.5T481-620q57 0 98.5 41.5T621-480q0 24-8.5 47T589-392l62 138q9-8 17.5-14.5T685-284q-5-8-6.5-17.5T677-320q0-32 22-55t54-25q6-20 9-39.5t3-40.5q0-21-3-41.5t-9-40.5q-32-2-54-25t-22-55q0-9 2.5-17.5T685-676q-29-29-64-49t-74-31q-11 17-28 26.5t-38 9.5q-21 0-38-9.5T415-756q-41 11-76 31.5T275-674q3 8 5.5 16.5T283-640q0 32-21 54.5T209-560q-6 20-9 39.5t-3 40.5q0 21 3 40.5t9 39.5q32 2 53 25t21 55q0 9-1.5 17.5T275-286q8 9 16.5 16.5T309-254Zm60 34q11 5 22.5 9t23.5 7q11-17 28-26.5t38-9.5q21 0 38 9.5t28 26.5q12-3 22.5-7t21.5-9l-58-130q-12 5-25 7.5t-27 2.5q-15 0-28.5-3t-25.5-9l-58 132Zm112-200q24 0 42-17t18-43q0-24-18-42t-42-18q-26 0-43 18t-17 42q0 26 17 43t43 17Zm0-60Z';
                scale = 0.03;
                break;
            default:
                path = 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z';
        }

        return {
            icon: {
                path: path,
                scale: scale,
                fillColor: fillColor,
                fillOpacity: 1,
                strokeColor: strokeColor,
                strokeWeight: 2,
            }
        }
    }

    /**
     * display marker on the map for the location of the hotel
     *
     */
    displayHotelMarker() {
        if (this.stopData?.hotel) {
            this.hotelMarker = {
                location: {
                    lat: this.stopData.hotel?.lat, lng: this.stopData.hotel?.lng
                },
                options: this.createMarkerOptions('#dc2626', '#dc2626', 'hotel')
            };
        } else {
            this.hotelMarker = undefined;
        }
    }

    /**
     * display markers on the map for locations of the activities
     *
     */
    displayActivitiesMarkers() {
        // Clear existing markers first
        this.activityMarkers = [];

        if (this.stopData?.activities) {
            this.stopData.activities.forEach((activity, index) => {
                const marker = {
                    location: {
                        lat: activity.lat, lng: activity.lng
                    },
                    options: this.getActivityMarkerOptions(index)
                };
                this.activityMarkers.push(marker);
            });
        }
    }

    /**
     * Get marker options for activity based on highlighted state
     *
     */
    getActivityMarkerOptions(index: number): google.maps.MarkerOptions {
        if (this.highlightedActivityIndex === index) {
            return this.createMarkerOptions('#00af50', '#00af50', 'activity');
        }
        return this.createMarkerOptions('#2626dc', '#2626dc', 'activity');
    }

    /**
     * Update activity markers options after highlight state change
     */
    updateActivityMarkersOptions() {
        if (this.stopData?.activities) {
            this.stopData.activities.forEach((activity, index) => {
                if (this.activityMarkers[index]) {
                    this.activityMarkers[index].options = this.highlightedActivityIndex === index ? this.createMarkerOptions('#00af50', '#00af50', 'activity') : this.createMarkerOptions('#2626dc', '#2626dc', 'activity');
                }
            });
        }
    }
}
