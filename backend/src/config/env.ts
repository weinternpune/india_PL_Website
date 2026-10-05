import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'india_pl_super_secret_jwt_key_2026_operations_secure',
  jwtExpiresIn: '7d',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173')
    .split(',')
    .map((o) => o.trim()),
  dataFilePath: path.resolve(process.env.DATA_FILE_PATH || './data/database.json'),
};
