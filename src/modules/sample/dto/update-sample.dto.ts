import { IsOptional, IsString } from "class-validator";

export class UpdateSampleDto {
  @IsOptional()
  @IsString()
  readonly name?: string;
}
