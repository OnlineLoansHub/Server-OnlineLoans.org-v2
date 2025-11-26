"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractIp = extractIp;
exports.extractFullUrl = extractFullUrl;
exports.extractReferrer = extractReferrer;
exports.extractOrigin = extractOrigin;
exports.detectDeviceType = detectDeviceType;
exports.parseSubsFromReferrer = parseSubsFromReferrer;
exports.geoLookup = geoLookup;
const geoip = __importStar(require("geoip-lite"));
const ua_parser_js_1 = require("ua-parser-js");
/**
 * Extract IP address from request headers
 */
function extractIp(req) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
        return ips.split(',')[0].trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        return Array.isArray(realIp) ? realIp[0] : realIp;
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
}
/**
 * Extract full URL from request including all query parameters
 */
function extractFullUrl(req) {
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'unknown';
    const originalUrl = req.originalUrl || req.url || '';
    return `${protocol}://${host}${originalUrl}`;
}
/**
 * Extract referrer from request headers
 */
function extractReferrer(req) {
    const referer = req.headers.referer || req.headers.referrer;
    if (referer) {
        return Array.isArray(referer) ? referer[0] : referer;
    }
    return '';
}
/**
 * Extract origin from request headers
 */
function extractOrigin(req) {
    const origin = req.headers.origin;
    if (origin) {
        return Array.isArray(origin) ? origin[0] : origin;
    }
    return '';
}
/**
 * Detect device type from user agent
 */
function detectDeviceType(userAgent) {
    const parser = new ua_parser_js_1.UAParser(userAgent);
    const device = parser.getDevice();
    if (device.type === 'mobile') {
        return 'mobile';
    }
    if (device.type === 'tablet') {
        return 'tablet';
    }
    return 'desktop';
}
/**
 * Parse sub1-sub10 parameters from referrer URL query string
 */
function parseSubsFromReferrer(referrer) {
    const subs = {};
    if (!referrer) {
        return subs;
    }
    try {
        const urlObj = new URL(referrer);
        for (let i = 1; i <= 10; i++) {
            const subValue = urlObj.searchParams.get(`sub${i}`);
            if (subValue) {
                subs[`sub${i}`] = subValue;
            }
        }
    }
    catch (error) {
        // Invalid URL, return empty object
    }
    return subs;
}
/**
 * Lookup geo location from IP address
 */
function geoLookup(ip) {
    // Skip localhost and private IPs
    if (ip === 'unknown' ||
        ip === '::1' ||
        ip === '127.0.0.1' ||
        ip.startsWith('192.168.') ||
        ip.startsWith('10.') ||
        ip.startsWith('172.')) {
        return {};
    }
    try {
        const geo = geoip.lookup(ip);
        if (!geo) {
            return {};
        }
        return {
            country: geo.country || undefined,
            region: geo.region || undefined,
            city: geo.city || undefined,
            timezone: geo.timezone || undefined,
            lat: geo.ll ? geo.ll[0] : undefined,
            lon: geo.ll ? geo.ll[1] : undefined,
        };
    }
    catch (error) {
        return {};
    }
}
