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

export class NotificationComponent implements OnInit, OnDestroy {
    private notificationService = inject(NotificationService);
    private subscription!: Subscription;

    notification: Notification | undefined = undefined;

    /**
     * subscribe to notification service on init
     */
    ngOnInit(): void {
        this.subscription = this.notificationService.notification$.subscribe(
            notification => {
                this.notification = notification;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
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
