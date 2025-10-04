import { Client, Account, ID ,Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) 
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const SPRINTS_ID = process.env.EXPO_PUBLIC_APPWRITE_SPRINTS_COLLECTION_ID!;
export { ID };
