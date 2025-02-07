// src/lib/db.js
import clientPromise from "./mongodb";

export async function getCollection(collectionName) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return db.collection(collectionName);
}
