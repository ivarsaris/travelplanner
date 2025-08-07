import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UsersService } from '../users/users.service';

// return true if user is logged in. only logged in users
// can perform certain actions
export const authGuard: CanActivateFn = (route, state) => {
    const usersService = inject(UsersService);
    const router = inject(Router);

    return usersService.currentUser$.pipe(
        map(user => {
            return user ? true : false;
        })
    );
};
