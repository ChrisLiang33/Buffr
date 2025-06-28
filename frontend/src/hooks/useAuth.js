import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import {
  validateEmail,
  validatePassword,
  validateAmount,
  validateRecipientEmail,
  RateLimiter,
  SessionManager,
  generateCSRFToken,
  validateCSRFToken,
} from "../utils/validation";

// Initialize rate limiter and session manager
const rateLimiter = new RateLimiter(
  parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5,
  15 * 60 * 1000 // 15 minutes
);

const sessionManager = new SessionManager(
  parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 60 * 60 * 1000 // 1 hour
);

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();

  // Generate CSRF token on mount
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, []);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(
            doc(getFirestore(), "users", currentUser.uid)
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            // Reset rate limiter on successful login
            rateLimiter.reset(currentUser.email);
            // Reset session manager
            sessionManager.reset();
          } else {
            console.log("User document does not exist");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data");
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Session timeout check
  useEffect(() => {
    const sessionCheck = setInterval(() => {
      if (user && !sessionManager.isSessionValid()) {
        handleSignOut();
        setError("Session expired. Please log in again.");
      }
    }, 60000); // Check every minute

    return () => clearInterval(sessionCheck);
  }, [user]);

  const handleSignUp = useCallback(
    async (email, password) => {
      setError(null);

      // Validate inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.error);
        return { success: false, error: emailValidation.error };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error);
        return { success: false, error: passwordValidation.error };
      }

      // Rate limiting check
      if (!rateLimiter.isAllowed(emailValidation.value)) {
        const remainingAttempts = rateLimiter.getRemainingAttempts(
          emailValidation.value
        );
        const errorMsg = `Too many attempts. Please try again later. Remaining attempts: ${remainingAttempts}`;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailValidation.value,
          passwordValidation.value
        );

        const user = userCredential.user;

        // Create user document with initial data
        await setDoc(doc(getFirestore(), "users", user.uid), {
          email: user.email,
          balance: 1000,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          csrfToken: csrfToken,
        });

        // Reset rate limiter on successful signup
        rateLimiter.reset(emailValidation.value);

        return { success: true };
      } catch (error) {
        console.error("Signup error:", error);
        const errorMessage = getFirebaseErrorMessage(error.code);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [auth, csrfToken]
  );

  const handleSignIn = useCallback(
    async (email, password) => {
      setError(null);

      // Validate inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.error);
        return { success: false, error: emailValidation.error };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error);
        return { success: false, error: passwordValidation.error };
      }

      // Rate limiting check
      if (!rateLimiter.isAllowed(emailValidation.value)) {
        const remainingAttempts = rateLimiter.getRemainingAttempts(
          emailValidation.value
        );
        const errorMsg = `Too many login attempts. Please try again later. Remaining attempts: ${remainingAttempts}`;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      try {
        await signInWithEmailAndPassword(
          auth,
          emailValidation.value,
          passwordValidation.value
        );

        // Update last login time
        if (user) {
          await updateDoc(doc(getFirestore(), "users", user.uid), {
            lastLogin: new Date().toISOString(),
            csrfToken: csrfToken,
          });
        }

        // Reset rate limiter on successful login
        rateLimiter.reset(emailValidation.value);

        navigate("/home");
        return { success: true };
      } catch (error) {
        console.error("Signin error:", error);
        const errorMessage = getFirebaseErrorMessage(error.code);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [auth, user, csrfToken, navigate]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(getFirestore(), "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(getFirestore(), "users", user.uid), {
          email: user.email,
          balance: 1000,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          csrfToken: csrfToken,
        });
      } else {
        // Update last login time
        await updateDoc(doc(getFirestore(), "users", user.uid), {
          lastLogin: new Date().toISOString(),
          csrfToken: csrfToken,
        });
      }

      navigate("/home");
      return { success: true };
    } catch (error) {
      console.error("Google signin error:", error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [auth, googleProvider, csrfToken, navigate]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setError(null);
      navigate("/");
    } catch (error) {
      console.error("Signout error:", error);
      setError("An error occurred during sign-out. Please try again.");
    }
  }, [auth, navigate]);

  const handleTransfer = useCallback(
    async (recipientEmail, amount) => {
      setError(null);

      if (!user || !userData) {
        setError("User not authenticated");
        return { success: false, error: "User not authenticated" };
      }

      // Validate CSRF token
      if (!validateCSRFToken(csrfToken, userData.csrfToken)) {
        setError("Invalid session. Please log in again.");
        return {
          success: false,
          error: "Invalid session. Please log in again.",
        };
      }

      // Validate inputs
      const recipientValidation = validateRecipientEmail(
        recipientEmail,
        user.email
      );
      if (!recipientValidation.isValid) {
        setError(recipientValidation.error);
        return { success: false, error: recipientValidation.error };
      }

      const amountValidation = validateAmount(amount);
      if (!amountValidation.isValid) {
        setError(amountValidation.error);
        return { success: false, error: amountValidation.error };
      }

      // Check if user has sufficient balance
      if (userData.balance < amountValidation.value) {
        setError("Insufficient balance");
        return { success: false, error: "Insufficient balance" };
      }

      try {
        // Find recipient
        const recipientQuery = query(
          collection(getFirestore(), "users"),
          where("email", "==", recipientValidation.value)
        );
        const recipientSnapshot = await getDocs(recipientQuery);

        if (recipientSnapshot.empty) {
          setError("Recipient not found");
          return { success: false, error: "Recipient not found" };
        }

        const recipientDoc = recipientSnapshot.docs[0];
        const recipientData = recipientDoc.data();

        // Calculate new balances
        const senderBalance = userData.balance - amountValidation.value;
        const recipientBalance = recipientData.balance + amountValidation.value;

        // Update both accounts atomically
        await updateDoc(doc(getFirestore(), "users", user.uid), {
          balance: senderBalance,
        });
        await updateDoc(recipientDoc.ref, {
          balance: recipientBalance,
        });

        // Update local state
        setUserData({ ...userData, balance: senderBalance });

        return { success: true };
      } catch (error) {
        console.error("Transfer error:", error);
        setError("An error occurred during transfer. Please try again.");
        return {
          success: false,
          error: "An error occurred during transfer. Please try again.",
        };
      }
    },
    [user, userData, csrfToken]
  );

  // Helper function to get user-friendly Firebase error messages
  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password is too weak. Please choose a stronger password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return {
    user,
    userData,
    loading,
    error,
    handleSignUp,
    handleSignIn,
    handleGoogleSignIn,
    handleSignOut,
    handleTransfer,
    clearError: () => setError(null),
    isSessionValid: () => sessionManager.isSessionValid(),
    getTimeUntilExpiry: () => sessionManager.getTimeUntilExpiry(),
  };
};
