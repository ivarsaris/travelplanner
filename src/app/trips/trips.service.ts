import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Trip } from "./trip.model";
import { tripsList } from "./trips.list";
import { TripStop } from "./trip-stop.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Place } from "../place.model";

@Injectable({ providedIn: 'root' })

export class TripsService {
    private tripsList = new BehaviorSubject<Trip[]>([]);
    tripsList$ = this.tripsList.asObservable();

    private httpClient = inject(HttpClient);

    constructor(private router: Router) {
        this.getTrips();
    }

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

    getTripById(id: string) {
        return this.tripsList.value.find(trip => trip.id === id);
    }

    addTripToList(newTripData: { image: string, title: string, description: string, stops: TripStop[] }) {

        const highestId = Math.max(...this.tripsList.value.map(trip => Number(trip.id)));

        const newTrip: Trip = {
            id: (highestId + 1).toString(),
            image: newTripData.image,
            title: newTripData.title,
            description: newTripData.description,
            stops: newTripData.stops
        }

        this.httpClient
            .put<Trip>('http://localhost:3000/trips-list', {
                tripData: newTrip
            })
            .subscribe({
                next: (responseData) => {
                    this.tripsList.next([...this.tripsList.value, newTrip]);
                    alert(`Trip "${newTrip.title}" has been added to the list`);
                    this.router.navigate([`/trip/${newTrip.id}`]);
                }
            });
    }

    removeTripFromList(id: string) {
        this.httpClient.delete<string>(`http://localhost:3000/trips-list/${id}`, {})
            .subscribe({
                next: (responseData) => {
                    this.tripsList.next(this.tripsList.value.filter(trip => trip.id !== id));
                    this.router.navigate(['/trips']);
                    alert(`Trip with id ${id} has been deleted`);
                },
                error: (error) => {
                    console.error('could not delete trip with id ' + id);
                }
            });
    }

    updateTrip(updatedTrip: Trip) {

        this.httpClient
            .patch<Trip>(`http://localhost:3000/trips-list/${updatedTrip.id}`, {
                tripData: updatedTrip
            })
            .subscribe({
                next: (responseData) => {
                    this.tripsList.next(this.tripsList.value.map((trip) => (trip.id === updatedTrip.id ? trip = updatedTrip : trip)));
                    alert('Trip has been updated');
                }
            });
    }

    getTripDuration(trip: Trip) {
        let duration = 0;
        for (const stop of trip.stops) {
            duration += parseInt(stop.duration);
        }
        return duration;
    }


    // stop detail
    getStopById(tripId: string, googleMapsLocationId: string) {
        const trip = this.tripsList.value.find((trip) => trip.id === tripId);
        return trip?.stops.find((stop) => stop.location.googlePlaceId === googleMapsLocationId);
    }

    addHotelToStop(tripId: string, stopId: string, hotel: Place) {
        const targetTrip = this.tripsList.value.find((trip) => trip.id === tripId);
        const targetStop = targetTrip?.stops.find((stop) => stop.id === stopId);

        if (targetStop) {

            targetStop.hotel = hotel;

            this.httpClient
                .patch<Place>(`http://localhost:3000/trips-list/${tripId}/${stopId}`, {
                    hotel: hotel,
                    tripId: tripId,
                    stopId: stopId
                })
                .subscribe({
                    next: (responseData) => {
                        const updatedTripsList = this.tripsList.value.map((trip) => {
                            if (trip.id === tripId) {
                                
                                const updatedStops = trip.stops.map((stop) => {
                                    if (stop.id === stopId) {

                                        return {...stop, hotel: hotel};
                                    }
                                    return stop;
                                });

                                return {...trip, stops: updatedStops};
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
}