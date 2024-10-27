
import express from "express";
import cors from 'cors';
import dbConnect from "./db.js";
import CollectionRoutes from "./routes/CollectionRoutes.js";

//connect the database first
dbConnect();

const app = express();
 
//middlewares
app.use(cors());
app.use(express.json());

app.use('/api' , CollectionRoutes)

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
  });

app.listen('3001' , ()=>{
    console.log("Server Running on 3001")
})