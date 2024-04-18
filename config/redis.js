const { createClient } = require("redis");

/* The above code connects to localhost on port 6379. To connect to a different host or port, use a connection string in the format 
redis[s]://[[username][:password]@][host][:port][/db-number]:
*/

let redisClient;
const redisUrl = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`;

try {
  redisClient = createClient({
    url: redisUrl,
  });
} catch (error) {
  console.error("Invalid Redis URL !");
}

exports.client = redisClient;

exports.redisInit = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully !");
  } catch (error) {
    console.log("Redis connection error", error);
  }
};
