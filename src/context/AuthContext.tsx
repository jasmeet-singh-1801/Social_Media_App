// Import necessary modules and functions
import { getCurrentUser } from '@/lib/appwrite/api';
import { IUser } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the initial user object
export const INITIAL_USER = {
    id:'',
    name:'',
    username:'',
    email:'',
    imageUrl:'',
    bio: ''
};

// Define the initial state for the authentication context
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
};

// Define the type for the authentication context
type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};

// Create the authentication context
const AuthContext = createContext<IContextType>(INITIAL_STATE);

// Define the authentication provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Use the navigation hook to navigate to different pages
    const navigate = useNavigate();
    // Use the state hook to manage the user object
    const[user,setUser] = useState<IUser>(INITIAL_USER);
    // Use the state hook to manage the loading state
    const [isLoading, setIsLoading] = useState(false);
    // Use the state hook to manage the authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Define the checkAuthUser function that checks if the user is authenticated
    const checkAuthUser = async () => {
        setIsLoading(true); // Set the loading state to true
        try {
            // Call the getCurrentUser function to get the current user object
            const currentAccount = await getCurrentUser();
            if (currentAccount) { // If the user object is not null
                setUser({ // Update the user state
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                });
                setIsAuthenticated(true); // Update the authentication state

                return true; // Return true to indicate that the user is authenticated
            }

            return false; // Return false to indicate that the user is not authenticated
        } catch (error) {
            console.error(error); // Log any errors
            return false; // Return false to indicate that the user is not authenticated
        } finally {
            setIsLoading(false); // Set the loading state to false
        }
    }

    // Use the useEffect hook to check if the user is authenticated when the component mounts
    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (
            cookieFallback === "[]" ||
            cookieFallback === null ||
            cookieFallback === undefined
        ) {
            navigate("/sign-in"); // If the user is not authenticated, navigate to the sign-in page
        }

        checkAuthUser(); // Check if the user is authenticated
    }, []); // Empty dependency array to only run the effect once when the component mounts

    // Define the context value
    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    // Return the authentication context provider with the context value
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Export the authentication context
export default AuthProvider;

// Define the useUserContext hook to access the authentication context
export const useUserContext = () => useContext(AuthContext);