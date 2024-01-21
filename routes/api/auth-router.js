import express from "express";

import authController from "../../controllers/auth-controller.js";

import {authenticate, isEmptyBody, upload} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import {
  userEmailSchema,
  userSignupSchema,
  userUpdateAvatarSchema,
} from "../../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.register
);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post(
  "/verify",
  isEmptyBody,
  validateBody(userEmailSchema),
  authController.resendVerifyEmail
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.login
);

authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  validateBody(userUpdateAvatarSchema),
  authController.updateAvatar
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;
