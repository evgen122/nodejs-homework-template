import User from "../models/User.js";

import {HttpError} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";

const signup = async (req, res) => {
  const newUser = await User.create(req.body);
  res.json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export default {
  signup: ctrlWrapper(signup),
};
