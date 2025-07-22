import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })

export class UsersService {
    private usersList = new BehaviorSubject<User[]>([]);
    usersList$ = this.usersList.asObservable();

    private httpClient = inject(HttpClient);

    constructor(private router: Router) {
        this.getUsers();
    }

    /**
     * send get request to server to retreive users list
     */
    getUsers() {
        this.httpClient.get<User[]>('http://localhost:3000/users-list').subscribe({
            next: (response) => {
                this.usersList.next(response);
            },
            error: (error) => {
                console.error('Error fetching users:', error);
            }
        });
    }
}
