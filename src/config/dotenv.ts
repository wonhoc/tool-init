import dotenv from 'dotenv';
import path from 'path';

// NODE_ENV에 따라 다른 .env 파일 로드
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});