import { z } from 'zod';

/**
 * Tracking schema for user tracking data
 */
export const trackingSchema = z.object({
  userIp: z.string().optional(),
  userAgent: z.string().optional(),
  fullUrl: z.string().url().optional(),
  deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  geo: z
    .object({
      country: z.string().optional(),
      region: z.string().optional(),
      city: z.string().optional(),
      timezone: z.string().optional(),
      lat: z.number().optional(),
      lon: z.number().optional(),
    })
    .optional(),
  sub1: z.string().optional(),
  sub2: z.string().optional(),
  sub3: z.string().optional(),
  sub4: z.string().optional(),
  sub5: z.string().optional(),
  sub6: z.string().optional(),
  sub7: z.string().optional(),
  sub8: z.string().optional(),
  sub9: z.string().optional(),
  sub10: z.string().optional(),
  metadata: z
    .object({
      browser: z.string().optional(),
      os: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});

/**
 * Base application form data schema
 * Flexible structure to accept any fields dynamically
 */
export const applicationFormDataSchema = z
  .object({
    loanType: z.enum(['personal', 'business']).optional(),
    amount: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .catchall(z.any()); // Allow any additional fields

/**
 * Full application schema (for completion)
 * All required fields must be present
 */
export const applicationFullSchema = z
  .object({
    loanType: z.enum(['personal', 'business']),
    amount: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    formData: applicationFormDataSchema.optional(),
  })
  .merge(trackingSchema);

/**
 * Partial application schema (for updates)
 * All fields are optional
 */
export const applicationPartialSchema = applicationFullSchema.partial();

/**
 * Type exports
 */
export type TrackingData = z.infer<typeof trackingSchema>;
export type ApplicationFormData = z.infer<typeof applicationFormDataSchema>;
export type ApplicationFullData = z.infer<typeof applicationFullSchema>;
export type ApplicationPartialData = z.infer<typeof applicationPartialSchema>;

