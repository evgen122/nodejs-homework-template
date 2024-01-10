import jwt from "jsonwebtoken";

import {HttpError} from "../helpers/index.js";

import User from "../models/User.js";

const {JWT_SECRET} = process.env;

const authenticate = async (req, res, next) => {
  //   console.log(req.headers);
  const {authorization} = req.headers;
  if (!authorization) {
    console.log(authorization);
    return next(HttpError(401, "Not authorized"));
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    console.log("bearer, token");
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const {id} = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
