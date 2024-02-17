import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
// Import custom components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

// Import validation schema
import { SignupValidation } from "@/lib/validation";

// Import user context
import { useUserContext } from "@/context/AuthContext";

// Import queries
import { userCreateUserAccount, userSignInAccount } from "@/lib/react-query/queriesAndMutations";

const SignupForm = () => {
  // Initialize hooks
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Initialize queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = userCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningInUser } = userSignInAccount();

  // Handle signup form submission
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again." });

        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });

        navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });

        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      {/* Display logo */}
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        {/* Display form title and description */}
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>

        {/* Display and handle form submission */}
        <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">
          {/* Name input field */}
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Username input field */}
          <FormField control={form.control} name="username" render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Email input field */}
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Password input field */}
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Submit button */}
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          {/* Display login link */}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;