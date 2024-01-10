import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import "dotenv/config";

import User from "../models/User.js";

import {HttpError} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";

const {JWT_SECRET} = process.env;

const register = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({...req.body, password: hashPassword});

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

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
};
