import { Injectable } from "@nestjs/common";

export type NotificationChannel = "email" | "sms" | "in_app";

export interface NotificationPayload {
  userId?: string;
  email?: string;
  phone?: string;
  message: string;
  subject?: string;
  attachmentName?: string;
  attachmentBuffer?: Buffer;
}

@Injectable()
export class NotificationService {
  private inAppInbox: Array<{ id: string; message: string; ts: string }> = [];

  send(channel: NotificationChannel, payload: NotificationPayload): void {
    if (channel === "in_app") {
      this.inAppInbox.push({ id: crypto.randomUUID(), message: payload.message, ts: new Date().toISOString() });
    }
    // Placeholder for future integrations (email/SMS/push providers)
    // Intentionally no third-party integration here.
  }

  getInbox(): Array<{ id: string; message: string; ts: string }> {
    return this.inAppInbox;
  }
}

