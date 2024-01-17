import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";

import "dotenv/config";

import path from "path";
import fs from "fs/promises";

import User from "../models/User.js";

import {HttpError} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";

const {JWT_SECRET} = process.env;

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, {s: "250"});

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status("201");
  res.json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const {_id: id} = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});

  await User.findByIdAndUpdate(id, {token});

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const {email, subscription} = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});
  res.status("204");
  res.json({
    message: "No Content",
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "the new avatar was not transferred");
  }

  const {_id} = req.user;
  const {path: oldPath, filename} = req.file;

  const newPath = path.join(avatarsPath, filename);

  Jimp.read(oldPath, (err, avatar) => {
    if (err) {
      throw err;
    }
    avatar.resize(250, 250); // resize
    avatar.write(newPath); // save
  });

  fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, {avatarURL: avatarURL});

  res.json({
    avatarURL: avatarURL,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
