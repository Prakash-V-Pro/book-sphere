import { IsBoolean, IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import type { TierKey } from "@shared/types";

export class BookingRequestDto {
  @IsString()
  @IsNotEmpty()
  eventId!: string;

  @IsInt()
  @Min(1)
  @Max(25)
  tickets!: number;

  @IsIn(["tier1", "tier2", "normal"])
  tier!: TierKey;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @IsBoolean()
  parking!: boolean;

  @IsOptional()
  @IsString()
  discountCode?: string;

  @IsOptional()
  @IsString()
  seatZoneId?: string;
}

