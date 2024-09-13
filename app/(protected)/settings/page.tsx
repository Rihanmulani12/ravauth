"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession ,signOut } from "next-auth/react";

const settingsPage = () => {
  const user = useCurrentUser()

  const signOutHandler = async () => {
      signOut
  }
  return (
    <div className="bg-white p-10 rounded-xl">
      
    
        <button onClick={signOutHandler} type="submit">Sign out</button>
      
    </div>
  );
};

export default settingsPage;
