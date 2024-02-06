import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import { mongoConnection } from './db.js'
import { userRouter } from './Routes/userAuth.js'

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json())





mongoConnection()

//in-built middleware for JSON
app.use(userRouter)




// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));




// Listening to server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


