import { MongoClient } from "mongodb";
const MONGO_URL = process.env.MONGO_DATABASE_URL || "";

let cachedDb: MongoClient;

export function getDatabase(): Promise<MongoClient> {
  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }
  return MongoClient.connect(MONGO_URL).then((db) => {
    cachedDb = db;
    return cachedDb;
  });
}
