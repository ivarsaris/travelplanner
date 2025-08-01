import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../users.service';
import { NotificationService } from '../../notification/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private usersService = inject(UsersService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    @ViewChild('emailInput') emailInput!: ElementRef;
    @ViewChild('passwordInput') passwordInput!: ElementRef;

    loading = false;

    /**
     * log in
     */
    onLogin() {
        const email = this.emailInput.nativeElement.value;
        const password = this.passwordInput.nativeElement.value;

        this.loading = true;

        this.usersService.login(email, password).subscribe({
            next: () => {
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }
}
