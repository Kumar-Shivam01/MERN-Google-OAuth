const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 8080;
const mongoose = require('mongoose')
const authRouter = require('./routes/authRouter')
const cors = require('cors')

app.use(cors());
cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST'],
    credentials: true
})
app.use(express.json())

app.listen(port, () => {
    console.log(`server running on: http://localhost:${port}`);
})
app.use('/auth',authRouter)

app.get('/', (req, res) => {
    res.send("<h1>HELLO WORLD!</h1>")
})
mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db connected successfully!")
}).catch((err)=>{
    console.log("Error connecting to db: ",err)
})
   

