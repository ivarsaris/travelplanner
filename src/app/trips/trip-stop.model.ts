import { Place } from "../place.model";

export interface TripStop {
    order: string;
    duration: string;
    location: Place;
}