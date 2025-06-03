import { Place } from "../place.model";

export interface TripStop {
    id: string;
    order: string;
    duration: string;
    location: Place;
    hotel?: Place;
    activities?: Place[]; 
}