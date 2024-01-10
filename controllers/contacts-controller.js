import {HttpError} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";

import Contact from "../models/Contact.js";

const listContacts = async (req, res) => {
  const {_id: owner} = req.user;
  const {page = 1, limit = 10} = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find({owner}, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(result);
};

const contactById = async (req, res) => {
  const {contactId: _id} = req.params;
  const {_id: owner} = req.user;
  const result = await User.findOne({_id, owner});
  // const result = await Contact.findById(contactId);
  // console.log(result);
  if (!result) {
    throw (404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  // const { contactId } = req.params;
  const {contactId: _id} = req.params;
  const {_id: owner} = req.user;
  // const result = await Contact.findByIdAndUpdate(contactId, req.body);
  const result = await Contact.findOneAndUpdate({_id, owner}, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const removeContact = async (req, res) => {
  // const {contactId} = req.params;
  // const result = await Contact.findByIdAndDelete(contactId);
  const {contactId: _id} = req.params;
  const {_id: owner} = req.user;
  const result = await Contact.findOneAndDelete({_id, owner});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({message: "contact deleted"});
};

const updateStatusContact = async (req, res) => {
  const {contactId} = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export default {
  listContacts: ctrlWrapper(listContacts),
  contactById: ctrlWrapper(contactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  removeContact: ctrlWrapper(removeContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
