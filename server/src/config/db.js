const mongoose = require('mongoose');

let mongoMemoryServer = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinewave';
  const allowFallback = process.env.USE_IN_MEMORY_DB_FALLBACK !== 'false';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // fast timeout to fallback if daemon is not running
    });
    console.log('[Database] MongoDB Connected Successfully! ✅');
  } catch (primaryError) {
    console.warn(`[Database] Could not connect to primary MongoDB (${primaryError.message}).`);

    if (allowFallback) {
      console.log('[Database] Starting Embedded In-Memory MongoDB fallback for demo...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const memUri = mongoMemoryServer.getUri();
        await mongoose.connect(memUri);
        console.log(`[Database] Connected to Embedded MongoDB at: ${memUri} ✅`);
        console.log('[Database] Note: Data is saved in-memory for this session.');
      } catch (fallbackError) {
        console.error('[Database] In-memory MongoDB failed as well:', fallbackError.message);
        throw fallbackError;
      }
    } else {
      throw primaryError;
    }
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}

module.exports = { connectDB, disconnectDB };
