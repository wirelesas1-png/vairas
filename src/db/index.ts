import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let client: postgres.Sql<{}> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!connectionString) {
    console.warn("WARNING: DATABASE_URL is not set. Database features will not work.");
    return null;
  }
  
  if (!client) {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    client = postgres(connectionString, { prepare: false });
    db = drizzle(client, { schema });
  }
  
  return db;
}

export { getDb };
export { schema };
