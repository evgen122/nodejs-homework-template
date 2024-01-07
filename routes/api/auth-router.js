import express from "express";

import authController from "../../controllers/auth-controller.js";

import {
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
  authController.signup
);

export default authRouter;
