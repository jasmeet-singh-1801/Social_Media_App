import {ID, Query} from 'appwrite'
import { INewUser}  from "@/types"
import { account, appwriteConfig ,avatars, databases} from "./config"
// ====================================================
// AUTH
// ====================================================

// ============================== SIGN UP
/**
* Creates a new user account the provided user details.
* @param user - An object containing user details: name, email, password, and username (optional).
* @returns The newly created user account object, or an error object if something went wrong.
*/
export async function createUserAccount(user: INewUser) {
   try {
       const newAccount = await account.create(
           ID.unique(),  // User ID. Must be unique and a UUID (version 4).
           user.email,   // User email address. Must be valid and not in use.
           user.password,
           user.name
       )
       if(!newAccount) throw Error;

       const avatarUrl = avatars.getInitials(user.name);
       const newUser = await saveUserToDB({
           accountId: newAccount.$id,
           name: newAccount.name,
           email: newAccount.email,
           username: user.username,
           imageUrl: avatarUrl,
         })
       return newUser;
   } catch (error) {
       console.log(error);
       return error;
   }
}

/**
* Saves the user to the database with the provided user details.
* @param user - An object containing user details: accountId, email, name, imageUrl, and username (optional).
* @returns The newly created user document in the database, or an error object if something went wrong.
*/
export async function saveUserToDB(user: {
   accountId: string;
   email: string;
   name: string;
   imageUrl: URL;
   username?: string;
 }) {
   try {
     const newUser = await databases.createDocument(
       appwriteConfig.databaseId,
       appwriteConfig.userCollectionId,
       ID.unique(),
       user
     )

     return newUser;
   } catch (error) {
     console.log(error);
   }
 }

// ============================== SIGN IN
/**
* Signs in the user with the provided email and password.
* @param user - An object containing email and password.
* @returns The user session object, or an error object if something went wrong.
*/
export async function signInAccount(user: { email: string; password: string }) {
 try {
   const session = await account.createEmailSession(user.email, user.password);

   return session;
 } catch (error) {
   console.log(error);
 }
}

// ============================== GET USER
/**
* Retrieves the current user's account and user document from the database.
* @returns The current user object, or null if something went wrong.
*/
export async function getCurrentUser() {
 try {
   const currentAccount = await account.get();

   if (!currentAccount) throw Error;

   const currentUser = await databases.listDocuments(
     appwriteConfig.databaseId,
     appwriteConfig.userCollectionId,
     [Query.equal("accountId", currentAccount.$id)]
   )

   if (!currentUser) throw Error;

   return currentUser.documents[0];
 } catch (error) {
   console.log(error);
   return null;
 }
}