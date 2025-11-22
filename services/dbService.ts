import * as duckdb from '@duckdb/duckdb-wasm';

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;
let initPromise: Promise<void> | null = null;

async function initialize() {
    try {
        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

        const worker = await duckdb.createWorker(bundle.mainWorker!);
        const logger = new duckdb.ConsoleLogger();
        
        db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        
        conn = await db.connect();
        
        // Create table for caching with patch_version
        // Changed table name to v2 to avoid conflicts with old schema
        await conn.query(`
            CREATE TABLE IF NOT EXISTS matchup_cache_v2 (
                id VARCHAR PRIMARY KEY,
                my_champ VARCHAR,
                enemy_champ VARCHAR,
                advice VARCHAR,
                created_at DOUBLE,
                patch_version VARCHAR
            )
        `);
        console.log("DuckDB initialized and table created.");
    } catch (error) {
        console.error("Failed to initialize DuckDB:", error);
    }
}

export const getDbConnection = async () => {
    if (!db || !conn) {
        if (!initPromise) {
            initPromise = initialize();
        }
        await initPromise;
    }
    return conn;
};

export const getCachedAdvice = async (myChamp: string, enemyChamp: string, currentPatch: string): Promise<string | null> => {
    try {
        const conn = await getDbConnection();
        if (!conn) return null;

        const id = `${myChamp}:${enemyChamp}`;
        
        const stmt = await conn.prepare('SELECT advice, patch_version FROM matchup_cache_v2 WHERE id = ?');
        const result = await stmt.query(id);
        const rows = result.toArray();
        await stmt.close();

        if (rows.length === 0) return null;

        const row = rows[0];
        const advice = row.advice; 
        const storedPatch = row.patch_version;
        
        // STRICT PATCH CHECK:
        // If the advice was generated on a different patch, we consider it invalid.
        if (storedPatch !== currentPatch) {
            console.log(`Cache expired: Data is from patch ${storedPatch}, current is ${currentPatch}`);
            return null;
        }

        console.log(`Cache hit for ${id} on patch ${currentPatch}`);
        return advice;
    } catch (e) {
        console.error("DuckDB Read Error", e);
        return null;
    }
};

export const saveAdviceToCache = async (myChamp: string, enemyChamp: string, advice: string, currentPatch: string) => {
    try {
        const conn = await getDbConnection();
        if (!conn) return;

        const id = `${myChamp}:${enemyChamp}`;
        const createdAt = Date.now();

        const stmt = await conn.prepare('INSERT OR REPLACE INTO matchup_cache_v2 VALUES (?, ?, ?, ?, ?, ?)');
        await stmt.send(id, myChamp, enemyChamp, advice, createdAt, currentPatch);
        await stmt.close();
        console.log(`Saved matchup ${id} to cache for patch ${currentPatch}.`);
    } catch (e) {
        console.error("DuckDB Write Error", e);
    }
};
