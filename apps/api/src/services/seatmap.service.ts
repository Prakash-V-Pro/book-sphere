import { Injectable } from "@nestjs/common";
import type { Event, SeatZone } from "@shared/types";

@Injectable()
export class SeatMapService {
  getZone(event: Event, zoneId: string): SeatZone {
    const zone = event.seatMap.zones.find((item) => item.id === zoneId);
    if (!zone) {
      throw new Error("Invalid seat zone");
    }
    return zone;
  }
}

