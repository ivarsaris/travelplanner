import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Trip } from '../trip.model';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [],
  templateUrl: './trip-edit.component.html',
  styleUrl: './trip-edit.component.scss'
})
export class TripEditComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Trip,
  ) { }
}
