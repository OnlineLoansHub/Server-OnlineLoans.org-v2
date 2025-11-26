import { Request } from 'express';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export interface GeoData {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
}

export interface UserAgentData {
  browser: string;
  os: string;
}

/**
 * Extract IP address from request headers
 * Checks x-forwarded-for, x-real-ip, and req.ip
 */
export function extractIp(req: Request): string {
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
 * Detect device type from user agent
 */
export function detectDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  const parser = new UAParser(userAgent);
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
 * Parse sub1-sub10 parameters from URL query string
 */
export function parseSubs(url: string): Record<string, string> {
  const subs: Record<string, string> = {};
  try {
    const urlObj = new URL(url);
    for (let i = 1; i <= 10; i++) {
      const subValue = urlObj.searchParams.get(`sub${i}`);
      if (subValue) {
        subs[`sub${i}`] = subValue;
      }
    }
  } catch (error) {
    // Invalid URL, return empty object
  }
  return subs;
}

/**
 * Lookup geo location from IP address
 */
export function geoLookup(ip: string): GeoData {
  // Skip localhost and private IPs
  if (
    ip === 'unknown' ||
    ip === '::1' ||
    ip === '127.0.0.1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.')
  ) {
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
  } catch (error) {
    return {};
  }
}

/**
 * Parse user agent to extract browser and OS information
 */
export function parseUserAgent(userAgent: string): UserAgentData {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    browser: browser.name && browser.version
      ? `${browser.name} ${browser.version}`
      : 'Unknown',
    os: os.name && os.version
      ? `${os.name} ${os.version}`
      : 'Unknown',
  };
}

/**
 * Extract full URL from request
 */
export function extractFullUrl(req: Request): string {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'unknown';
  const originalUrl = req.originalUrl || req.url || '';
  return `${protocol}://${host}${originalUrl}`;
}

