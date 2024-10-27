import mongoose from "mongoose";
import User from "../models/UsersModel.js";

// creating a new database for a user - ALSO VALID
// export const createDatabase2 = async(req,res)=>{
// const{_id , dbName} = req.body; //here _id is of the user
//to create a new database for a user , you need to first find that user
// const user = await User.findById(_id);//the right user is ofund here
// user.databases.push({dbName : dbName , collections : []});
//remember to save after push
//     await user.save(); 
//     res.json(`${dbName} database created !`);
// }

{
    /* 
    {
    "_id": "6708117b12b5dc532a578207",
    "userName": "Parth 1 new",
    "databases": [
        {
            "dbName": "Parth-database-1",
            "collections": [
                {
                    "collectionName": "Parth-collection-1",
                    "documents": [],
                    "_id": "670845a3d0030787a4915dbb"
                }
            ],
            "_id": "670830198b2bde1558407f39"
        },
        {
            "dbName": "Parth-database-2",
            "collections": [
                {
                    "collectionName": "Parth-collection-2",
                    "documents": [],
                    "_id": "67084563d0030787a4915db5"
                },
                {
                    "collectionName": "Psk new collection",
                    "documents": [
                        "a",
                        "b"
                    ],
                    "_id": "67093fdc0dae48a79bcaa199"
                }
            ],
            "_id": "670830458b2bde1558407f3d"
        }
    ],
    "__v": 4
}
    */
}


//creating new database
export const createDatabase = async (req, res) => {
    const { _id, dbName } = req.body;
    const dbExists = await User.findOne({ _id: _id, "databases.dbName": dbName })
    if (dbExists) {
        const dbId = dbExists.databases.find(d => d.dbName == dbName)._id;
        return res.json(dbId);
    }
    const db = await User.findOneAndUpdate({ _id: _id }, { $push: { databases: { dbName: dbName, collections: [] } } }, { new: true, upsert: false })
    console.log(db);
    const dbId = db.databases.find(d => d.dbName == dbName)._id; 
    res.json(dbId);
}

//read all databases 
export const readDatabases = async (req, res) => {
    const { _id } = req.params;
    const db = await User.findById(_id);
    res.json(db.databases); 
}

//updating database contents 
export const updateDb = async (req, res) => {
    const { _id, dbId, document } = req.body;
    const db = await User.findOneAndUpdate(
        { _id: _id, "databases._id": dbId },
        { $set: { "databases.$": document } }
    )
    res.json(`database was updated !`);
}

//updatating database name 
export const changeDbName = async (req, res) => {
    const { _id, dbId, newDbName } = req.body;
    const db = await User.findOneAndUpdate(
        { _id: _id, "databases._id": dbId },
        { $set: { "databases.$[db].dbName": newDbName } },       
        { arrayFilters: [{ "db._id": dbId }] }
    )
    res.json(db);
}

//deleting database
export const deleteDb = async (req, res) => {
    const { _id, dbId } = req.body;
    const db = await User.findOneAndUpdate(
        { _id: _id, "databases._id": dbId },
        { $pull: { databases: { _id: dbId } } },
        { upsert: false }
    )
    res.json(` database is deleted`);
}

//COLLECTION METHODS

//creating a new collection
export const createCollection = async (req, res) => {
    const { _id, dbId, collectionName } = req.body;
    const collExists = await User.findOne({ _id: _id, "databases._id": dbId, "databases.collections.collectionName": collectionName })
    if (collExists) {
        const collId = collExists.databases.find(db => db._id == dbId).collections.find(collection => collection.collectionName == collectionName)._id
        return res.json(collId);
    } 
    const coll = await User.findOneAndUpdate(
        { _id: _id, "databases._id": dbId },
        { $push: { "databases.$[db].collections": { collectionName: collectionName, documents: [] } } },
        { arrayFilters: [{ "db._id": dbId }], new: true }
    )
    const collId = coll.databases.find(db => db._id == dbId).collections.find(collection => collection.collectionName == collectionName)._id
    res.json(collId);
}

//read all collections
export const readCollections = async (req, res) => {
    const { _id, dbId } = req.body;
    const user = await User.findById(_id);
    const db = user.databases.find((ele) => ele._id == dbId)
    res.json(db.collections);
}

//updating collection contents
export const updateColl = async (req, res) => {
    const { _id, dbId, document } = req.body;
    await User.findOneAndUpdate(
        { _id: _id, "databases._id": dbId },
        { $set: { "databases.$.collections": document } }
    )
    res.json('collection was successfully updated !');
} 

//updating colection name
export const changeCollName = async (req, res) => {
    const { _id, dbId, collId, newCollName } = req.body;  
    await User.findOneAndUpdate(
        { _id: _id, "databases._id": dbId, "databases.collections._id": collId },
        { $set: { "databases.$[db].collections.$[coll].collectionName": newCollName } },
        { arrayFilters: [{ "db._id": dbId }, { "coll._id": collId }] }
    )
    res.json(`Collection name changed to ${newCollName}`);
}

//deleting a collection 
export const deleteColl = async (req, res) => {
    const { _id, dbId, collId } = req.body;
    await User.findOneAndUpdate(
        { _id: _id, "databases._id": dbId, "databases.collections._id": collId },
        { $pull: { "databases.$.collections": { _id: collId } } }
    )
    res.json(`collection was deleted !`);
}