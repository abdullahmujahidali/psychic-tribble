const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const mongoose = require('mongoose');

const MONGOURI = 'mongodb+srv://abdullahmujahid:abdullah786@devconnector.3uu95.mongodb.net/cb-project?'

mongoose.connect(MONGOURI, {
    useUnifiedTopology: true
})

mongoose.connection.on("connected",()=>{
    console.log("Mongoose Database Connected")
})

mongoose.connection.on("error",(err)=>{
    console.log("Error connecting to the database", err)
})

app.use(express.json())

app.listen(PORT, () => {
    console.log("Server is up and running ", PORT);
})