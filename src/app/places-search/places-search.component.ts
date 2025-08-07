import { Component, AfterViewInit, ElementRef, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../place.model';

@Component({
    selector: 'app-places-search',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './places-search.component.html',
    styleUrls: ['./places-search.component.scss']
})
export class PlacesSearchComponent implements AfterViewInit {
    @ViewChild('standardPlacesInput') standardPlacesInput!: ElementRef;
    @Output() placeSelected = new EventEmitter<Place>();

    /**
     * create ngZone to improve interaction with other components through output
     *
     * @param ngZone
     */
    constructor(private ngZone: NgZone) { }

    /**
     * initialize autocomplete listener after initializing component
     * to make sure it's done after the input is rendered
     *
     */
    ngAfterViewInit() {
        this.initAutoCompleteApi();
    }

    /**
     * clear input element
     *
     */
    clearInput() {
        this.standardPlacesInput.nativeElement.value = '';
    }

    /**
     * initialize connection with autocomplete API. It listens for input in the input field
     * and returns results form the Google Maps autocomplete API
     *
     */
    initAutoCompleteApi() {

        try {
            const autocomplete = new google.maps.places.Autocomplete(
                this.standardPlacesInput.nativeElement
            );

            // listen for place selection
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    const place = autocomplete.getPlace();

                    // emit place to component so it can be used further
                    if (place.geometry && place.geometry.location) {
                        this.placeSelected.emit({
                            name: place.name || '',
                            address: place.formatted_address || '',
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                            googlePlaceId: place.place_id || '',
                            image: place.photos ? place.photos[0].getUrl({
                                maxWidth: 720,
                                maxHeight: 480
                            }) : ""
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing API:', error);
        }
    }
}
