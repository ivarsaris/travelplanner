import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Trip } from "./trip.model";
import { tripsList } from "./trips.list";
import { TripStop } from "./trip-stop.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

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
}