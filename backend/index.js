const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

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

app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ msg: "User does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from header
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    req.user = decoded.id; // Assuming the decoded token contains the user ID
    next(); // Call next middleware
  });
};

app.get("/balance", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ balance: user.balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

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
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/transfer", authMiddleware, async (req, res) => {
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
