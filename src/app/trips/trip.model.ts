import { TripStop } from "./trip-stop.model";

export interface Trip {
    id: string;
    image: string;
    title: string;
    description: string;
    duration: string;
    stops: TripStop[];
}