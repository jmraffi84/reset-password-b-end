import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { mongoConnection } from './db.js'
import { userRouter } from './Routes/userAuth.js'


dotenv.config()


const PORT = process.env.PORT;
const app = express();
app.use(express.json())
app.use(cors());
app.use(bodyParser.json())


//for acces control errors this middile ware is used.
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


mongoConnection()

//in-built middleware for JSON
app.use(userRouter)




// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));




// Listening to server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


