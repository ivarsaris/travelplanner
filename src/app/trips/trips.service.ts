import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Trip } from "./trip.model";
import { TripStop } from "./trip-stop.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Place } from "../place.model";

@Injectable({ providedIn: 'root' })

export class TripsService {
    // allow components to subscribe to tripsList
    private tripsList = new BehaviorSubject<Trip[]>([]);
    tripsList$ = this.tripsList.asObservable();

    private httpClient = inject(HttpClient);

    constructor(private router: Router) {
        this.getTrips();
    }

    /**
     * get all trips from the server
     *
     */
    getTrips() {
        this.httpClient.get<Trip[]>('http://localhost:3000/trips-list').subscribe({
            next: (response) => {
                this.tripsList.next(response);
            },
            error: (error) => {
                console.error('Error fetching trips:', error);
            }
        });
    }

    /**
     * @param id of the trip
     * @returns trip mathing the id
     *
     */
    getTripById(id: string) {
        return this.tripsList.value.find(trip => trip.id === id);
    }

    /**
     * @param id user Id
     * @returns trips matching the user id
     *
     */
    getTripsByUserId(id: string) {
        return this.tripsList.value.filter(trip => trip.userId === id);
    }

    /**
     * @returns all trips with the isRecommended label
     *
     */
    getRecommendedTrips() {
        return this.tripsList.value.filter(trip => trip.isRecommended === true);
    }

    /**
     * send put request to the server  to add a new trips to the list
     *
     * @param newTripData
     */
    addTripToList(newTripData: { image: string, title: string, description: string, stops: TripStop[], userId: string, isRecommended: boolean }) {

        const highestId = Math.max(...this.tripsList.value.map(trip => Number(trip.id)));

        const newTrip: Trip = {
            id: (highestId + 1).toString(),
            image: newTripData.image,
            title: newTripData.title,
            description: newTripData.description,
            stops: newTripData.stops,
            userId: newTripData.userId,
            isRecommended: newTripData.isRecommended
        }

        this.httpClient
            .put<Trip>('http://localhost:3000/trips-list', {
                tripData: newTrip
            })
            .subscribe({
                next: (responseData) => {
                    // update the current tripsList value
                    this.tripsList.next([...this.tripsList.value, newTrip]);
                    alert(`Trip "${newTrip.title}" has been added to the list`);
                    this.router.navigate([`/trip/${newTrip.id}`]);
                }
            });
    }

    /**
     * send delete request to server to
     * remove trip from the list based on its id
     *
     * @param id
     *
     */
    removeTripFromList(id: string) {
        this.httpClient.delete<string>(`http://localhost:3000/trips-list/${id}`, {})
            .subscribe({
                next: (responseData) => {
                    // update the current tripsList value
                    this.tripsList.next(this.tripsList.value.filter(trip => trip.id !== id));
                    this.router.navigate(['/trips']);
                    alert(`Trip with id ${id} has been deleted`);
                },
                error: (error) => {
                    console.error('could not delete trip with id ' + id);
                }
            });
    }

    /**
     * send patch request to server to replace trip with new tripdata
     *
     * @param updatedTrip trip to update
     */
    updateTrip(updatedTrip: Trip) {
        this.httpClient
            .patch<Trip>(`http://localhost:3000/trips-list/${updatedTrip.id}`, {
                tripData: updatedTrip
            })
            .subscribe({
                next: (responseData) => {
                    // update the current tripsList value
                    this.tripsList.next(this.tripsList.value.map((trip) => (trip.id === updatedTrip.id ? trip = updatedTrip : trip)));
                    alert('Trip has been updated');
                }
            });
    }

    /**
     * @param trip
     * @returns duration of trip in days
     *
     */
    getTripDuration(trip: Trip) {
        let duration = 0;
        for (const stop of trip.stops) {
            duration += parseInt(stop.duration);
        }
        return duration;
    }

    /**
     * @param tripId
     * @param stopId
     * @returns data of a stop based on the stop id and trip id
     *
     */
    getStopByTripIdAndStopId(tripId: string, stopId: string) {
        const trip = this.tripsList.value.find((trip) => trip.id === tripId);
        return trip?.stops.find((stop) => stop.id === stopId);
    }

