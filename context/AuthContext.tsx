"use client";
import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { AccountType, User } from "@/types";
import { changeStatusActiveAccount } from "@/utils/firestore";

interface AuthContextType {
  currentUser: User;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: {
    avatar: "",
    displayName: "",
    email: "",
    uid: "",
    dateUse: "",
    isActive: false,
  },
  logout() { },
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User>({
    avatar: "",
    displayName: "",
    email: "",
    uid: "",
    dateUse: "",
    isActive: false
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // console.log(user);
      if (user) {
        const { displayName, photoURL, email, uid } = user;
        const account: User = {
          avatar: photoURL,
          displayName,
          email,
          uid,
          dateUse: "",
          isActive: false
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
      dateUse: "",
      isActive: false
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
