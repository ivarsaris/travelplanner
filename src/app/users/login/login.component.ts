import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private usersService = inject(UsersService);
    private usersListSubscription!: Subscription;
    usersList: User[] = [];

    ngOnInit() {
        this.usersListSubscription = this.usersService.usersList$.subscribe(usersList => {
            this.usersList = usersList;
        });
    }

    /**
     * get all users from service
     */
    onFetchUsers() {
        console.log(this.usersList);
    }
}
