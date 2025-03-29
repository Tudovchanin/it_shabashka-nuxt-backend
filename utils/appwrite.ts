
import { APP_ID, DB_COLLECTION_PROJECTS_ID, DB_ID } from "~/constants/app.constants";
import { Account, Client, Databases, Storage, Query, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(APP_ID);

export const account = new Account(client);
export { ID } from "appwrite";
export const DB = new Databases(client);
export const storage = new Storage(client);





