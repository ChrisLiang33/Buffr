const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const User = require("./models/User");
const Transfer = require("./models/Transfer");

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/signup", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    let user = await User.findOne({ phoneNumber });
    if (user) return res.status(400).json({ msg: "User already exists" });
    user = new User({
      phoneNumber,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name phoneNumber");
    res.json(users);
    console.log(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/transfer", async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    const transferAmount = parseFloat(amount);

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ msg: "Sender or receiver not found" });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    sender.balance -= transferAmount;
    receiver.balance += transferAmount;

    await sender.save();
    await receiver.save();

    const transfer = new Transfer({
      sender: senderId,
      receiver: receiverId,
      amount,
    });
    await transfer.save();

    res.json({ msg: "Transfer successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
