import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../users.service';

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

    @ViewChild('emailInput') emailInput!: ElementRef;
    @ViewChild('passwordInput') passwordInput!: ElementRef;

    loading = false;

    /**
     * log in
     */
    onLogin() {
        const email = this.emailInput.nativeElement.value;
        const password = this.passwordInput.nativeElement.value;

        if (email && password) {
            this.loading = true;

            this.usersService.login(email, password).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    this.loading = false;
                    this.router.navigate(['/trips']);
                },
                error: (error) => {
                    console.error('Login failed:', error);
                    this.loading = false;
                }
            });
        }
    }

    /**
     * log out user
     */
    onLogout() {
        this.usersService.logout();
        this.router.navigate(['/login']);
    }
}
