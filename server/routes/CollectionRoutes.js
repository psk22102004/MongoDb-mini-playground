import { createUser, getUsers, changeUserName, deleteUser, randomShit, validateUser } from "../Controllers/UserController.js";
import { changeCollName, changeDbName, createCollection, createDatabase, deleteColl, deleteDb, readCollections, readDatabases, updateColl, updateDb } from "../Controllers/DatabaseController.js";
import express from "express";
import { createDoc, deleteDoc, readDoc, updateDoc } from "../Controllers/DocumentsController.js";

const router = express.Router();

//user methods
router.post('/randomShit' , randomShit);
router.post('/validateUser' , validateUser);
router.post('/createUser', createUser);
router.get('/getUsers', getUsers);
router.post('/changeUserName', changeUserName);
router.post('/deleteUser', deleteUser);

//database methods
router.post('/createDatabase', createDatabase);
router.get('/readDatabases/:_id', readDatabases);
router.post('/updateDb' , updateDb);
router.post('/changeDbName', changeDbName);
router.post('/deleteDb', deleteDb);

//collection methods
router.post('/createCollection', createCollection);
router.post('/readCollections' , readCollections);
router.post('/updateColl' , updateColl);
router.post('/changeCollName', changeCollName);
router.post('/deleteColl', deleteColl);

//document methods
router.post('/createDoc', createDoc);
router.post('/readDoc', readDoc);
router.post('/updateDoc', updateDoc);
router.post('/deleteDoc' , deleteDoc);

export default router;