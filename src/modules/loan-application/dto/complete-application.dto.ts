import { applicationFullSchema } from '../schemas/application.schemas';
import { ApplicationFullData } from '../schemas/application.schemas';

export class CompleteApplicationDto implements ApplicationFullData {
  loanType: 'personal' | 'business';
  amount: string;
  email: string;
  phone?: string;
  formData?: Record<string, unknown>;
}

