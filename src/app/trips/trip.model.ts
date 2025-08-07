import { TripStop } from "./trip-stop.model";

export interface Trip {
    id: string;
    image: string;
    title: string;
    description: string;
    stops: TripStop[];
    userId?: string,
    isRecommended?: boolean;
}
