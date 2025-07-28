import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private usersService = inject(UsersService);
    private router = inject(Router);

    // TO DO: ability to choose avatar
    avatar = '';

    @ViewChild('emailInput') emailInput!: ElementRef;
    @ViewChild('passwordInput') passwordInput!: ElementRef;
    @ViewChild('firstNameInput') firstNameInput!: ElementRef;
    @ViewChild('lastNameInput') lastNameInput!: ElementRef;

    /**
     * register new user
     */
    onRegister() {
        const newUser = {
            id: '',
            username: this.firstNameInput.nativeElement.value,
            email: this.emailInput.nativeElement.value,
            password: this.passwordInput.nativeElement.value,
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            profile: {
                firstName: this.firstNameInput.nativeElement.value,
                lastName: this.lastNameInput.nativeElement.value,
                avatar: this.avatar
            }
        };

        this.usersService.register(newUser);
    }
}
