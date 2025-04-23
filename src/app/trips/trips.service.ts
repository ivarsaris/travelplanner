import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Trip } from "./trip.model";
import { tripsList } from "./trips.list";
import { TripStop } from "./trip-stop.model";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })

export class TripsService {
    private tripsList = new BehaviorSubject<Trip[]>([]);
    tripsList$ = this.tripsList.asObservable();

    private httpClient = inject(HttpClient);

    constructor() {
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

        const newTrip: Trip = {
            id: (this.tripsList.value.length + 1).toString(),
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
                }
            });
    }

    removeTripFromList(id: string) {
        this.httpClient.delete<string>(`http://localhost:3000/trips-list/${id}`, {})
            .subscribe({
                next: (responseData) => {
                    this.tripsList.next(this.tripsList.value.filter(trip => trip.id !== id));
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
}