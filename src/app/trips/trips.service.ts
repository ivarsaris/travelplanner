import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Trip } from "./trip.model";
import { tripsList } from "./trips.list";
import { TripStop } from "./trip-stop.model";

@Injectable({ providedIn: 'root' })

export class TripsService {
    private tripsList = new BehaviorSubject<Trip[]>(tripsList);
    tripsList$ = this.tripsList.asObservable();

    getTripById(id: string) {
        return this.tripsList.value.find(trip => trip.id === id);
    }

    addTripToList(tripData: { image: string, title: string, description: string, stops: TripStop[] }) {
        const newTrip: Trip = {
            id: (this.tripsList.value.length + 1).toString(),
            image: tripData.image,
            title: tripData.title,
            description: tripData.description,
            stops: tripData.stops
        }

        this.tripsList.next([...this.tripsList.value, newTrip]);
    }

    getTripDuration(trip: Trip) {
        let duration = 0;
        for (const stop of trip.stops) {
            duration += parseInt(stop.duration);
        }
        return duration;
    }
}