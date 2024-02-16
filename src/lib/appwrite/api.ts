import {ID} from 'appwrite';
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
    try{
        const newAccount = await account.create(
            ID.unique(),  // User ID. Must be unique and a UUID (version 4).
            user.email,   // User email address. Must be valid and not in use.
            user.password,
            user.name
        );
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
          });
        return newUser;
    }catch (error){
        console.log(error);
        return error;
    }
}

// ============================== SAVE USER TO DB
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
      );
      
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }