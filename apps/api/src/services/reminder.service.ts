import { Injectable } from "@nestjs/common";

@Injectable()
export class ReminderService {
  private preferences = new Map<string, string[]>();

  addPreference(userId: string, eventId: string): void {
    const current = this.preferences.get(userId) ?? [];
    if (!current.includes(eventId)) {
      current.push(eventId);
      this.preferences.set(userId, current);
    }
  }

  getReminderOffsetsMinutes(): number[] {
    return [60, 5, 3, 2];
  }

  buildReminderSchedule(eventStart: string): Array<{ at: string; minutesBefore: number }> {
    const start = new Date(eventStart).getTime();
    return this.getReminderOffsetsMinutes().map((minutes) => ({
      minutesBefore: minutes,
      at: new Date(start - minutes * 60_000).toISOString()
    }));
  }
}

