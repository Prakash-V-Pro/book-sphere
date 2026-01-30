import { Controller, Get, Param, Query } from "@nestjs/common";
import type { Event } from "@shared/types";
import { ContentstackService } from "../services/contentstack.service";

@Controller("events")
export class EventController {
  constructor(private readonly contentstack: ContentstackService) {}

  @Get()
  async getEvents(
    @Query("interests") interests?: string,
    @Query("location") location?: string
  ): Promise<Event[]> {
    const events = await this.contentstack.getEvents();
    const interestList = interests ? interests.split(",").map((item) => item.trim()) : [];
    const locationValue = location?.toLowerCase();

    return events.filter((event) => {
      const matchesInterest = interestList.length
        ? event.tags.some((tag) => interestList.includes(tag))
        : true;
      const matchesLocation = locationValue
        ? event.venue.country.toLowerCase().includes(locationValue) ||
          event.venue.city.toLowerCase().includes(locationValue)
        : true;
      return matchesInterest && matchesLocation;
    });
  }

  @Get(":id")
  async getEvent(@Param("id") id: string): Promise<Event | undefined> {
    const events = await this.contentstack.getEvents();
    return events.find((event) => event.id === id);
  }
}

