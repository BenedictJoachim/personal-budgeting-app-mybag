import { databases } from "./appwrite"; // Import your Appwrite database setup
import { v4 as uuid } from "uuid"; // Generates unique IDs

export const db = {
  createUser: async (data: Record<string, any>) => {
    const userId = uuid();
    return databases.createDocument("databaseId", "users", userId, data);
  },
  findUserByEmail: async (email: string) => {
    const results = await databases.listDocuments("databaseId", "users", [
      `equal("email", "${email}")`,
    ]);
    return results.documents[0] || null;
  },
  findUserById: async (id: string) => {
    return databases.getDocument("databaseId", "users", id);
  },
};
