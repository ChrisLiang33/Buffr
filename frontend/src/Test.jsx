import React, { useState } from "react";
import axios from "axios";
import "./Test.css";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", {
        phoneNumber,
        password,
      });
      setMessage("User registered successfully");
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.msg);
      } else {
        setMessage("An error occurred while processing your request.");
      }
    }
  };

  return (
    <div className="App">
      <h1>User Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
