import multer from "multer";
import path from "path";
import {HttpError} from "../helpers/index.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    const uniquePreffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePreffix + "-" + file.originalname);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  const extention = req.originalname.split(".").pop();
  if (extention === "exe") {
    cb(HttpError(400, ".exe not valid extention"));
  }
};

const upload = multer({
  storage,
  limits,
  //   fileFilter,
});

export default upload;