    /**
     * send patch request to server to add a hotel to a stop
     * based on the stopId, tripId
     *
     * @param tripId
     * @param stopId
     * @param hotel
     */
    addHotelToStop(tripId: string, stopId: string, hotel: Place) {
        const targetTrip = this.tripsList.value.find((trip) => trip.id === tripId);
        const targetStop = targetTrip?.stops.find((stop) => stop.id === stopId);

        if (targetStop) {

            targetStop.hotel = hotel;

            this.httpClient
                .patch<Place>(`http://localhost:3000/trips-list/hotel/${tripId}/${stopId}`, {
                    hotel: hotel,
                    tripId: tripId,
                    stopId: stopId
                })
                .subscribe({
                    // updates the current tripsList value
                    next: (responseData) => {
                        const updatedTripsList = this.tripsList.value.map((trip) => {
                            if (trip.id === tripId) {

                                const updatedStops = trip.stops.map((stop) => {
                                    if (stop.id === stopId) {

                                        return { ...stop, hotel: hotel };
                                    }
                                    return stop;
                                });

                                return { ...trip, stops: updatedStops };
                            }
                            return trip;
                        });
                        this.tripsList.next(updatedTripsList);
                        alert(`hotel ${hotel.name} has been added to stop`);
                    }
                })
        } else {
            console.error('stop not found');
        }
    }

    /**
     * send put request to server to add an activity to a stop
     * based on the stopId, tripId
     *
     * @param tripId
     * @param stopId
     * @param activity
     */
    addActivityToStop(tripId: string, stopId: string, activity: Place) {
        const targetTrip = this.tripsList.value.find((trip) => trip.id === tripId);
        const targetStop = targetTrip?.stops.find((stop) => stop.id === stopId);

        if (targetStop) {

            this.httpClient
                .put<Place>(`http://localhost:3000/trips-list/activities/${tripId}/${stopId}`, {
                    activity: activity,
                    tripId: tripId,
                    stopId: stopId
                })
                .subscribe({
                    // update current tripslist value
                    next: (responseData) => {
                        const updatedTripsList = this.tripsList.value.map((trip) => {
                            if (trip.id === tripId) {

                                const updatedStops = trip.stops.map((stop) => {
                                    if (stop.id === stopId) {

                                        const updatedActivities = stop.activities ? [...stop.activities, activity] : [activity];

                                        stop.activities = updatedActivities;
                                    }
                                    return stop;
                                });

                                return { ...trip, stops: updatedStops };
                            }
                            return trip;
                        });
                        this.tripsList.next(updatedTripsList);
                        alert(`Activity ${activity.name} has been added to stop`);
                    }
                })
        }
    }

    /**
     * deletes the hotel object from a stop of a trip. this method sends a delete
     * request to the server, and updates the tripsList value
     *
     * @param tripId id of the trip
     * @param stopId id of the stop
     */
    deleteHotelFromStop(tripId: string, stopId: string) {
        const targetTrip = this.tripsList.value.find((trip) => trip.id === tripId);
        const targetStop = targetTrip?.stops.find((stop) => stop.id === stopId);

        if (targetStop) {

            this.httpClient.delete<string>(`http://localhost:3000/stop-hotel/${tripId}/${stopId}`, {})
                .subscribe({
                    next: (responseData) => {
                        const updatedTripsList = this.tripsList.value.map((trip) => {
                            if (trip.id === tripId) {

                                const updatedStops = trip.stops.map((stop) => {
                                    if (stop.id === stopId) {

                                        delete stop.hotel;
                                    }
                                    return stop;
                                });

                                return { ...trip, stops: updatedStops };
                            }
                            return trip;
                        });
                        this.tripsList.next(updatedTripsList);

                        alert(`Hotel has been removed from stop`);
                    },
                    error: (error) => {
                        console.error('could not remove hotel');
                    }
                });
        }
    }

    /**
     * deletes the activity at a given index from a stop of a trip. this method sends a delete
     * request to the server, and updates the tripsList value
     *
     * @param tripId id of the trip
     * @param stopId id of the stop
     * @param activityIndex index of the activity in the activities array
     */
    deleteActivityFromStop(tripId: string, stopId: string, activityIndex: number) {
        const targetTrip = this.tripsList.value.find((trip) => trip.id === tripId);
        const targetStop = targetTrip?.stops.find((stop) => stop.id === stopId);

        if (targetStop) {

            this.httpClient.delete<string>(`http://localhost:3000/stop-activity/${tripId}/${stopId}/${activityIndex}`, {})
                .subscribe({
                    next: (responseData) => {
                        const updatedTripsList = this.tripsList.value.map((trip) => {
                            if (trip.id === tripId) {

                                const updatedStops = trip.stops.map((stop) => {
                                    if (stop.id === stopId) {
                                        if (stop.activities?.[activityIndex]) {
                                            stop.activities.splice(activityIndex, 1);
                                        }
                                    }
                                    return stop;
                                });

                                return { ...trip, stops: updatedStops };
                            }
                            return trip;
                        });
                        this.tripsList.next(updatedTripsList);

                        alert(`Activity has been removed from stop`);
                    },
                    error: (error) => {
                        console.error('could not remove activity');
                    }
                });
        }
    }
}
