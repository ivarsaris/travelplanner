import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UsersService } from '../users/users.service';

// return true if current user logged in is admin.
// used to allow for admin to perform actions regular users can't
export const adminGuard: CanActivateFn = (route, state) => {
    const usersService = inject(UsersService);
    const router = inject(Router);

    return usersService.currentUser$.pipe(
        map(user => {
            return user && user.role === 'admin' ? true : false;
        })
    );
};
