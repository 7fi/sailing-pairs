const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cheerio = require('cheerio')
const axios = require('axios')
const { google } = require('googleapis')

// For development
const dotenv = require('dotenv').config()
// const keys = require('../sailing-pairs/')

//Import pairs datastructure model
const Pairs = require('./models/Pairs')
const PairsBackup = require('./models/PairsBackup')
const PairsOfficial = require('./models/PairsOfficial')

// enable express && cors
const app = express()
app.use(cors())
app.use(express.json())

// selects port if available || uses 3000
const port = process.env.PORT || 3000

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', () => app.listen(port, () => console.log(`Starting server at ${port}`))) //start server
db.on('error', (error) => console.log(error))

const client = new google.auth.JWT(process.env.client_email, null, process.env.private_key, ['https://www.googleapis.com/auth/spreadsheets'])

client.authorize(function (err, tokens) {
  if (err) {
    console.log(err)
    return
  } else {
    console.log('Connected')
  }
})

async function gsrun(cl, range) {
  const gsapi = google.sheets({ version: 'v4', auth: cl })

  var opt = {
    spreadsheetId: '1B56mAoBHFct_xcUB9ZWt-GHA1s2Kmbmc_LiiyABxlpY',
    range: range,
    majorDimension: 'COLUMNS',
  }

  let data = await gsapi.spreadsheets.values.get(opt)
  return data.data.values
}

async function test() {
  console.log(await getData('points', 'Barrett', undefined, undefined, undefined, undefined, 'SSP'))
  // console.log(await gsrun(client, "'scores'!H4:H46"));
}

// Handle post request for creating a saved pairing list
app.post('/pairs', async (req, res) => {
  // console.log(req.body);

  var pairs = req.body
  if (req.body.name.length < 30) {
    const saverPairs = new Pairs(pairs)
    const saverPairs2 = new PairsBackup(pairs)
    await saverPairs.save()
    await saverPairs2.save()
  }

  res.json({ status: 'sucess', pairs: req.body })
  console.log('Pairs saved')
})

// Handle post request for creating a saved pairing list
app.post('/pairsOfficial', async (req, res) => {
  // console.log(req.body);

  var pairs = req.body
  if (req.body.name.length < 30) {
    const saverPairs = new PairsOfficial(pairs)
    const saverPairs2 = new PairsBackup(pairs)
    await saverPairs.save()
    await saverPairs2.save()
  }

  res.json({ status: 'sucess', pairs: req.body })
  console.log('Pairs saved')
})
// Handle request all saved official pairs
app.post('/getPairsOfficial', async (req, res) => {
  PairsOfficial.find({}, async function (err, docs) {
    // console.log(docs);
    console.log('pairs gotten')
    res.json({ pairs: docs })
  })
})
// Handle request one saved official pair
app.post('/getPairsOfficialOne', async (req, res) => {
  if (req.body.name != '') {
    PairsOfficial.findOne({ name: req.body.name }, async function (err, docs) {
      // console.log(docs);
      console.log('pairs gotten')
      res.json({ pairs: docs })
    })
  }
})

// Handle request single saved pairing list
app.post('/getPairs', async (req, res) => {
  if (req.body.name != '') {
    Pairs.findOne({ name: req.body.name }, async function (err, docs) {
      // console.log(docs);
      console.log('pairs gotten')
      res.json({ pairs: docs })
    })
  }
})

//Handle request for updated saved pairs
app.post('/getNames', async (req, res) => {
  Pairs.find({}, async function (err, docs) {
    // console.log(await docs);
    console.log('Names gotten')
    res.json({ pairs: docs })
  })
})

// Handle request for deletion of a pair list
app.post('/delPair', async (req, res) => {
  Pairs.deleteOne({ name: req.body.name }, function (err, docs) {
    res.json({ status: 'sucess' })
  })
})

/* Unused now
// Handle request to update boat count
app.post('/BoatCount', async (req,res) =>{

    var count = req.body;
    const saverCount = new boatCount(count);
    await saverCount.save();
    
    res.json({status:'sucess', boatCount: req.body})
    console.log("Boat count saved")
})

// Handle request for boat count
app.post('/getBoatCount', async (req,res) =>{
    boatCount.find({}, async function(err,docs){
        res.json({boatCount:docs})
    })
})*/

