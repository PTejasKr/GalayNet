export interface ApiResult {
    status?: boolean | string;
    data?: any;
    message?: string;
    // Mobile specific
    mobile?: string;
    operator?: string;
    circle?: string;
    // Email specific
    email?: string;
    [key: string]: any;
}

export async function checkDataLeak(query: string, type: 'mobile' | 'email', token?: string): Promise<ApiResult | null> {
    const baseUrl = "/api/check";
    const url = new URL(baseUrl, window.location.origin);

    if (type === 'mobile') {
        url.searchParams.append('mobile', query);
    } else {
        url.searchParams.append('email', query);
    }

    try {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
        };
        if (token) {
            headers['cf-turnstile-response'] = token;
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: headers,
        });

        // Special handling for Rate Limit (429)
        if (response.status === 429) {
            const data = await response.json();
            return data;
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Fetch Error:", error);
        return null;
    }
}
