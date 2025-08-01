import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, tap, catchError, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { User } from "./user.model";
import * as CryptoJS from 'crypto-js';
import * as uuid from 'uuid';
import { Router } from "@angular/router";
import { NotificationService } from "../notification/notification.service";

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({ providedIn: 'root' })

export class UsersService {
    private usersList = new BehaviorSubject<User[]>([]);
    usersList$ = this.usersList.asObservable();

    private currentUser = new BehaviorSubject<User | undefined>(undefined);
    currentUser$ = this.currentUser.asObservable();

    private httpClient = inject(HttpClient);

    private notificationService = inject(NotificationService);

    constructor(private router: Router) {
        this.getUsers();
        this.loadUserFromStorage();
    }

    /**
     * Load user from localStorage if available
     */
    private loadUserFromStorage(): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (user && token) {
                try {
                    const parsedUser = JSON.parse(user);
                    this.currentUser.next(parsedUser);
                } catch (error) {
                    console.error('Error parsing user from localStorage:', error);
                    this.logout();
                }
            }
        }
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

    /**
     * log in with email and password
     */
    login(email: string, password: string): Observable<AuthResponse> {

        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

        return this.httpClient.post<AuthResponse>('http://localhost:3000/auth/login', { email, password: hashedPassword }).pipe(
            tap(response => {
                this.setSession(response);
                this.notificationService.showNotification('success', `Hello, ${response.user.username}!`);
                this.router.navigate(['/trips/personal']);
            }),
            catchError(error => {
                this.notificationService.showNotification('error', 'Login failed. Please check your credentials and try again.');
                return throwError(() => error);
            })
        );
    }

    /**
     * log out, remove user from localStorage
     */
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.next(undefined);
        this.router.navigate(['/login']);
        this.notificationService.showNotification('message', 'Logged out succesfully');
    }

    /**
     * register new user with put request
     */
    register(newUser: User) {
        newUser.password = CryptoJS.SHA256(newUser.password).toString(CryptoJS.enc.Hex);
        newUser.id = uuid.v7();

        this.httpClient.put<User>('http://localhost:3000/user/register', {user: newUser})
            .subscribe({
                next: (responseData) => {
                    this.usersList.next([...this.usersList.value, newUser]);
                    this.router.navigate(['/login']);
                    this.notificationService.showNotification('success', `Welcome ${newUser.username}, please log in with your credentials.`);
                },
                error: (error) => {
                    console.error('Error registering:', error);
                    this.notificationService.showNotification('error', error.error.message);
                }
            })
    }

    /**
     * set session
     */
    private setSession(authResult: AuthResponse) {
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('user', JSON.stringify(authResult.user));
        this.currentUser.next(authResult.user)
    }
}
