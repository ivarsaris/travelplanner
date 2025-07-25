import { Component, inject, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { Trip } from '../trip.model';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { TripStop } from '../trip-stop.model';
import { DecimalPipe } from '@angular/common';
import { DisplayRouteMapComponent } from '../../display-route-map/display-route-map.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TripEditComponent } from '../trip-edit/trip-edit.component';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.model';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [NgIf, DisplayRouteMapComponent, DecimalPipe, RouterLink],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.scss'
})
export class TripDetailComponent implements OnInit {
  private tripsService = inject(TripsService);
  private usersService = inject(UsersService);
  trip!: Trip | undefined;
  stops!: TripStop[];
  id!: string | null;
  currentUser: User | undefined = undefined;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    // Subscribe to current user
    this.usersService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    const trip = this.tripsService.getTripById(this.id ?? '');
    if (trip) {
      this.trip = trip;
      this.stops = this.sortStopsByOrder(trip.stops);
      console.log('trip', this.trip);
    }
  }

  /**
   * Get the appropriate back route based on user role
   */
  getBackRoute(): string {
    if (this.currentUser?.role === 'admin') {
      return '/trips/recommended';
    } else {
      return '/trips/personal';
    }
  }

  openDialog() {
    const dialog = this.dialog.open(TripEditComponent, {
      data: this.trip
    });

    dialog.afterClosed().subscribe(() => {

      if (this.id) {
        const updatedTrip = this.tripsService.getTripById(this.id);
        if (updatedTrip) {
          this.trip = updatedTrip;
          this.stops = this.sortStopsByOrder(updatedTrip.stops);
        }
      }
    });
  }

  getTripDuration(trip: Trip) {
    return this.tripsService.getTripDuration(trip);
  }

  onDeleteTripFromList(id: string) {
    this.tripsService.removeTripFromList(id);
  }

  sortStopsByOrder(stops: TripStop[]) {
    return stops.sort((a, b) => Number(a.order) - Number(b.order));
  }
}

