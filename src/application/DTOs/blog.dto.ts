import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  published: boolean;
}
