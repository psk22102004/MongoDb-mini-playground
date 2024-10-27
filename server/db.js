
import mongoose from "mongoose";

const dbConnect = async()=>{
    //await mongoose.connect('mongodb://localhost:27017/crud3');
     await mongoose.connect('mongodb+srv://itsparthkadam22:parthkadam22@democluster.dieau.mongodb.net/?retryWrites=true&w=majority&appName=DemoCluster');
     
}

export default dbConnect;