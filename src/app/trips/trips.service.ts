import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Trip } from "./trip.model";
import { tripsList } from "./trips.list";

@Injectable({providedIn: 'root'})

export class TripsService {
    private tripsList = new BehaviorSubject<Trip[]>(tripsList);
    tripsList$ = this.tripsList.asObservable();

    getTripById(id: string) {
        return this.tripsList.value.find(trip => trip.id === id);
    }
}