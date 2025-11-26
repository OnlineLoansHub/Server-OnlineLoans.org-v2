"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationPartialSchema = exports.applicationFullSchema = exports.applicationFormDataSchema = exports.trackingSchema = void 0;
const zod_1 = require("zod");
/**
 * Tracking schema for user tracking data
 */
exports.trackingSchema = zod_1.z.object({
    userIp: zod_1.z.string().optional(),
    userAgent: zod_1.z.string().optional(),
    fullUrl: zod_1.z.string().url().optional(),
    deviceType: zod_1.z.enum(['mobile', 'desktop', 'tablet']).optional(),
    geo: zod_1.z
        .object({
        country: zod_1.z.string().optional(),
        region: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        timezone: zod_1.z.string().optional(),
        lat: zod_1.z.number().optional(),
        lon: zod_1.z.number().optional(),
    })
        .optional(),
    sub1: zod_1.z.string().optional(),
    sub2: zod_1.z.string().optional(),
    sub3: zod_1.z.string().optional(),
    sub4: zod_1.z.string().optional(),
    sub5: zod_1.z.string().optional(),
    sub6: zod_1.z.string().optional(),
    sub7: zod_1.z.string().optional(),
    sub8: zod_1.z.string().optional(),
    sub9: zod_1.z.string().optional(),
    sub10: zod_1.z.string().optional(),
    metadata: zod_1.z
        .object({
        browser: zod_1.z.string().optional(),
        os: zod_1.z.string().optional(),
        referrer: zod_1.z.string().optional(),
    })
        .optional(),
});
/**
 * Base application form data schema
 * Flexible structure to accept any fields dynamically
 */
exports.applicationFormDataSchema = zod_1.z
    .object({
    loanType: zod_1.z.enum(['personal', 'business']).optional(),
    amount: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
})
    .catchall(zod_1.z.any()); // Allow any additional fields
/**
 * Full application schema (for completion)
 * All required fields must be present
 */
exports.applicationFullSchema = zod_1.z
    .object({
    loanType: zod_1.z.enum(['personal', 'business']),
    amount: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    formData: exports.applicationFormDataSchema.optional(),
})
    .merge(exports.trackingSchema);
/**
 * Partial application schema (for updates)
 * All fields are optional
 */
exports.applicationPartialSchema = exports.applicationFullSchema.partial();
