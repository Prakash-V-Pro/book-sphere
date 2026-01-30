import { IsNotEmpty, IsString } from "class-validator";

export class PreferenceDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  eventId!: string;
}

