import express from "express";
import dotenv from "dotenv";
import connectDB from "./Confiq/db.js";
import morgan from "morgan";
import cors from "cors";
import Routes from "./Routes/index.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/", Routes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Expense Tracker </h1>");
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
