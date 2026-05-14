import mongoose from "mongoose";
import { MONGO_URL } from "./env";

const database = async () => {
    try{
        await mongoose.connect(MONGO_URL);

        console.log("active ini db : " + mongoose.connection.name);

        return Promise.resolve("database connections !")

    }catch(error) {
        console.log(error);
        throw error
    }
}


export default database;

