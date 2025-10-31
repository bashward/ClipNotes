import { useState, useEffect } from 'react'
import { auth, signOut as _signOut } from './firebase-init';

import {
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
     

    if (!authState) {
      setAuthUser(null);
      setLoading(false)
      return;
    }


    var formattedUser = formatAuthUser(authState);

    setAuthUser(formattedUser);

    setLoading(false);

  };

   const signOut = async () => {
    try {
      await _signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  };

const getIdToken = async (forceRefresh = false) => {
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(forceRefresh);
        return token;
      } else {
        console.warn("No authenticated user found");
        return null;
      }
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
    }
  };

  const onAuthStateChanged = (cb) => {
     return _onAuthStateChanged(auth, cb);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authStateChanged);

  //    if (auth.currentUser) {
  //   authStateChanged(auth.currentUser);
  // }

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signOut,
    getIdToken
  };
}