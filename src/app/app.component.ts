import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DisplayRouteMapComponent } from './display-route-map/display-route-map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DisplayRouteMapComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  
}