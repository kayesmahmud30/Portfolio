import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
const client = new MongoClient(uri);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "unknown",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "default_portfolio_secret_32_characters_long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
