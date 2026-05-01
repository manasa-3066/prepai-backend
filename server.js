const dotenv = require("dotenv");
dotenv.config();  // ← must be FIRST before any other require

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const corsOptions = require("./config/corsOptions");
const { errorHandler } = require("./middlewares/errorHandler");
const routes = require("./routes");

connectDB();

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use("/api", routes);

app.get("/health", (req, res) =>
  res.json({ status: "ok", env: process.env.NODE_ENV })
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

