const express = require("express");
const db = require("./config/db"); // Ensure you have a folder named 'config' with db.js in it

const app = express();
const PORT = 3001;

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
