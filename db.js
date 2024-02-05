import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
export async function mongoConnection() {
    // const params = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // }
    try {
        await mongoose.connect(process.env.MONGODB_URI, params)
        console.log("Mongo database Connected")
    } catch (error) {
        console.log(error)
    }
}