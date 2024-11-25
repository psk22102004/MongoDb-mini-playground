import mongoose from "mongoose";
import User from "../models/UsersModel.js";

// Create a new database
export const createDatabase = async (req, res) => {
    const { _id, dbName } = req.body;
    
    try {
        const dbExists = await User.findOne({ _id, "databases.dbName": dbName });
        if (dbExists) {
            const dbId = dbExists.databases.find(d => d.dbName === dbName)._id;
            return res.json({ dbId, message: `${dbName} database already exists!` });
        }

        const user = await User.findOneAndUpdate(
            { _id },
            { $push: { databases: { dbName, collections: [] } } },
            { new: true, upsert: false }
        );

        const dbId = user.databases.find(d => d.dbName === dbName)._id;
        res.json({ dbId, message: `${dbName} database created successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating database", error });
    }
};

// Read all databases
export const readDatabases = async (req, res) => {
    const { _id } = req.params;

    try {
        const user = await User.findById(_id);
        res.json(user.databases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error reading databases", error });
    }
};

// Update database contents
export const updateDb = async (req, res) => {
    const { _id, dbId, document } = req.body;

    try {
        await User.findOneAndUpdate(
            { _id, "databases._id": dbId },
            { $set: { "databases.$": document } }
        );
        res.json({ message: "Database updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating database", error });
    }
};

// Change database name
export const changeDbName = async (req, res) => {
    const { _id, dbId, newDbName } = req.body;

    try {
        const db = await User.findOneAndUpdate(
            { _id, "databases._id": dbId },
            { $set: { "databases.$[db].dbName": newDbName } },
            { arrayFilters: [{ "db._id": dbId }] }
        );
        res.json({ message: `Database name changed to ${newDbName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error changing database name", error });
    }
};

// Delete database
export const deleteDb = async (req, res) => {
    const { _id, dbId } = req.body;

    try {
        await User.findOneAndUpdate(
            { _id, "databases._id": dbId },
            { $pull: { databases: { _id: dbId } } }
        );
        res.json({ message: "Database deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting database", error });
    }
};

// Create a new collection
export const createCollection = async (req, res) => {
    const { _id, dbId, collectionName } = req.body;

    try {
        const collExists = await User.findOne({ _id, "databases._id": dbId, "databases.collections.collectionName": collectionName });
        if (collExists) {
            const collId = collExists.databases.find(db => db._id === dbId)
                                      .collections.find(coll => coll.collectionName === collectionName)._id;
            return res.json({ collId, message: `${collectionName} collection already exists!` });
        }

        const user = await User.findOneAndUpdate(
            { _id, "databases._id": dbId },
            { $push: { "databases.$[db].collections": { collectionName, documents: [] } } },
            { arrayFilters: [{ "db._id": dbId }], new: true }
        );

        const collId = user.databases.find(db => db._id === dbId)
                                  .collections.find(coll => coll.collectionName === collectionName)._id;

        res.json({ collId, message: `${collectionName} collection created successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating collection", error });
    }
};

// Read all collections
export const readCollections = async (req, res) => {
    const { _id, dbId } = req.body;

    try {
        const user = await User.findById(_id);
        const db = user.databases.find(db => db._id === dbId);
        res.json(db.collections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error reading collections", error });
    }
};

// Update collection contents
export const updateColl = async (req, res) => {
    const { _id, dbId, document } = req.body;

    try {
        await User.findOneAndUpdate(
            { _id, "databases._id": dbId },
            { $set: { "databases.$.collections": document } }
        );
        res.json({ message: "Collection updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating collection", error });
    }
};

// Change collection name
export const changeCollName = async (req, res) => {
    const { _id, dbId, collId, newCollName } = req.body;

    try {
        await User.findOneAndUpdate(
            { _id, "databases._id": dbId, "databases.collections._id": collId },
            { $set: { "databases.$[db].collections.$[coll].collectionName": newCollName } },
            { arrayFilters: [{ "db._id": dbId }, { "coll._id": collId }] }
        );
        res.json({ message: `Collection name changed to ${newCollName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error changing collection name", error });
    }
};

// Delete collection
export const deleteColl = async (req, res) => {
    const { _id, dbId, collId } = req.body;

    try {
        await User.findOneAndUpdate(
            { _id, "databases._id": dbId, "databases.collections._id": collId },
            { $pull: { "databases.$.collections": { _id: collId } } }
        );
        res.json({ message: "Collection deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting collection", error });
    }
};
