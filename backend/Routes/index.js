import express from "express";
import AuthRoute from "./AuthRoute.js";
import ExpenseRoute from "./ExpenseRoute.js";


const router = express.Router();

router.use("/auth", AuthRoute);
router.use("/expense", ExpenseRoute);

export default router;
