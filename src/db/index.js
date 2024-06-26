import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToMongo = async () =>{
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`\n Mongodb connected.  Db Host: ${connectionInstance.connection.host} \n `)
        
    } catch (error) {
        console.log(`MONGODB CONNECTION ERROR : ` + error);
        process.exit(1);
    }
}

export default connectToMongo;