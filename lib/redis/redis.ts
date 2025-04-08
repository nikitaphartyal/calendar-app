import { createClient } from 'redis';

// Define types for chat history according to Gemini's expectations
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface RedisClient extends ReturnType<typeof createClient> {
  getChatHistory: (userId: string) => Promise<ChatMessage[]>;
  setChatHistory: (userId: string, history: ChatMessage[], expireInSeconds?: number) => Promise<void>;
}

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
}) as RedisClient;


// Add helper methods to the Redis client
redisClient.getChatHistory = async function(userId: string): Promise<ChatMessage[]> {
  const key = `chat:${userId}`;
  const history = await this.get(key);
  return history ? JSON.parse(history) : [];
};

redisClient.setChatHistory = async function(
  userId: string, 
  history: ChatMessage[], 
  expireInSeconds: number = 24 * 60 * 60 // 24 hours default
): Promise<void> {
  const key = `chat:${userId}`;
  await this.set(key, JSON.stringify(history), {
    EX: expireInSeconds
  });
};

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

export default redisClient;
