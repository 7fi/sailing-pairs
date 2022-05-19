const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const {google} = require('googleapis');

// For development
const dotenv = require('dotenv').config();
// const keys = require("../sailing-pairs/");

//Import pairs datastructure model
const Pairs = require('./models/Pairs');
const PairsBackup = require('./models/PairsBackup');

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

const client = new google.auth.JWT(
    process.env.client_email, 
    null, 
    process.env.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err,tokens){
    if(err){
        console.log(err);
        return;
    }else{
        console.log("Connected");
        // teams = gsrun(client, "'Analysis'!U2:U35");
        // scores = gsrun(client, "'Analysis'!V2:V107");
    }
});

async function gsrun(cl, range){
    const gsapi = google.sheets({version:'v4', auth: cl});

    var opt = {
        spreadsheetId: '1B56mAoBHFct_xcUB9ZWt-GHA1s2Kmbmc_LiiyABxlpY',
        range: range
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    return data.data.values;
} 

async function test(){
    console.log(await gsrun(client, "'scores'!H4:H46"));
}

// Handle post request for creating a saved pairing list
app.post('/pairs', async (req,res) => {
    console.log(req.body);

    var pairs = req.body;
    if(req.body.name.length < 30){
        const saverPairs = new Pairs(pairs);
        const saverPairs2 = new PairsBackup(pairs);
        await saverPairs.save();
        await saverPairs2.save();
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

app.get('/scores', async(req,res) =>{
    res.json({body: await gsrun(client, "'back'!A2:B46"), test: await gsrun(client, "'scores'!A2:AG47"), labels: await gsrun(client,"'scores'!A2:A47")})
})