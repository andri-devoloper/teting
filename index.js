// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ProductRoute = require("./routers/ProductRoute");
const FileUpload = require("express-fileupload");
const db = require("./config/Database");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(FileUpload());

app.use(express.static("public"));

app.use("/api", ProductRoute);
// Route contoh

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

db.authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(5000, () => console.log("Server Up and Running..."));
