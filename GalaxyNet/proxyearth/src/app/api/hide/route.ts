import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    // --- SECURITY CHECK START ---
    const { verifyTurnstileToken, isAllowedDomain } = await import('@/lib/security');

    if (!isAllowedDomain(request)) {
        console.error("Domain Check Failed:", request.headers.get('referer'), request.headers.get('origin'));
        return NextResponse.json({ error: "Access Denied: Domain not allowed" }, { status: 403 });
    }

    const token = request.headers.get('cf-turnstile-response');
    if (!token) {
        return NextResponse.json({ error: "Access Denied: Missing CAPTCHA token" }, { status: 403 });
    }

    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
    const isValidToken = await verifyTurnstileToken(token, ip || undefined);

    if (!isValidToken) {
        console.error("Token Verification Failed for IP:", ip);
        return NextResponse.json({ error: "Access Denied: Invalid CAPTCHA token" }, { status: 403 });
    }
    // --- SECURITY CHECK END ---

    try {
        const { value, type } = await request.json();

        if (!value || !type) {
            return NextResponse.json({ error: "Missing value or type" }, { status: 400 });
        }

        const pool = getDb();

        // 1. Ensure table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hidden_targets (
                id SERIAL PRIMARY KEY,
                value VARCHAR(255),
                type VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // 2. Remove Duplicates (Cleanup legacy bad data)
        // This is expensive to run every time, but necessary if we can't migrate.
        // We'll wrap it in a try-catch or just hope it's fast enough for small datasets.
        // Better: Try to create index. If it fails, it means duplicates exist. Then clean and retry?
        // Let's just run cleanup.
        await pool.query(`
            DELETE FROM hidden_targets a USING hidden_targets b WHERE a.id > b.id AND a.value = b.value;
        `);

        // 3. Ensure Unique Index Exists (Required for ON CONFLICT)
        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_hidden_targets_value ON hidden_targets (value);
        `);

        // 4. Insert or Ignore
        const trimmedValue = value.trim();
        await pool.query(
            `INSERT INTO hidden_targets (value, type) VALUES ($1, $2) ON CONFLICT (value) DO NOTHING`,
            [trimmedValue, type]
        );

        return NextResponse.json({ success: true, message: "Request processed successfully." });

    } catch (error) {
        console.error("Hide Data Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
