import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';

export class CreateLoanApplicationDto {
  @IsEnum(['personal', 'business'])
  @IsNotEmpty()
  loanType: 'personal' | 'business';

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  additionalData?: Record<string, unknown>;
}

