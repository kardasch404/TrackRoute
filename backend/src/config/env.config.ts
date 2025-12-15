import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT ),
  mongodb: {
    uri: process.env.MONGODB_URI ,
  },
  redis: {
    url: process.env.REDIS_URL ,
  },
  jwt: {
    secret: process.env.JWT_SECRET ,
    expiresIn: process.env.JWT_EXPIRES_IN ,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT ,
    port: parseInt(process.env.MINIO_PORT) ,
    accessKey: process.env.MINIO_ACCESS_KEY ,
    secretKey: process.env.MINIO_SECRET_KEY ,
    bucket: process.env.MINIO_BUCKET ,
  },
};
