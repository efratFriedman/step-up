import { MongoClient, Db } from "mongodb"

if (!process.env.DB_CONNECT) {
    throw new Error("Missing DB_CONNECT environment variable");
}

const uri = process.env.DB_CONNECT;

let client: MongoClient;
let db: Db;

declare global {
    var mongo: {
        client: MongoClient;
        db: Db;
    } | undefined;
}


if (!globalThis.mongo) {
    client = new MongoClient(uri);
    db = client.db("StepUp");
    globalThis.mongo = { client, db };
}
else {
    ({ client, db } = globalThis.mongo);
}


export { client, db };