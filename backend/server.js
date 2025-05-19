const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all requests

const PORT = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === "production", // Enables secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    },
  })
);

// Simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//Sample api
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);



// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
