import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import type { BookingResult } from "@shared/types";
import { BookingRequestDto } from "../dto/booking.dto";
import { PreferenceDto } from "../dto/preference.dto";
import { ContentstackService } from "../services/contentstack.service";
import { NotificationService } from "../services/notification.service";
import { PricingService } from "../services/pricing.service";
import { ReminderService } from "../services/reminder.service";
import { SeatMapService } from "../services/seatmap.service";
import { TicketService } from "../services/ticket.service";
import { isValidPhone } from "../utils/validation";

@Controller()
export class BookingController {
  constructor(
    private readonly contentstack: ContentstackService,
    private readonly pricing: PricingService,
    private readonly seatMap: SeatMapService,
    private readonly notifications: NotificationService,
    private readonly tickets: TicketService,
    private readonly reminders: ReminderService
  ) {}

  @Post("bookings")
  async createBooking(@Body() dto: BookingRequestDto): Promise<BookingResult> {
    if (!isValidPhone(dto.customerPhone)) {
      throw new BadRequestException("Invalid phone number format.");
    }

    const events = await this.contentstack.getEvents();
    const event = events.find((item) => item.id === dto.eventId);
    if (!event) {
      throw new BadRequestException("Event not found.");
    }

    const tiers = await this.contentstack.getTierRules();
    const tierRule = tiers.find((tier) => tier.key === dto.tier);
    if (!tierRule) {
      throw new BadRequestException("Invalid tier selection.");
    }
    if (dto.tickets > tierRule.maxTickets) {
      throw new BadRequestException(`Tier limit exceeded. Max ${tierRule.maxTickets} tickets.`);
    }

    const zoneId = dto.seatZoneId ?? event.seatMap.zones[0]?.id;
    if (!zoneId) {
      throw new BadRequestException("Seat zone not provided.");
    }
    const zone = this.seatMap.getZone(event, zoneId);
    const total = this.pricing.calculateTotal(event, zone, dto.tickets, dto.discountCode ? 10 : 0);

    const bookingId = crypto.randomUUID();
    const ticketPdf = this.tickets.generateTicketPdf(event, dto.tickets, dto.customerName);
    this.tickets.storeTicket(bookingId, ticketPdf.buffer);

    this.notifications.send("in_app", {
      message: `Booking confirmed for ${event.title}.`,
      userId: dto.customerEmail
    });
    this.notifications.send("sms", {
      message: `Your booking for ${event.title} is confirmed.`,
      phone: dto.customerPhone
    });
    this.notifications.send("email", {
      message: `Your tickets for ${event.title} are attached.`,
      subject: "Your BookSphere Tickets",
      email: dto.customerEmail,
      attachmentName: ticketPdf.fileName,
      attachmentBuffer: ticketPdf.buffer
    });

    return this.tickets.toBookingResult(bookingId, total, event.currency, ticketPdf.fileName);
  }

  @Post("preferences")
  async savePreference(@Body() dto: PreferenceDto): Promise<{ schedule: string[] }> {
    this.reminders.addPreference(dto.userId, dto.eventId);
    const events = await this.contentstack.getEvents();
    const event = events.find((item) => item.id === dto.eventId);
    if (!event) {
      throw new BadRequestException("Event not found.");
    }
    const schedule = this.reminders.buildReminderSchedule(event.schedule.startAt);
    schedule.forEach((item) => {
      this.notifications.send("in_app", {
        userId: dto.userId,
        message: `Tickets for ${event.title} open in ${item.minutesBefore} minutes.`
      });
    });
    return { schedule: schedule.map((item) => item.at) };
  }

  @Get("notifications/inbox")
  getInAppInbox() {
    return this.notifications.getInbox();
  }

  @Get("tickets/:bookingId")
  getTicket(@Param("bookingId") bookingId: string) {
    const ticket = this.tickets.getTicket(bookingId);
    if (!ticket) {
      throw new BadRequestException("Ticket not found.");
    }
    return ticket;
  }
}

