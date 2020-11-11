require("dotenv").config();

module.exports = {
  development: {
    host: process.env.DEV_HOST,
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_USERNAME,
    database: process.env.DEV_DATABASE,
    database_url: process.env.DEV_DATABASE_URL,
  },
  test: {
    host: process.env.TEST_HOST,
    username: process.env.TEST_USERNAME,
    password: process.env.TEST_USERNAME,
    database: process.env.TEST_DATABASE,
    database_url: process.env.TEST_DATABASE_URL,
  },
  production: {
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.USERNAME,
    database: process.env.DATABASE,
    database_url: process.env.DATABASE_URL,
  },

  secret: process.env.SECRET,
  maxMediaFileSize: process.env.MAX_MEDIA_FILE_SIZE,

  paystack: {
    secretKey: process.env.PAYSTACK_PRIVATE_KEY,
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};
