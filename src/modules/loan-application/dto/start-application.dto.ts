import { applicationPartialSchema } from '../schemas/application.schemas';
import { ApplicationPartialData } from '../schemas/application.schemas';

export class StartApplicationDto implements ApplicationPartialData {
  loanType?: 'personal' | 'business';
  amount?: string;
  email?: string;
  phone?: string;
  formData?: Record<string, unknown>;
}

