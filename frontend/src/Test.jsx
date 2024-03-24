import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Test.css";

//log in functionality
//log out functionality
//sign up functionality
//transfer money functionality
//update info functionality
//delete account functionality

function Test() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", {
        phoneNumber,
        password,
      });
      setMessage("User registered successfully");
    } catch (error) {
      setMessage(error.response.data.msg || "An error occurred");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        phoneNumber,
        password,
      });
      const token = response.data.token;
      console.log(token);
      localStorage.setItem("token", token); // Store the token in local storage
      setLoggedIn(true);
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Invalid credentials");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      await axios.post(
        "http://localhost:5000/transfer",
        {
          senderId,
          receiverId,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Transfer successful");
    } catch (error) {
      setMessage(error.response.data.msg || "An error occurred");
    }
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div>
          <h1>User Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Sign Up</button>
            {message && <p className="message">{message}</p>}
          </form>
          <hr />
          <h1>User Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>
      ) : (
        <div>
          <h2>Transfer Money</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Sender:</label>
                <select
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                >
                  <option value="">Select Sender</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Receiver:</label>
                <select
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                >
                  <option value="">Select Receiver</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button type="submit">Transfer</button>
            </form>
          )}
          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default Test;