app.post('/scores', async (req, res) => {
  // console.log(req.body);
  res.json({ body: getData(req.body.type, req.body.name, req.body.fleet, req.body.division, req.body.position, req.body.pair, req.body.regatta), labels: venues })
})

let values = []
let venues = []
let people = []

class race {
  constructor(regatta, score, fleet, fleetNum, division, position, pair) {
    this.regatta = regatta
    this.score = score
    this.fleet = fleet
    this.fleetNum = fleetNum
    this.division = division
    this.position = position
    this.pair = pair
  }
}

function getFleetNum(regatta, fleet) {
  if (regatta == 'OLY') {
    return 13
  } else if (regatta == 'OAK' && fleet == 'g') {
    return 15
  } else if (regatta == 'OAK' && fleet == 's') {
    return 18
  } else if ((regatta == 'SSP' && fleet == 'g') || fleet == 's') {
    return 30
  } else if (regatta == 'SSP' && fleet == 'z') {
    return 10
  } else if (regatta == 'BEL') {
    return 10
  } else if (regatta == 'ANA' && fleet == 'g') {
    return 17
  } else if (regatta == 'ANA' && fleet == 's') {
    return 24
  } else if (regatta == 'FLE' && fleet == 'g') {
    return 17
  } else if (regatta == 'FLE' && fleet == 's') {
    return 24
  }
}

class person {
  constructor(values) {
    this.races = []
    this.name = values[0]
    //console.log("name: " , this.name);

    for (let i = 1; i < values.length; i++) {
      if (values[i].length > 1) {
      }
      this.races.push(new race(venues[i], parseInt(values[i].replace('[', '').replace("'", '').split(',')[0]), values[i].split(',')[1], getFleetNum(venues[i], values[i].split(',')[1]), values[i].split(',')[2], values[i].split(',')[3], values[i].replace('[', '').replace("'", '').split(',')[4]))
    }
  }
}

loadVals()
async function loadVals() {
  values = await gsrun(client, "'scores'!A1:AG52")
  venues = values[0]

  for (let i = 1; i < values.length; i++) {
    people.push(new person(values[i]))
  }
}

function getData(type, name, fleet, division, position, pair, regatta) {
  let res = []
  people.forEach((x) => {
    //console.log(x.name);
    if (x.name == name && x.races != undefined) {
      tempRaces = [...x.races]
      for (let race = 0; race < x.races.length; race++) {
        if (x.races[race] != undefined) {
          if (fleet != undefined) {
            if (x.races[race].fleet != fleet) {
              tempRaces[race] = undefined
            }
          }
          if (division != undefined) {
            if (x.races[race].division != division) {
              tempRaces[race] = undefined
            }
          }
          if (position != undefined) {
            if (x.races[race].position != position) {
              tempRaces[race] = undefined
            }
          }
          if (pair != undefined) {
            if (x.races[race].pair != pair) {
              tempRaces[race] = undefined
            }
          }
          if (regatta != undefined) {
            if (x.races[race].regatta != regatta) {
              tempRaces[race] = undefined
            }
          }
        }
      }

      if (type == 'raw') {
        tempRaces.forEach((i) => {
          if (i != undefined) {
            res.push(i.score)
          } else {
            res.push(NaN)
          }
        })
      } else if (type == 'points') {
        tempRaces.forEach((i) => {
          if (i != undefined) {
            res.push(i.fleetNum - i.score + 1)
          } else {
            res.push(NaN)
          }
        })
      } else if (type == 'ratio') {
        tempRaces.forEach((i) => {
          if (i != undefined) {
            res.push(1 - (i.score - 1) / i.fleetNum)
          } else {
            res.push(NaN)
          }
        })
      }
    }
  })
  return res
}

// getRegattaData(['pontiac-bay-regional-south-regional'])
function getRegattaData(regattas) {
  const data = regattas.map(async (regatta) => {
    const res = await axios.get(`https://scores.hssailing.org/f22/${regatta}/full-scores/`)

    const html = await res.data
    const fullScores = cheerio.load(html)

    let raceCount = parseInt(fullScores('.results').children().first().find('.right').last().prev().prev().text())
    let teamCount = fullScores('.results').children().last().children().length / 3
  })
}
