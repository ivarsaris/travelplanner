import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private notification = new BehaviorSubject<Notification | undefined>(undefined);
    public notification$ = this.notification.asObservable();

    /**
     * set notification to display
     */
    showNotification(type: NotificationType, message: string) {
        this.notification.next({type, message});

        setTimeout(() => {
            this.clearAll();
        }, 6000);
    }

    /**
     * Clear notification
     */
    clearAll(): void {
        this.notification.next(undefined);
    }
}
