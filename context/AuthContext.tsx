"use client"
import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { AccountType } from "@/types";
import { changeStatusActiveAccount } from "@/utils/firestore";


interface AuthContextType {
  currentUser: AccountType,
  logout: () => void,
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: {
    avatar: "",
    displayName: "",
    email: "",
    uid: "",
  },
  logout() {
    
  },
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [currentUser, setCurrentUser] = useState<AccountType>({
    avatar: "",
    displayName: "",
    email: "",
    uid: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // console.log(user);
      if (user) {
        const { displayName, photoURL, email, uid } = user;
        const account: AccountType = {
          avatar: photoURL,
          displayName,
          email,
          uid,
        };
        setCurrentUser(account);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const logout = () => {
    auth.signOut();
    changeStatusActiveAccount(currentUser.uid);
    setCurrentUser({
      avatar: "",
      displayName: "",
      email: "",
      uid: "",
    })
  }

  return (
    <AuthContext.Provider value={{currentUser, logout}}>{children}</AuthContext.Provider>
  );
};
