import { applicationPartialSchema } from '../schemas/application.schemas';
import { ApplicationPartialData } from '../schemas/application.schemas';

export class UpdateApplicationDto implements ApplicationPartialData {
  step?: number;
  loanType?: 'personal' | 'business';
  amount?: string;
  email?: string;
  phone?: string;
  formData?: Record<string, unknown>;
}

