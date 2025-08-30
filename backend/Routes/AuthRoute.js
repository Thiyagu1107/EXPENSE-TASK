import express from "express";
import {
  loginController,
} from "../Controllers/AuthController.js";
import { isAdmin, requireSignIn } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/login", loginController);


//protected User route auth
router.get("/userdashboard", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admindashboard", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
