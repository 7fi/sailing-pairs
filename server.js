const express = require('express');
const mongoose = require('mongoose'); 
// const dotenv = require('dotenv').config();
const cors = require('cors');

const Pairs = require('./models/Pairs');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true});
const db = mongoose.connection;
db.once('open', () => app.listen(port, () => console.log(`Starting server at ${port}`)));
db.on('error', (error) => console.log(error));

app.post('/pairs', async (req,res) => {
    console.log(req.body);

    var pairs = req.body;
    const saverPairs = new Pairs(pairs);
    await saverPairs.save();

    res.json({status:'sucess', pairs: req.body})
})

app.post('/getPairs', async (req, res) => {
    if(req.body.name != ''){
        // console.log(req.body.name);
        Pairs.findOne({name: req.body.name}, async function (err, docs){
            console.log(docs);
            res.json({pairs:docs})
        })
    }
})