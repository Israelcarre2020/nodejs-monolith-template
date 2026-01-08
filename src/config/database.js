import dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: console.log,
    dialectOptions: {
      ssl: process.env.NODE_ENV === "production" ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
