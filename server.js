const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cheerio = require('cheerio')
const axios = require('axios')

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

  res.json({
    status: 'sucess',
    pairs: req.body,
  })
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

  res.json({
    status: 'sucess',
    pairs: req.body,
  })
  console.log('Pairs saved')
})
// Handle request all saved official pairs
app.post('/getPairsOfficial', async (req, res) => {
  PairsOfficial.find(
    {
      season: req.body.season,
    },
    async function (err, docs) {
      // console.log(docs);
      console.log('pairs gotten')
      res.json({
        pairs: docs,
      })
    }
  )
})
// Handle request one saved official pair
app.post('/getPairsOfficialOne', async (req, res) => {
  if (req.body.name != '') {
    PairsOfficial.findOne(
      {
        name: req.body.name,
        season: req.body.season,
      },
      async function (err, docs) {
        // console.log(docs);
        console.log('pairs gotten')
        res.json({
          pairs: docs,
        })
      }
    )
  }
})

// Handle request single saved pairing list
app.post('/getPairs', async (req, res) => {
  if (req.body.name != '') {
    Pairs.findOne(
      {
        name: req.body.name,
      },
      async function (err, docs) {
        // console.log(docs);
        console.log('pairs gotten')
        res.json({
          pairs: docs,
        })
      }
    )
  }
})

//Handle request for updated saved pairs
app.post('/getNames', async (req, res) => {
  Pairs.find({}, async function (err, docs) {
    // console.log(await docs);
    console.log('Names gotten')
    res.json({
      pairs: docs,
    })
  })
})

// Handle request for deletion of a pair list
app.post('/delPair', async (req, res) => {
  Pairs.deleteOne(
    {
      name: req.body.name,
    },
    function (err, docs) {
      res.json({
        status: 'sucess',
      })
    }
  )
})

app.post('/scores', async (req, res) => {
  let ppl = await getRegattaData(req.body.regattas)
  // console.log(ppl)
  res.json({
    status: 'Yuhhh',
    people: ppl,
  })
})

app.post('/teams', async (req, res) => {
  res.json({ teams: await getSchools(req.body.district) })
})
app.post('/regattas', async (req, res) => {
  let regattasList = await getRegattas(req.body.link, req.body.season)
  if (Object.keys(regattasList).length === 0) {
    res.status(404)
  } else {
    res.status(200)
  }
  res.json({ regattas: regattasList })
})

class person {
  constructor(name, team, home, races) {
    this.name = name
    this.team = team
    this.home = home
    this.races = races
  }
}
class race {
  constructor(number, division, score, teams, position, venue, fleet) {
    this.number = number
    this.division = division
    this.score = score
    this.teams = teams
    this.position = position
    this.venue = venue
    this.fleet = fleet
  }
}
function addPerson(people, name, pos, division, home, teamName, raceNums, scores, teams, venue, fleet) {
  // console.log(name, scores)
  let scoreLen = Array.from(scores).length
  // console.log("Scorelen", scoreLen)
  let newNums = []
  let names = people.map((person) => person.name)
  if (!names.includes(name)) {
    people.push(new person(name, home, teamName, []))
  }
  // console.log([''] == [''])
  // console.log(raceNums[0].includes(''))
  // console.log(name, raceNums)
  if (raceNums[0].includes('')) {
    newNums = [...Array(scoreLen).keys()].map((i) => i + 1)
    // console.log(newNums)
  } else if (raceNums.length > 0) {
    for (let i = 0; i < raceNums.length; i++) {
      if (raceNums[i].length > 1) {
        for (j = parseInt(raceNums[i][0]); j < parseInt(raceNums[i][1]) + 1; j++) {
          newNums.push(j)
        }
      } else {
        newNums.push(parseInt(raceNums[i]))
      }
    }
  }
  raceNums = newNums
  // console.log(name, raceNums)
  for (let i = 0; i < scoreLen; i++) {
    const score = scores[i]
    if (raceNums.includes(i + 1)) {
      people.forEach((p) => {
        if (p.name == name) {
          // console.log(p.races)
          p.races.push(new race(i + 1, division, score, teams, pos, venue, fleet))
        }
      })
    }
  }
  return people
}

