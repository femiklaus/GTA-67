import { MongoClient, type Db } from 'mongodb';

// Cached MongoDB connection.
// In development, Next.js clears the module cache on HMR, so we stash the
// client promise on `globalThis` to avoid opening a new connection per reload.

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'gta67';

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to .env.local (and to your host env).');
  }

  const g = globalThis as unknown as { _gta67MongoClientPromise?: Promise<MongoClient> };

  if (process.env.NODE_ENV === 'development') {
    if (!g._gta67MongoClientPromise) {
      g._gta67MongoClientPromise = new MongoClient(uri).connect();
    }
    return g._gta67MongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
