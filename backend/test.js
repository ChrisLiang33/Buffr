const express = require("express");
const mongoose = require("mongoose");
const AccountSchema = require("./models/account");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Account = mongoose.model("Account", AccountSchema);

app.post("/addAccount", async (req, res) => {
  // Changed route to reflect the resource being added (an account)
  try {
    const { name, email, balance } = req.body; // Destructure the expected properties from the request body
    const account = new Account({ name, email, balance });
    await account.save();
    res.status(201).send(account);
  } catch (error) {
    res.status(400).send(error);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
