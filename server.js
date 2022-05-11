const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');

// For development
// const dotenv = require('dotenv').config();

//Import pairs datastructure model
const Pairs = require('./models/Pairs');

// enable express and cors
const app = express();
app.use(cors());
app.use(express.json());

// selects port if available or uses 3000
const port = process.env.PORT || 3000;

// Connect to database
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true});
const db = mongoose.connection;
db.once('open', () => app.listen(port, () => console.log(`Starting server at ${port}`))); //start server
db.on('error', (error) => console.log(error));

// Handle post request for creating a saved pairing list
app.post('/pairs', async (req,res) => {
    console.log(req.body);

    var pairs = req.body;
    if(req.body.name.length < 30){
        const saverPairs = new Pairs(pairs);
        await saverPairs.save();
    }

    res.json({status:'sucess', pairs: req.body})
})

// Handle request single saved pairing list
app.post('/getPairs', async (req, res) => {
    if(req.body.name != ''){
        Pairs.findOne({name: req.body.name}, async function (err, docs){
            console.log(docs);
            res.json({pairs:docs})
        })
    }
})

//Handle request for updated saved pairs
app.post('/getNames', async (req,res) => {
    Pairs.find({}, async function (err, docs){
        console.log(await docs);
        res.json({pairs:docs})
    })
})

// Handle request for deletion of a pair list
app.post('/delPair', async (req,res) =>{
    Pairs.deleteOne({name:req.body.name}, function (err,docs){
        res.json({status:'sucess'})
    })
})