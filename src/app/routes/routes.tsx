import { SignIn, useAuth } from "@clerk/react";

import { HomePage } from "@/pages/home";

export const Routes = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn)
    return (
      <div className="flex h-screen items-center justify-center">
        <SignIn />
      </div>
    );

  return <HomePage />;
};
