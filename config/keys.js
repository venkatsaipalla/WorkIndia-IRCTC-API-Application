const keys = {
  'admin-api-key':"123456"
  // DB_HOST: process.env.DB_HOST || "localhost",
  // DB_PORT: process.env.DB_PORT || 3306,
  // DB_USER: process.env.DB_USER || "your_db_user",
  // DB_PASSWORD: process.env.DB_PASSWORD || "your_db_password",
  // DB_DATABASE: process.env.DB_DATABASE || "your_db_name",
  // DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN, 10) || 0, // Minimum number of connections in the pool
  // DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX, 10) || 10, // Maximum number of connections in the pool
  // DB_POOL_ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
  // DB_POOL_IDLE: parseInt(process.env.DB_POOL_IDLE, 10) || 10000, // Maximum time, in milliseconds, that a connection can be idle before being released
};

export default keys;