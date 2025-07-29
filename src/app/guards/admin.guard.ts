import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UsersService } from '../users/users.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const usersService = inject(UsersService);
    const router = inject(Router);

    return usersService.currentUser$.pipe(
        map(user => {
            return user && user.role === 'admin' ? true : false;
        })
    );
};
