export interface Notification {
    message: string;
    type: NotificationType;
}

export type NotificationType = 'success' | 'error' | 'message';
