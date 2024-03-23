import React, { useState, useEffect } from "react";
import axios from "axios";

function TransferForm() {
  const [users, setUsers] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from backend when component mounts
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/transfer", {
        senderId,
        receiverId,
        amount,
      });
      setMessage("Transfer successful");
    } catch (error) {
      setMessage(error.response.data.msg || "An error occurred");
    }
  };

  return (
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default TransferForm;
