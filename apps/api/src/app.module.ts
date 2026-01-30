import { Module } from "@nestjs/common";
import { EventController } from "./controllers/event.controller";
import { BookingController } from "./controllers/booking.controller";
import { ConfigController } from "./controllers/config.controller";
import { ContentstackService } from "./services/contentstack.service";
import { PricingService } from "./services/pricing.service";
import { SeatMapService } from "./services/seatmap.service";
import { NotificationService } from "./services/notification.service";
import { TicketService } from "./services/ticket.service";
import { ReminderService } from "./services/reminder.service";

@Module({
  controllers: [EventController, BookingController, ConfigController],
  providers: [
    ContentstackService,
    PricingService,
    SeatMapService,
    NotificationService,
    TicketService,
    ReminderService
  ]
})
export class AppModule {}

