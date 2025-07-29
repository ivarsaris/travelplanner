import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../user.model';

@Component({
  selector: 'app-users-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-overview.component.html',
  styleUrl: './users-overview.component.scss'
})
export class UsersOverviewComponent implements OnInit {
  private usersService = inject(UsersService);

  users: User[] = [];
  currentUser: User | undefined;

  ngOnInit() {
    this.usersService.usersList$.subscribe(users => {
      this.users = users;
    });

    this.usersService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get userQty(): number {
    return this.users.length;
  }

  get activeUserCount(): number {
    return this.users.filter(user => user.isActive).length;
  }

  get adminUserCount(): number {
    return this.users.filter(user => user.role === 'admin').length;
  }

  /**
   * format date to legible string
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
