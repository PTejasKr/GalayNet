import { NextRequest } from 'next/server';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAACFVoXnrI9QWcxB69M-mpWMddtQ"; // User provided secret

export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
    if (!token) return false;

    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    try {
        const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const outcome = await result.json();
        return outcome.success;
    } catch (e) {
        console.error('Turnstile verification error:', e);
        return false;
    }
}

export function isAllowedDomain(request: NextRequest): boolean {
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Allow requests if they originate from our domain
    // Or localhost for development
    const allowedDomains = ['leakdata.org', 'https://leakdata.org', 'www.leakdata.org', 'https://www.leakdata.org', '127.0.0.1', 'localhost'];

    // If Referer is present, check it
    if (referer) {
        try {
            const refererUrl = new URL(referer);
            if (!allowedDomains.some(d => refererUrl.hostname.includes(d))) return false;
        } catch { return false; } // Invalid URL
    }

    // If Origin is present, check it (usually for POST)
    if (origin) {
        try {
            const originUrl = new URL(origin);
            if (!allowedDomains.some(d => originUrl.hostname.includes(d))) return false;
        } catch { return false; }
    }

    // Usually we strictly enforce one of them being present and valid for critical APIs
    // But for "GET" requests (check API), origin might be null. Referer is typical.
    // However, some privacy tools block referer. 
    // Given the requirement "only works on leakdata.org", stricter check is better.

    // Simplest robust check:
    const source = origin || referer;
    if (!source) {
        // If no origin/referer, it might be a direct script or bot. 
        // We can block it, or verify host if it's same-origin.
        // But preventing "hackers integrate our API into their own websites" mainly means preventing CORS/embedding.
        // CORS headers "Access-Control-Allow-Origin" are what prevent browser-side integration.
        // But user asked for "domain verification inside our /api".
        return false;
    }

    // Check local dev
    if (source.includes('localhost') || source.includes('127.0.0.1')) return true;

    // Check production
    return source.includes('leakdata.org');
}
