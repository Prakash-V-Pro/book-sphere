import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
import type { BookingResult, Event } from "@shared/types";

@Injectable()
export class TicketService {
  private ticketStore = new Map<string, Buffer>();

  generateTicketPdf(event: Event, tickets: number, customerName: string): { fileName: string; buffer: Buffer } {
    const safeTitle = event.title.replace(/[^a-z0-9]+/gi, "_").toUpperCase();
    const datePart = new Date(event.schedule.startAt).toISOString().replace(/[:.]/g, "-");
    const fileName = `${safeTitle}_${datePart}_${tickets}.pdf`;

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    doc.fontSize(20).text("BookSphere Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Event: ${event.title}`);
    doc.text(`Venue: ${event.venue.name}, ${event.venue.address}, ${event.venue.city}`);
    doc.text(`Date: ${new Date(event.schedule.startAt).toLocaleString()}`);
    doc.text(`Tickets: ${tickets}`);
    doc.text(`Attendee: ${customerName}`);
    doc.moveDown();
    doc.fontSize(10).text("Please arrive 30 minutes early with this ticket.");
    doc.end();

    const buffer = Buffer.concat(chunks);
    return { fileName, buffer };
  }

  storeTicket(bookingId: string, buffer: Buffer): void {
    this.ticketStore.set(bookingId, buffer);
  }

  getTicket(bookingId: string): Buffer | undefined {
    return this.ticketStore.get(bookingId);
  }

  toBookingResult(bookingId: string, totalPrice: number, currency: string, pdfFileName: string): BookingResult {
    return { bookingId, totalPrice, currency, pdfFileName };
  }
}

