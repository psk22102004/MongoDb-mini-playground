import mongoose from "mongoose";
import User from "../models/UsersModel.js";

//to create a new document
export const createDoc = async (req, res) => {
    const { _id, dbId, collId, documentData } = req.body;
    console.log(`data recieved by createDoc method : ${documentData}`);
    //this is string data but we want to put it as an object thats why we parse it.
    const parsedDocumentData = JSON.parse(documentData);
    await User.findOneAndUpdate( 
        { _id: _id, "databases._id": dbId, "databases.collections._id": collId },
        { $push: { "databases.$[db].collections.$[coll].documents": parsedDocumentData } },
        { arrayFilters: [{ "db._id": dbId }, { "coll._id": collId }] } 
    )
    res.json(`document was successfully pushed in the collection !`);           
}

//to read the complete documents array
export const readDoc = async (req, res) => {
    const { _id, dbId, collId } = req.body;
    const user = await User.findById(_id); //user is found here 
    const db = user.databases.find(     
        (ele) => (
            ele._id == dbId
        )
    ) // correct database is found here
    const coll = db.collections.find( 
        (ele) => (  
            ele._id == collId
        )
    ) // correct collection is found here
    const documentList = coll.documents // this is an array
    console.log(typeof documentList);
    console.log(`data sent from readDoc method is  : ${documentList}`);
    res.json(documentList);                 
}

//update a document
export const updateDoc = async (req, res) => {
    const { _id, dbId, collId , newDocument } = req.body;
    await User.findOneAndUpdate(
        {_id : _id , "databases._id" : dbId , "databases.collections._id" : collId} , 
        {$set : {"databases.$[db].collections.$[coll].documents" : newDocument}},
        {arrayFilters : [{"db._id" : dbId} , {"coll._id": collId}] , new : true}  
    )
    res.json('the document is updated !');
}

//delete a document  
export const deleteDoc = async(req,res)=>{
    const{_id , dbId , collId , field} = req.body;
    await User.findOneAndUpdate(
        {_id : _id , "databases._id" : dbId , "databases.collections._id" : collId},
        {$pull : {"databases.$[db].collections.$[coll].documents" : field}},
        {arrayFilters : [{"db._id" : dbId} , {"coll._id": collId} ]}
    )
    res.json(`field was removed from the document !`);
}