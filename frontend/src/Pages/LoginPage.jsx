import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [start, setStart] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [userEmails, setUserEmails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    user,
    userData,
    loading,
    error,
    handleSignUp,
    handleSignIn,
    handleGoogleSignIn,
    handleSignOut,
    handleTransfer,
    clearError,
  } = useAuth();

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

    if (user) {
      fetchUserEmails();
    }
  }, [user]);

  const handleFormSubmit = async (e, isSignUpForm) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      if (isSignUpForm) {
        const result = await handleSignUp(email, password);
        if (result.success) {
          alert("User created successfully!");
        }
      } else {
        const result = await handleSignIn(email, password);
        if (result.success) {
          // Navigation is handled in the hook
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    setIsSubmitting(true);
    clearError();

    try {
      const result = await handleGoogleSignIn();
      if (result.success) {
        // Navigation is handled in the hook
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      const result = await handleTransfer(recipientEmail, amount);
      if (result.success) {
        setRecipientEmail("");
        setAmount("");
        alert("Transfer successful!");
      }
    } catch (error) {
      console.error("Transfer error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <p className="text-5xl font-bold">Buffr</p>
      <p className="text-lg text-gray-500 mb-8">Your next payment companion</p>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {user ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h2>
            {userData && (
              <h3 className="text-xl font-bold mb-4">
                Balance: ${userData.balance}
              </h3>
            )}
            <form onSubmit={handleTransferSubmit} className="space-y-4 mb-4">
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                {isSubmitting ? "Processing..." : "Transfer"}
              </button>
            </form>
            <button
              onClick={handleSignOutClick}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {!start ? (
              <div className="text-center">
                <button
                  onClick={() => setStart(true)}
                  className="bg-black text-white font-bold py-4 px-8 rounded-full text-2xl focus:outline-none focus:shadow-outline hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </h2>
                <form
                  onSubmit={(e) => handleFormSubmit(e, isSignUp)}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                      minLength="8"
                    />
                    {isSignUp && (
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters with letters and
                        numbers
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                  >
                    {isSubmitting
                      ? "Processing..."
                      : isSignUp
                      ? "Sign Up"
                      : "Sign In"}
                  </button>
                </form>
                <p className="text-center mt-4">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-500 hover:text-blue-600 font-bold"
                    disabled={isSubmitting}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
                <div className="text-center mt-6">
                  <button
                    onClick={handleGoogleSignInClick}
                    disabled={isSubmitting}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                  >
                    {isSubmitting ? "Processing..." : "Sign in with Google"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
