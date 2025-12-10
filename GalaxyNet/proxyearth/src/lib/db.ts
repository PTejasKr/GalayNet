import { Pool } from '@neondatabase/serverless';

export const runtime = 'edge';

// We rely on DATABASE_URL env var, but for now we might want a default or validation.
// We will throw if not set, prompting user to set it.
const getDbUrl = () => {
    return process.env.DATABASE_URL;
};

export const getDb = () => {
    const connectionString = getDbUrl();
    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined");
    }
    return new Pool({ connectionString });
};
