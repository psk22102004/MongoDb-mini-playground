import mongoose from "mongoose";
import User from "../models/UsersModel.js";

export const randomShit = async(req,res)=>{
    const{_id} = req.body;
    const user = await User.find({_id}); 
    console.log(user);
    res.json(user);
    }

//to validate existing or new user
export const validateUser = async (req,res)=>{ 
    const{userName , password} = req.body;
    const user = await User.findOne({userName : userName});
    if(user){
        user.password === password ? res.json({message : 'existing user' , _id : user._id}) : res.json({message :'invalid password'})        
    }
    else{
        //this is a new user
        const newUser = new User({userName , password , databases : [] });
        await newUser.save();
        res.json({message : 'new user created' , _id : newUser._id});
    }
}

//to create new user
export const createUser = async(req,res)=>{
    //req.body is going to contain the document to be added
    //req.body should be in the exact same format as the model schema 
    const user = new User(req.body);
    await user.save();
    res.json(`${req.body.userName} user is saved !`);    
}

//to get all users
export const getUsers = async(req,res)=>{
    const users = await User.find();
    const userNames = users.map(
        (ele)=>{
            return(ele.userName);
        }
    )
    res.json(userNames);
}

//userName change
export const changeUserName = async(req,res)=>{
    //extract _id from the req.body
    console.log(req.body);
    const{_id , newUserName} = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        _id , 
        {userName : newUserName } , 
        {new : true , upsert : true} //here new : true means that it will return the new document instead of old document and upsert : true means it will create a new document if this document is not found
    )
    res.json(updatedUser);
} 

//delete a user
export const deleteUser = async(req,res)=>{
    const{_id} = req.body;
    const deletedUser = await User.findByIdAndDelete(_id );
    res.json(deletedUser);
}

