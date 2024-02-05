import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
dotenv.config()
import { mongoConnection } from './db.js'
import { userRouter } from './Routes/userAuth.js'

app.use(cors());
const PORT = process.env.PORT || 3500;
const app = express();
app.use(helmet());

mongoConnection()

//in-built middleware for JSON
app.use(express.json())
app.use(userRouter)




// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// To handle Cross Origin Resource Sharing - allowing sharing


// Listening to server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


