import mongoose from "mongoose";
import User from "../models/UsersModel.js";

// To create a new document
export const createDoc = async (req, res) => {
  const { _id, dbId, collId, documentData } = req.body;
  console.log(`data received by createDoc method: ${documentData}`);

  try {
    // Directly parsing the documentData once (avoiding redundant operations)
    const parsedDocumentData = JSON.parse(documentData);

    // Using `findOneAndUpdate` with $push and arrayFilters to insert the document
    const result = await User.findOneAndUpdate(
      { _id, "databases._id": dbId, "databases.collections._id": collId },
      { $push: { "databases.$[db].collections.$[coll].documents": parsedDocumentData } },
      { arrayFilters: [{ "db._id": dbId }, { "coll._id": collId }] }
    );

    res.json("Document was successfully pushed in the collection!");
  } catch (err) {
    res.status(500).json({ message: "Error creating document", error: err.message });
  }
};

// To read the complete documents array
export const readDoc = async (req, res) => {
  const { _id, dbId, collId } = req.body;
  try {
    // Using lean() for performance as we are not updating or modifying the result
    const user = await User.findById(_id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // Extracting the document list directly using array filters
    const db = user.databases.find(db => db._id.toString() === dbId);
    if (!db) return res.status(404).json({ message: "Database not found" });

    const coll = db.collections.find(coll => coll._id.toString() === collId);
    if (!coll) return res.status(404).json({ message: "Collection not found" });

    res.json(coll.documents); // Return documents directly
  } catch (err) {
    res.status(500).json({ message: "Error reading documents", error: err.message });
  }
};

// To update a document
export const updateDoc = async (req, res) => {
  const { _id, dbId, collId, newDocument } = req.body;
  try {
    const result = await User.findOneAndUpdate(
      { _id, "databases._id": dbId, "databases.collections._id": collId },
      { $set: { "databases.$[db].collections.$[coll].documents": newDocument } },
      { arrayFilters: [{ "db._id": dbId }, { "coll._id": collId }], new: true }
    );

    if (result) {
      res.json("The document is updated!");
    } else {
      res.status(404).json({ message: "Document not found or update failed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating document", error: err.message });
  }
};

// To delete a document
export const deleteDoc = async (req, res) => {
  const { _id, dbId, collId, field } = req.body;
  try {
    const result = await User.findOneAndUpdate(
      { _id, "databases._id": dbId, "databases.collections._id": collId },
      { $pull: { "databases.$[db].collections.$[coll].documents": field } },
      { arrayFilters: [{ "db._id": dbId }, { "coll._id": collId }] }
    );

    if (result) {
      res.json("Field was removed from the document!");
    } else {
      res.status(404).json({ message: "Document or field not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting document", error: err.message });
  }
};
