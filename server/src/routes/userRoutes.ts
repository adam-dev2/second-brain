import express from "express";
import { AuthMiddleware } from "../middlewares/auth.js";
import { FetchProfile, FetchUser, FetchUserDetails } from "../controllers/userController.js";

const router = express.Router();

router.get('/',AuthMiddleware,FetchUser);
router.post('/userconfirmation',AuthMiddleware,FetchUserDetails);
router.put('/profile',AuthMiddleware,FetchProfile)

export default router;
