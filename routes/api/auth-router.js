import express from "express";

import authController from "../../controllers/auth-controller.js";

import {
  authenticate,
  isEmptyBody,
  isEmptyBodyFavorite,
  isValidId,
} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {userSignupSchema} from "../../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.register
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.login
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;
