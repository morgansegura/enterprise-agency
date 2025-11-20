import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(128, { message: "Password must not exceed 128 characters" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number or special character",
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;
}