async function getRegattaData(regattas) {
  let people = []

  for (r = 0; r < Object.values(regattas).length; r++) {
    let regatta = Object.values(regattas)[r]

    try {
      const response = await axios.get(`https://scores.hssailing.org${regatta}full-scores/`)
      const response2 = await axios.get(`https://scores.hssailing.org${regatta}sailors/`)
      const fullScores = cheerio.load(response.data)
      const scoreData = fullScores('table.results tbody')
      const sailors = cheerio.load(response2.data)
      const raceCount = parseInt(fullScores('th.right:nth-last-child(3)').text())
      const teamCount = scoreData.children().length / 3
      let fleet = 'Gold'
      if (regatta.toUpperCase().includes('SILVER')) fleet = 'Silver'
      // console.log(fullScores('table.results tbody').children(0).text())

      let betterVenue = Object.keys(regattas)[r]
      console.log(`(${r + 1}/${Object.values(regattas).length}) Analyzing ${betterVenue}`)

      let teamHomes = []
      for (i = 0; i < teamCount; i++) {
        // teamHomes.push(fullScores(`table.results tbody :nth-child(${i * 3 + 1}) a`).text());
        // teamHomes.push(scoreData.children(i * 3 + 1).find('a').text());
        teamHomes.push(scoreData.find(`:nth-child(${i * 3 + 1}) a`).text())
      }
      // console.log(teamHomes)

      //Loop through teams
      for (let i = 0; i < teamCount; i++) {
        let teamHome = scoreData.find(`:nth-child(${i * 3 + 1}) a`).text()
        let teamName = fullScores(`table.results tbody :nth-child(${i * 3 + 2}) :nth-child(3)`).text()
        // console.log(teamNameEl.text())
        let teamScores = {
          A: [],
          B: [],
        }
        // console.log(teamName)

        for (j = 5; j < 5 + raceCount; j++) {
          let score = scoreData.find(`:nth-child(${i * 3 + 1}) :nth-child(${j})`).text()
          if (!isNaN(score)) score = parseInt(score)
          teamScores['A'].push(score)

          score = fullScores(`table.results tbody :nth-child(${i * 3 + 2}) :nth-child(${j})`).text()
          if (!isNaN(score)) score = parseInt(score)
          teamScores['B'].push(score)
        }
        // console.log(teamScores)

        let teamNameEl
        let schoolName
        sailors(`table.sailors tbody .teamname`).each(function (i) {
          if (sailors(this).text() == teamName) {
            teamNameEl = sailors(this)
            schoolName = sailors(this).prev().text()
          }
        })
        // console.log(teamNameEl.text())
        // console.log(schoolName)

        let index = 0
        let row = teamNameEl.parent()
        while ((row.next() != null && row.next().attr('class') != undefined && !row.attr('class').split(/\s+/).includes('topborder') && !row.attr('class').split(/\s+/).includes('reserves-row')) || index == 0) {
          let curRow = row
          // console.log(row.attr('class').split(/\s+/).includes("topborder"))
          // console.log(row.next().html())
          // console.log(curRow.find('td.division-cell').html())

          while (curRow.find('td.division-cell').html() == null) {
            curRow = curRow.prev()
          }
          let division = curRow.find('td.division-cell').text()

          // Get Skipper
          let skipper = row.find(`:nth-last-child(4)`)
          let skipperName = row.find(`:nth-last-child(4)`).text().split(" '")[0]
          if (skipperName != '') {
            let raceNums = skipper.next().text().split(',')
            raceNums = raceNums.map((num) => num.split('-'))
            // console.log(raceNums)
            people = addPerson(people, skipperName.split(" '")[0], 'Skipper', division, teamHome, schoolName, raceNums, teamScores[division], teamHomes, betterVenue, fleet)
          }

          // Get Skipper
          let crew = row.find(`:nth-last-child(2)`)
          let crewName = row.find(`:nth-last-child(2)`).text().split(" '")[0]
          if (crewName != '') {
            let raceNums = crew.next().text().split(',')
            raceNums = raceNums.map((num) => num.split('-'))
            people = addPerson(people, crewName.split(" '")[0], 'Crew', division, teamHome, schoolName, raceNums, teamScores[division], teamHomes, betterVenue, fleet)
            // console.log(raceNums)
          }

          // console.log(skipperName, crewName)
          row = row.next()
          index++
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  return people
  // console.log(people)
  // console.log(getData("Raw", "Carter Anderson",undefined,undefined,undefined,undefined, "oak gold"))
}

async function getSchools(district) {
  let schools = {}
  try {
    const response = await axios.get(`https://scores.hssailing.org/schools/`)
    const $ = cheerio.load(response.data)
    // console.log(response.status)

    $(`#${district} tbody`)
      .children()
      .each(async function (i) {
        schools[$(this).find('a').text()] = $(this).find('a').attr('href')
        // try{
        //     let href = $(this).find('a').attr('href')
        //     // console.log(href)
        //     const response2 = await axios.get(`https://scores.hssailing.org${href}`)
        //     console.log(response2.status, href)
        //     schools[$(this).find('a').text()] = href
        // }catch(error){
        // }
      })
  } catch (error) {
    // console.error(error)
  }
  return schools
}

async function getRegattas(schoolLink, season) {
  let regattas = {}
  if (schoolLink != '') {
    try {
      const response = await axios.get(`https://scores.hssailing.org${schoolLink}${season}`)
      const $ = cheerio.load(response.data)
      // console.log(response.status)

      $(`table.participation-table tbody`)
        .children()
        .each(function (i) {
          // console.log($(this).text().includes("2 Divisions") || $(this).text().includes("Combined"))
          if ($(this).text().includes('2 Divisions') || $(this).text().includes('Combined')) {
            regattas[$(this).find('a span').text()] = { link: $(this).find('a').attr('href'), date: $(this).find('time').attr('datetime').split('T')[0] }
          }
        })
    } catch (error) {
      // console.error(error)
    }
  }
  return regattas
}

async function getRegattaData(regattas) {
  let people = []

  for (r = 0; r < Object.values(regattas).length; r++) {
    let regatta = Object.values(regattas)[r]

    try {
      const response = await axios.get(`https://scores.hssailing.org${regatta}full-scores/`)
      const response2 = await axios.get(`https://scores.hssailing.org${regatta}sailors/`)
      const fullScores = cheerio.load(response.data)
      const scoreData = fullScores('table.results tbody')
      const sailors = cheerio.load(response2.data)
      const raceCount = parseInt(fullScores('th.right:nth-last-child(3)').text())
      const teamCount = scoreData.children().length / 3
      let fleet = 'Gold'
      if (regatta.toUpperCase().includes('SILVER')) fleet = 'Silver'
      // console.log(fullScores('table.results tbody').children(0).text())

      let betterVenue = Object.keys(regattas)[r]
      console.log(`(${r + 1}/${Object.values(regattas).length}) Analyzing ${betterVenue}`)

      let teamHomes = []
      for (i = 0; i < teamCount; i++) {
        // teamHomes.push(fullScores(`table.results tbody :nth-child(${i * 3 + 1}) a`).text());
        // teamHomes.push(scoreData.children(i * 3 + 1).find('a').text());
        teamHomes.push(scoreData.find(`:nth-child(${i * 3 + 1}) a`).text())
      }
      // console.log(teamHomes)

      //Loop through teams
      for (let i = 0; i < teamCount; i++) {
        let teamHome = scoreData.find(`:nth-child(${i * 3 + 1}) a`).text()
        let teamName = fullScores(`table.results tbody :nth-child(${i * 3 + 2}) :nth-child(3)`).text()
        // console.log(teamNameEl.text())
        let teamScores = {
          A: [],
          B: [],
        }
        // console.log(teamName)

        for (j = 5; j < 5 + raceCount; j++) {
          let score = scoreData.find(`:nth-child(${i * 3 + 1}) :nth-child(${j})`).text()
          if (!isNaN(score)) score = parseInt(score)
          teamScores['A'].push(score)

          score = fullScores(`table.results tbody :nth-child(${i * 3 + 2}) :nth-child(${j})`).text()
          if (!isNaN(score)) score = parseInt(score)
          teamScores['B'].push(score)
        }
        // console.log(teamScores)

        let teamNameEl
        let schoolName
        sailors(`table.sailors tbody .teamname`).each(function (i) {
          if (sailors(this).text() == teamName) {
            teamNameEl = sailors(this)
            schoolName = sailors(this).prev().text()
          }
        })
        // console.log(teamNameEl.text())
        // console.log(schoolName)

        let index = 0
        let row = teamNameEl.parent()
        while ((row.next() != null && row.next().attr('class') != undefined && !row.attr('class').split(/\s+/).includes('topborder') && !row.attr('class').split(/\s+/).includes('reserves-row')) || index == 0) {
          let curRow = row
          // console.log(row.attr('class').split(/\s+/).includes("topborder"))
          // console.log(row.next().html())
          // console.log(curRow.find('td.division-cell').html())

          while (curRow.find('td.division-cell').html() == null) {
            curRow = curRow.prev()
          }
          let division = curRow.find('td.division-cell').text()

          // Get Skipper
          let skipper = row.find(`:nth-last-child(4)`)
          let skipperName = row.find(`:nth-last-child(4)`).text().split(" '")[0]
          if (skipperName != '') {
            let raceNums = skipper.next().text().split(',')
            raceNums = raceNums.map((num) => num.split('-'))
            // console.log(raceNums)
            people = addPerson(people, skipperName.split(" '")[0], 'Skipper', division, teamHome, schoolName, raceNums, teamScores[division], teamHomes, betterVenue, fleet)
          }

          // Get Skipper
          let crew = row.find(`:nth-last-child(2)`)
          let crewName = row.find(`:nth-last-child(2)`).text().split(" '")[0]
          if (crewName != '') {
            let raceNums = crew.next().text().split(',')
            raceNums = raceNums.map((num) => num.split('-'))
            people = addPerson(people, crewName.split(" '")[0], 'Crew', division, teamHome, schoolName, raceNums, teamScores[division], teamHomes, betterVenue, fleet)
            // console.log(raceNums)
          }

          // console.log(skipperName, crewName)
          row = row.next()
          index++
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  return people
  // console.log(people)
  // console.log(getData("Raw", "Carter Anderson",undefined,undefined,undefined,undefined, "oak gold"))
}
