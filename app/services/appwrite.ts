import { Client, Account, Databases, Query } from "appwrite";
import { Category, Expense } from "~/types/data-types";
import sgMail from "@sendgrid/mail";

const client = new Client();

client
 .setEndpoint("https://cloud.appwrite.io/v1")
 .setProject("676d3e22003aaac72a19");

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = "6772c4b500257fd9799b"; 
const USER_COLLECTION_ID = "6772c4d2001868b477fb";
const INCOME_COLLECTION_ID = "677c159d001cf9d30df4";
const CATEGORIES_COLLECTION_ID ="677d05b300051e724284";
const EXPENSES_COLLECTION_ID = "6772c6680009a586b8bf";

const SENDGRID_API_KEY = "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"
sgMail.setApiKey(SENDGRID_API_KEY);

// CREATING A USER ENTRY
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

// FINDING USER BY EMAIL
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

// CREATING PASSWORD RECOVERY TOKEN
export async function createPasswordRecoveryToken(email: string) { 
  const user = await findUserByEmail(email); 
  if (!user) { 
    throw new Error("User not found");
   } 
   const token = generateToken(); 
   await updateUser(user.$id, { recoveryToken: token });
   const recoveryUrl = `https://upgraded-system-7vv95967wpw9fwrw9-5173.app.github.dev/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

   await sendRecoveryEmail(email, recoveryUrl)
  } 

// Helper function to generate a token (simple implementation)
function generateToken() { 
    return Math.random().toString(36).substr(2);
   } 

async function sendRecoveryEmail(email: string, recoveryUrl: string) { 
  const msg = { 
    to: email, 
    from: "benedictorngwandu@gmail.com", 
    subject: "Password Recovery", 
    text: `You requested to reset your password. Click the link to reset your password: ${recoveryUrl}`, 
    html: `<strong>You requested to reset your password. Click the link to reset your password: <a href="${recoveryUrl}">${recoveryUrl}</a></strong>`, 
  }; 

  try { 
    await sgMail.send(msg); 
    console.log(`Recovery email sent to ${email}`); 
  } catch (error) { 
    console.error("Error sending recovery email:", error); 
    throw new Error("Failed to send recovery email"); 
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
    console.log("Updating user with ID:", userId);
    console.log("Update data:", updates);
    
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


  export async function getCategories() {
    try {
      const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID);
      return response.documents.length > 0 ? response.documents : [];
    } catch (error) {
      console.error('Error fetching category data:', error);
      return [];
    }
  }
  
  export async function saveCategories(userId: string, categories: Category[]) {
    console.log("Saving categories with user ID", userId);
    console.log("Categories", categories);
    
    
    try {
      const promises = categories.map(category => {
        const categoryData = {
          ...category,
          userId, // Include the userId in each category
        };
  
        if (category.id) {
          console.log('Updating category', categoryData);
          
          return databases.updateDocument(
            DATABASE_ID,
            CATEGORIES_COLLECTION_ID,
            category.id,
            categoryData
          );
        } else {
          console.log("Creating new category:", categoryData);
          return databases.createDocument(
            DATABASE_ID,
            CATEGORIES_COLLECTION_ID,
            'unique()', // Generate a unique document ID
            categoryData
          );
        }
      });
  
      await Promise.all(promises); // Execute all save/update operations concurrently
      return { success: true };
    } catch (error) {
      console.error('Error saving category data:', error);
      throw new Error('Failed to save categories');
    }
  }
  
  // Function to fetch expenses from Appwrite
  export async function fetchExpenses(userId: string): Promise<Expense[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        [Query.equal('userId', userId)] // Filter by userId
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        category: doc.category,
        description: doc.description,
        amount: doc.amount,
      })) as Expense[];
    } catch (error) {
      console.error('Error fetching expense data:', error);
      return [];
    }
  }

// Function to save expenses to Appwrite (create or update)
export async function saveExpenses(expenses: Expense[]): Promise<{ success: boolean }> {
  try {
    const promises = expenses.map((expense) => {
      const formattedDate = new Date(expense.date).toISOString(); // Ensure date is in ISO string format

      if (expense.id) {
        // Update existing expense
        return databases.updateDocument(
          DATABASE_ID,
          EXPENSES_COLLECTION_ID,
          expense.id, // Use the existing expense ID
          {
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            date: formattedDate,
            userId: expense.userId,
          }
        );
      } else {
        // Create a new expense
        console.log("Creating a new Expense:", expense.description);

        return databases.createDocument(
          DATABASE_ID,
          EXPENSES_COLLECTION_ID,
          "unique()",
          {
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            date: formattedDate,
            userId: expense.userId,
          }
        );
      }
    });

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error("Error saving expense data:", error);
    return { success: false };
  }
}


export { client, account, databases};

