import { Client, Account, Databases, Query } from "appwrite";

const client = new Client();

client
 .setEndpoint("https://cloud.appwrite.io/v1")
 .setProject("676d3e22003aaac72a19");

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = "6772c4b500257fd9799b"; 
const USER_COLLECTION_ID = "6772c4d2001868b477fb";
const INCOME_COLLECTION_ID = "677c159d001cf9d30df4"


export async function createUserEntry(
  name: string,
  email: string,
  password: string
) {
  try {
    const user = await databases.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      "unique()", 
      { name, email, password } 
    );
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function findUserByEmail(email: string) {
  try {
    const result = await databases.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    return result.documents[0] || null; // Return
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(DATABASE_ID, USER_COLLECTION_ID, userId);
    return user;
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    return null; // Return null if the user is not found
  }
}

export async function updateUser(userId: string, updates: Record<string, any>) {
  try {
    const updatedUser = await databases.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      userId,
      updates
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

/**
 * Delete a user by their ID.
 * @param userId - The user's document ID.
 * @returns Void.
 */
export async function deleteUser(userId: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, USER_COLLECTION_ID, userId);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

// Fetch user's income data
export const getIncomeData = async (userId: string) => {
    try {
      console.log("Fetching income data for user: ", userId);
      
      const response = await databases.listDocuments(DATABASE_ID, INCOME_COLLECTION_ID, [
        Query.equal("userId", userId),
      ]);

      if (response.documents.length === 0) {
        console.log("No income data found for user:", userId);
        return null; 
      }
      
      return response.documents[0] || null;
    } catch (error) {
      console.error("Error fetching income data:", error);
      throw new Error("Failed to fetch income data");
    }
  };
  
  // Save or update income data
  export const saveIncomeData = async (
    userId: string,
    monthlyIncome: number,
    additionalIncome: number
  ) => {
    try {
      const existingData = await getIncomeData(userId);
  
      if (existingData) {
        // Update existing document
        await databases.updateDocument(
          DATABASE_ID,
          INCOME_COLLECTION_ID,
          existingData.$id,
          { monthlyIncome, additionalIncome, userId }
        );
      } else {
        // Create new document
        await databases.createDocument(DATABASE_ID, INCOME_COLLECTION_ID, "unique()", {
          userId,
          monthlyIncome,
          additionalIncome,
        });
      }
    } catch (error) {
      console.error("Error saving income data:", error);
      throw new Error("Failed to save income data");
    }
  };

export { client, account, databases};

