import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mobile = searchParams.get('mobile');
    const email = searchParams.get('email');

    // --- SECURITY CHECK START ---
    const { verifyTurnstileToken, isAllowedDomain } = await import('@/lib/security');

    if (!isAllowedDomain(request)) {
        return NextResponse.json({ error: "Access Denied: Domain not allowed" }, { status: 403 });
    }

    const token = request.headers.get('cf-turnstile-response');
    if (!token) {
        return NextResponse.json({ error: "Access Denied: Missing CAPTCHA token" }, { status: 403 });
    }

    // Get IP for Turnstile (optional but good practice)
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
    const isValidToken = await verifyTurnstileToken(token, ip || undefined);

    if (!isValidToken) {
        return NextResponse.json({ error: "Access Denied: Invalid CAPTCHA" }, { status: 403 });
    }
    // --- SECURITY CHECK END ---

    const baseUrl = process.env.API_BASE_URL;

    if (!baseUrl) {
        console.error("API_BASE_URL is not defined");
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const url = new URL(baseUrl);

    if (mobile) {
        url.searchParams.append('mobile', mobile);
    }
    if (email) {
        url.searchParams.append('email', email);
    }

    try {
        // --- PRIVACY & RATE LIMIT CHECK START ---
        try {
            const pool = getDb();
            const queryValue = mobile || email;

            // 1. Ensure tables exist (Basic robust creation)
            // Ideally this is done via migration, but for this simpler setup:
            await pool.query(`
                CREATE TABLE IF NOT EXISTS daily_usage (
                    ip VARCHAR(45),
                    date DATE DEFAULT CURRENT_DATE,
                    count INTEGER DEFAULT 0,
                    PRIMARY KEY (ip, date)
                );
            `);

            // 2. Check Rate Limit
            // Get IP again cleanly (already got it above)
            const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';

            // Check count FIRST (Read-only)
            const checkResult = await pool.query(`
                SELECT count FROM daily_usage 
                WHERE ip = $1 AND date = CURRENT_DATE
            `, [clientIp]);

            const currentCount = checkResult.rows.length > 0 ? checkResult.rows[0].count : 0;
            const LIMIT = 12;

            if (currentCount >= LIMIT) {
                return NextResponse.json({ rateLimit: true }, { status: 429 });
            }

            // 3. Check Privacy (Hidden targets)
            if (queryValue) {
                const result = await pool.query(`SELECT 1 FROM hidden_targets WHERE value = $1`, [queryValue]);
                if (result.rowCount && result.rowCount > 0) {
                    return NextResponse.json({
                        status: false,
                        message: "No data found."
                    });
                }
            }

            // --- PRIVACY & RATE LIMIT CHECK END ---

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; LeakDataChecker/1.0)',
                },
            });

            if (!response.ok) {
                return NextResponse.json({ error: `External API error: ${response.status}` }, { status: response.status });
            }

            const data = await response.json();

            // 4. Increment Count ON SUCCESS (optimistic that data is valid-ish)
            // We only increment if we got a valid JSON response from the external API.
            // Even if data.status is false (no data found), we usually count it as a search?
            // User requested: "when error occurs then user's rate limit should not be counted".
            // We interpret this as: failed fetch or 500. A valid 200 OK "No Data" response usually counts in quotas.
            // BUT for user satisfaction, maybe we only count if data.status !== 'failed'?
            // Let's stick to: If API responded OK, we increment.

            // Actually, let's allow "No Data" to NOT count if the user implies "only successful finds count"?
            // "When error occurs" usually means technical error. "No data" is a result.
            // I'll increment on any 200 OK response from the provider.

            await pool.query(`
                INSERT INTO daily_usage (ip, date, count)
                VALUES ($1, CURRENT_DATE, 1)
                ON CONFLICT (ip, date)
                DO UPDATE SET count = daily_usage.count + 1
            `, [clientIp]);

            return NextResponse.json(data);

        } catch (dbError) {
            console.warn("Usage Check Skipped due to error:", dbError);
            // Fallback: Proceed without rate limit if DB fails
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; LeakDataChecker/1.0)',
                },
            });
            if (!response.ok) {
                return NextResponse.json({ error: `External API error: ${response.status}` }, { status: response.status });
            }
            return NextResponse.json(await response.json());
        }
    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
