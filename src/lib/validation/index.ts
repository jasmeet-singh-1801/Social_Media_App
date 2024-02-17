// Importing the 'z' object from the 'od' library
import { z } from "zod";


// Defining a validation schema for the signup page
export const SignupValidation = z.object({
  // The 'name' field must be a string and have a minimum length of 2
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),

  // The 'username' field must be a string and have a minimum length of 2 characters
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  
  // The 'email' field must be a string in the format of an email address
  email: z.string().email(),
  
  // The 'password' field must be a string and have a minimum length of 8 characters
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

// Defining a validation schema for the signin page
export const SigninValidation = z.object({
  // The 'email' field must be a string in the format of an email address
  email: z.string().email(),
  
  // The 'password' field must be a string and have a minimum length of 8 characters
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});