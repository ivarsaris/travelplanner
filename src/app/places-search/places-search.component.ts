import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-places-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './places-search.component.html',
  styleUrls: ['./places-search.component.scss']
})
export class PlacesSearchComponent implements AfterViewInit {
  @ViewChild('standardPlacesInput') standardPlacesInput!: ElementRef;

  placeName: string = '';
  placeAddress: string = '';
  placeLocation: { lat: number, lng: number } | null = null;

  constructor() { }

  ngAfterViewInit() {
    this.initAutoCompleteApi();
  }

  initAutoCompleteApi() {
    try {
      const autocomplete = new google.maps.places.Autocomplete(
        this.standardPlacesInput.nativeElement
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.geometry && place.geometry.location) {
          this.placeName = place.name || '';
          this.placeAddress = place.formatted_address || '';
          this.placeLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          console.log('place', place);
        }
      });

    } catch (error) {
      console.error('Error initializing API:', error);
    }
  }
}