import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Notification } from '../notification.model';
import { NotificationService } from '../notification.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})

/**
 * this notification component can be used throughout the application to display
 * notifications to the user. It's implemented by injecting the NotificationService
 * and calling the showNotification method
 *
 */
export class NotificationComponent implements OnInit, OnDestroy {
    private notificationService = inject(NotificationService);
    private notificationSubscription!: Subscription;

    notification: Notification | undefined = undefined;

    /**
     * subscribe to notification service on init
     */
    ngOnInit(): void {
        this.notificationSubscription = this.notificationService.notification$.subscribe(
            notification => {
                this.notification = notification;
            }
        );
    }

    /**
     * unsubscribe from notificationservice on destroy
     */
    ngOnDestroy(): void {
        if (this.notificationSubscription) {
            this.notificationSubscription.unsubscribe();
        }
    }

    /**
     * Remove a notification manually
     */
    removeNotification() {
        this.notificationService.clearAll();
    }

    /**
     * get notification border color based on message type
     */
    getColorScheme() {
        if (this.notification && this.notification.type) {
            switch (this.notification.type) {
                case 'success':
                    return 'message-success';
                case 'error':
                    return 'message-error';
                case 'message':
                    return 'message-message';
                default:
                    return 'message-message';
            }
        } else {
            return 'message-message';
        }
    }
}
