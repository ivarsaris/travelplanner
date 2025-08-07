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

    /**
     * subscribe to users list and current user
     *
     */
    ngOnInit() {
        this.usersService.usersList$.subscribe(users => {
            this.users = users;
        });

        this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    /**
     * get value with the number of users
     *
     */
    get userQty(): number {
        return this.users.length;
    }

    /**
     * format date to legible string
     */
    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString();
    }
}
