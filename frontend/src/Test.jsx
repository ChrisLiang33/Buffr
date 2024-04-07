import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
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

const Test = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [userEmails, setUserEmails] = useState([]);

  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(
          doc(getFirestore(), "users", currentUser.uid)
        );
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);
          setUserData(userData);
        } else {
          console.log("User document does not exist");
        }
      } else {
        setUserData(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    const fetchUserEmails = async () => {
      try {
        const usersSnapshot = await getDocs(
          collection(getFirestore(), "users")
        );
        const emails = usersSnapshot.docs.map((doc) => doc.data().email);
        setUserEmails(emails);
      } catch (error) {
        console.error("Error fetching user emails:", error);
      }
    };

    fetchUserEmails();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(getFirestore(), "users", user.uid), {
        email: user.email,
        balance: 1000,
      });
      alert("User created successfully!");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Sign-in successful!");
    } catch (error) {
      console.error(error.message);
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google sign-in successful!");
    } catch (error) {
      console.error(error.message);
      alert("An error occurred during Google sign-in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.message);
      alert("An error occurred during sign-out. Please try again.");
    }
  };

  // ... (handleSignUp, handleSignIn, handleGoogleSignIn, handleSignOut functions remain the same)

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const recipientQuery = query(
        collection(getFirestore(), "users"),
        where("email", "==", recipientEmail)
      );
      const recipientSnapshot = await getDocs(recipientQuery);
      if (recipientSnapshot.empty) {
        alert("Recipient not found!");
        return;
      }
      const recipientDoc = recipientSnapshot.docs[0];
      const recipientData = recipientDoc.data();

      const senderBalance = userData.balance - Number(amount);
      const recipientBalance = recipientData.balance + Number(amount);

      if (senderBalance < 0) {
        alert("Insufficient balance!");
        return;
      }

      await updateDoc(doc(getFirestore(), "users", user.uid), {
        balance: senderBalance,
      });
      await updateDoc(recipientDoc.ref, {
        balance: recipientBalance,
      });

      setUserData({ ...userData, balance: senderBalance });
      setRecipientEmail("");
      setAmount("");
      alert("Transfer successful!");
    } catch (error) {
      console.error(error.message);
      alert("An error occurred during transfer. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {user ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h2>
            {userData && (
              <h3 className="text-xl font-bold mb-4">
                Balance: {userData.balance}$
              </h3>
            )}
            <form onSubmit={handleTransfer} className="space-y-4 mb-4">
              <div>
                <label
                  htmlFor="recipientEmail"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Recipient Email
                </label>
                <select
                  id="recipientEmail"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select recipient</option>
                  {userEmails
                    .filter((email) => email !== user.email)
                    .map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Transfer
              </button>
            </form>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            <form
              onSubmit={isSignUp ? handleSignUp : handleSignIn}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>
            <p className="text-center mt-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 hover:text-blue-600 font-bold"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
            <div className="text-center mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign in with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Test;
