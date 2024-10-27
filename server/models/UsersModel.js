import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password : {type : String},
    databases: [
        {
            dbName: { type: String },
            collections: [
                {
                    collectionName: { type: String },
                    documents: []
                }
            ]
        }
    ]

})

const User = mongoose.model("User", userSchema);

export default User;