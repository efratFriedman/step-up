// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI!;

// export async function dbConnect() {
//   if (mongoose.connection.readyState >= 1) return;
//   await mongoose.connect(MONGODB_URI);
//   console.log("✅ Connected to MongoDB Atlas");
// }
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function dbConnect() {
  // אם יש connection קיים, השתמש בו
  if (cached.conn) {
    console.log("📦 Using cached MongoDB connection");
    return cached.conn;
  }


  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000,
    };

    console.log("🔌 Creating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Connected to MongoDB Atlas");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", e);
    throw e;
  }

  return cached.conn;
}