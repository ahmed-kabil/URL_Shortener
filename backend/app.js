const express = require("express");
const mongoose = require("mongoose");
const metrics = require('./metrics.js')
const cors = require("cors");
require('dotenv').config();


const url = process.env.DATABASE_URL ;


const app = express();
const port = process.env.PORT;
const host = process.env.HOST;




// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routers
const router = require("./router.js");
app.use("/", router);

// Connect to MongoDB
mongoose.connect(url)
  .then(() => {
    console.log("✅ Connected to the DB");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://${host}:${port}`);
    });
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));