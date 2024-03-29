import { initializeApp } from 'firebase/app'
import { addDoc, collection, doc, getDoc, getDocs, deleteDoc, docRef, getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

const graphMode = document.getElementById('graphMode')
const regattaEls = document.getElementById('regattas')
const peopleEls = document.getElementById('ppl')
const dataType = document.getElementById('dataType')
const fleetSelect = document.getElementById('fleetSelect')
const divSelect = document.getElementById('divSelect')
const posSelect = document.getElementById('posSelect')
const vertLabels = document.getElementById('vertLabels')

vertLabels.addEventListener('change', () => {
    verticalLabels = vertLabels.checked
    updateGraph()
})

const firebaseConfig = {
    apiKey: 'AIzaSyAIlmAr8qfAjVweURTIvOmvNbZzlii1QXc',
    authDomain: 'bhspairs.firebaseapp.com',
    projectId: 'bhspairs',
    storageBucket: 'bhspairs.appspot.com',
    messagingSenderId: '853792589116',
    appId: '1:853792589116:web:0d634d29b62ae7cab90a39',
    measurementId: 'G-KPRQEN42TT',
}

// Initialize Firebase
initializeApp(firebaseConfig)

const functions = getFunctions()
const getSchools = httpsCallable(functions, 'getSchools')
const getRegattas = httpsCallable(functions, 'getRegattas')
const getRegattaData = httpsCallable(functions, 'getRegattaData')

var config
const ctx = document.getElementById('graph')
var chart = new Chart(ctx, config)
let datasets = []
let chartType = 'line'

let regattaData = {}

const seasons = ['f22', 's22']
const addRegattaButton = document.getElementById('addRegatta')
const addPersonButton = document.getElementById('addPerson')

// let regattas = {"south regional": "s22/south-regional-nwisa",  "oak gold": "s22/island-cup", "oak silver": "s22/islands-cup-silver", "SSP gold": "s22/nwisa-combined-division", "SSP silver": "s22/nwisa-combined-division-silver", "SSP bronze": "s22/nwisa-combined-division-bronze", "bellingham": "s22/bellingham-fleet-race", "anacortes gold": "s22/seafarers-cup-gold", "anacortes silver": "s22/seafarers-cup-silver", "fleet champs gold": "s22/nwisa-doublehanded", "fleet champs silver": "s22/nwisa-silver-fleet-champs", "PT open": "s22/port-townsend-open"}
// let regattas = {"oak gold": "s22/island-cup"}
let regattas = {}
let regattasList = {}
let inputNames = {}
let teams = []
let sailors = []
let curSailors = []
// let inputNames = { 'Elliott Chalcraft': '#e0570d', 'Carter Anderson': '#3684a3', 'Ryan Downey': '#2de00d', 'Sabrina Anderson': '#d20de0', 'Barrett Lhamon': '#f00' }
let Type = 'Raw'
let verticalLabels = false

const titles = {
    Raw: 'Raw score (Lower is better)',
    Points: 'Number of boats beat (Higher is better)',
    Ratio: 'Percentage of fleet beat (Higher is better)',
}

setup()
async function setup() {
    // const getSchools = firebase.functions().httpsCallable('getSchools')
    await addRegatta()
    readData()
    await loadData()
    await addPerson()
    readData()
    updateGraph()
}

function getData(type, name, fleet = undefined, division = undefined, position = undefined, pair = undefined, regatta = undefined) {
    let data = {}
    regattaData.forEach((p) => {
        if (p.name == name) {
            p.races.forEach((r) => {
                if ((regatta != undefined && r.venue == regatta) || regatta == undefined) {
                    if (((division != 'All' && r.division == division) || division == 'All') && ((position != 'All' && r.position == position) || position == 'All') && ((fleet != 'All' && r.fleet == fleet) || fleet == 'All')) {
                        if (type == 'Raw') {
                            if (!isNaN(r.score)) {
                                data[`${regatta} ${r.division}${r.number}`] = r.score
                            } else {
                                data[`${regatta} ${r.division}${r.number}`] = r.teams.length + 1
                            }
                        }
                        if (type == 'Points') {
                            if (!isNaN(r.score)) {
                                data[`${regatta} ${r.division}${r.number}`] = r.teams.length - r.score + 1
                            } else {
                                data[`${regatta} ${r.division}${r.number}`] = r.teams.length + 1
                            }
                        }
                        if (type == 'Ratio') {
                            if (!isNaN(r.score)) {
                                data[`${regatta} ${r.division}${r.number}`] = (1 - (r.score - 1) / r.teams.length) * 100
                            } else {
                                data[`${regatta} ${r.division}${r.number}`] = 0
                            }
                        }
                    }
                }
            })
        }
    })
    return data
}
function compareRace(first, second) {
    let longF = false
    let longS = false
    let firstDiv = first[first.length - 2]
    if (firstDiv != 'A' && firstDiv != 'B') {
        firstDiv = first[first.length - 3]
        longF = true
    }
    let secondDiv = second[second.length - 2]
    if (secondDiv != 'A' && secondDiv != 'B') {
        secondDiv = second[second.length - 3]
        longS = true
    }
    //Compare race numbers

    if (longF && !longS) return 1
    else if (!longF && longS) return -1

    if (longF && longS) {
        if (first[first.length - 2] > second[second.length - 2]) {
            return 1
        }
        if (first[first.length - 2] < second[second.length - 2]) {
            return -1
        }
    }
    if (first[first.length - 1] > second[second.length - 1]) {
        return 1
    }
    if (first[first.length - 1] < second[second.length - 1]) {
        return -1
    }

    //Compare divisions
    if (firstDiv > secondDiv) {
        return 1
    }
    if (firstDiv < secondDiv) {
        return -1
    }
    return 0
}
async function loadData() {
    loadingEl.style.display = 'block'
    // console.log(regattasBox.value)
    readData()
    console.log(regattas)
    // options = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ regattas: regattas }),
    // }
    // const response = await fetch(API_URL + '/scores', options)
    // const json = await response.json()
    regattaData = await getRegattaData({ regattas: regattas })
    regattaData = regattaData.data
    // regattaData = json
    console.log('REGATTADAT', regattaData)
    curSailors = regattaData.filter(function (el) {
        return teams.includes(el.home)
    })
    curSailors = curSailors.map((person) => person.name)
    //   console.log(curSailors)
    //   sailors = json.people.map((person) => person.name)
    //   console.log(sailors)
    // console.log('Fetched Data', json)
    updateNames()
    updateGraph()
    loadingEl.style.display = 'none'
}

async function updateGraph() {
    // let namess = JSON.parse(regattasBox.value)
    //   let namess = { 'Elliott Chalcraft': '#e0570d', 'Carter Anderson': '#3684a3', 'Ryan Downey': '#2de00d', 'Sabrina Anderson': '#d20de0', 'Barrett Lhamon': '#f00' }
    //   let nameList = Object.keys(namess)

    readData()

    let prev = 0
    let xTicks = []
    let nameLabels = []
    datasets = []
    let maxVals = []
    Object.keys(regattas).forEach((regatta) => {
        let data = {}
        let races = []
        let names = Object.keys(inputNames)
        console.log(regattaData)
        if (regattaData != undefined && regattaData.length > 0) {
            names.forEach((p) => {
                try {
                    let fleet = fleetSelect.value
                    if (fleet == 'All' && inputNames[p].fleet != 'All') fleet = inputNames[p].fleet
                    let div = divSelect.value
                    if (div == 'All' && inputNames[p].div != 'All') div = inputNames[p].div
                    let pos = posSelect.value
                    if (pos == 'All' && inputNames[p].pos != 'All') pos = inputNames[p].pos
                    console.log('FLTDIVPOS', fleet, div, pos)
                    data[p] = getData(Type, p, fleet, div, pos, undefined, regatta)
                    console.log(data[p])
                    races.push(...Object.keys(data[p]))
                    maxVals.push(Math.max(Object.values(data[p])))
                } catch (error) {
                    console.error(error)
                }
            })
            races = races.sort(compareRace)
            xTicks.push(...races)
            xTicks = [...new Set(xTicks)]
            console.log('XTICKS', xTicks)
            names.forEach((p) => {
                console.log(p, data[p])
                if (Object.keys(data[p]).length > 0) {
                    let found = false
                    datasets.forEach((dataset) => {
                        if (dataset.label == p) {
                            dataset.data = {
                                ...dataset.data,
                                ...data[p],
                            }
                            found = true
                        }
                    })
                    if (!found) {
                        datasets.push({
                            label: p,
                            data: data[p],
                            backgroundColor: inputNames[p].color + '55',
                            borderColor: inputNames[p].color,
                            borderWidth: 5,
                            pointRadius: 5,
                            fill: false,
                            pointHitRadius: 10,
                        })
                    }
                }
            })
            console.log(`Input names: ${names}`)
            /*trendlineLinear: {
          colorMin: colors[colorNum],
          lineStyle: 'dotted',
          width: 2,
        }, */
        }
    })

    console.log('datasets:', datasets, 'labels:', xTicks)
    //Graph ppl
    config = {
        type: chartType,
        data: {
            labels: [...xTicks],
            datasets: datasets,
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: titles[Type],
                },
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                    },
                },
            },
        },
    }

    if (Type == 'Ratio') {
        config.options.scales.y = {
            max: 100,
            min: 0,
            ticks: {
                stepSize: 5,
            },
        }
    }
    if (verticalLabels) {
        config.options.scales.x = {
            ticks: {
                maxRotation: 90,
                minRotation: 90,
                autoSkip: false,
            },
        }
    }
    /*scales: {
                x: {
                    ticks: {
                        callback: function (val, index) {
                            console.log('val index', val, index)
                            return xTicks[index]
                        },
                    },
                },
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 0.7,
                    to: 0,
                    loop: true,
                },
            }, */
    // console.log('config', config)
    config.type = 'line'
    chart.destroy()
    chart = new Chart(ctx, config)
    config.type = 'scatter'
    chart.destroy()
    chart = new Chart(ctx, config)

    loadingEl.style.display = 'none'
}

function readData() {
    regattas = {}
    inputNames = {}
    teams = []

    //   console.log('reading data', regattaEls.children.length, peopleEls.children.length)

    Array.from(regattaEls.children).forEach((el) => {
        //regattaSelect.options[regattaSelect.selectedIndex].text
        // console.log(el.children[2].options[el.children[2].selectedIndex].text)
        if (el.children[2].value == 'All') {
            Array.from(el.children[2].options).forEach((option) => {
                if (option.text != 'All') regattas[option.text] = option.value
            })
            // regattas = { ...el.children[2].value }
        } else {
            regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value
        }

        if (!teams.includes(el.children[1].options[el.children[1].selectedIndex].text)) teams.push(el.children[1].options[el.children[1].selectedIndex].text)
    })
    regattas = Object.keys(regattas)
        .sort(function (a, b) {
            if (regattasList[a] != undefined && regattasList[b] != undefined) return new Date(regattasList[a].date) - new Date(regattasList[b].date)
            return 0
        })
        .reduce((obj, key) => {
            obj[key] = regattas[key]
            return obj
        }, {})

    Array.from(peopleEls.children).forEach((el) => {
        inputNames[el.children[0].options[el.children[0].selectedIndex].text] = {
            color: el.children[1].value,
            fleet: el.children[2].value,
            div: el.children[3].value,
            pos: el.children[4].value,
        }
    })

    console.log('ReadData:', regattas, teams, inputNames)
}

let types = ['bar', 'line', 'scatter']
graphMode.addEventListener('click', () => {
    type(types[(types.indexOf(config.type) + 1) % 3])
})
dataType.addEventListener('change', () => {
    Type = dataType.value
    updateGraph()
})
fleetSelect.addEventListener('change', () => {
    updateGraph()
})
divSelect.addEventListener('change', () => {
    updateGraph()
})
posSelect.addEventListener('change', () => {
    updateGraph()
})

function type(type) {
    config.type = type
    // chartType = type;
    console.log(config.type)
    chart.destroy()
    chart = new Chart(ctx, config)
}

function updateNames() {
    Array.from(peopleEls.children).forEach((el) => {
        let prevSelected = el.children[0].options[el.children[0].selectedIndex].text

        while (el.children[0].firstChild) {
            el.children[0].removeChild(el.children[0].firstChild)
        }

        curSailors.forEach((sailor) => {
            const nameOpt = document.createElement('option')
            nameOpt.value, (nameOpt.innerText = sailor)
            el.children[0].append(nameOpt)
        })
        const allOpt = document.createElement('option')
        allOpt.value = 'All'
        allOpt.text = 'All'
        el.children[0].append(allOpt)

        console.log(curSailors.indexOf(prevSelected), el.children[0].options)
        if (curSailors.indexOf(prevSelected) != -1) {
            el.children[0].selectedIndex = curSailors.indexOf(prevSelected)
        } else {
            // console.log('FIRST CHILD:', el.children[0].options[0].text)
            el.children[0].options[0].selected = true
        }
    })
}

async function updateRegattas(teamSelect, regattaSelect, season) {
    loadingEl.style.display = 'block'

    // options = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ link: teamSelect.value, season: season }),
    // }
    // const response = await fetch(API_URL + '/regattas', options)
    // let json = await response.json()

    let regattasList = await getRegattas({ schoolLink: teamSelect.value, season: season })
    regattasList = regattasList.data

    // console.log(response.status)
    if (Object.keys(regattasList).length > 0) {
        // let curList = json.regattas
        // regattasList = {
        //     ...json.regattas,
        // }
        console.log(regattasList)

        if (regattaSelect.firstChild) {
            //Deletes regatta even if selected on another team :/
            // delete regattas[regattaSelect.options[regattaSelect.selectedIndex].text]
        }

        while (regattaSelect.firstChild) {
            regattaSelect.removeChild(regattaSelect.firstChild)
        }

        Object.keys(regattasList).forEach((regatta) => {
            const regattaOpt = document.createElement('option')
            regattaOpt.value = regattasList[regatta].link
            regattaOpt.text = regatta
            regattaSelect.append(regattaOpt)
        })
        const allOpt = document.createElement('option')
        allOpt.value = 'All'
        allOpt.text = 'All'
        regattaSelect.append(allOpt)

        console.log('Regattas Filled in')
    } else {
        alert('Team not found')
    }
    loadingEl.style.display = 'none'
}

async function addRegatta() {
    console.log('Adding regatta')

    const regatta = document.createElement('div')
    regatta.classList.add('dataset')

    const seasonSelect = document.createElement('select')
    seasonSelect.classList.add('selectBox')

    seasons.forEach((season) => {
        const seasonOpt = document.createElement('option')
        seasonOpt.value, (seasonOpt.innerText = season)
        seasonSelect.append(seasonOpt)
    })

    const teamSelect = document.createElement('select')
    teamSelect.classList.add('selectBox')

    let schools = await getSchools({ district: 'NWISA' })
    console.log(schools.data)

    Object.keys(schools.data).forEach((teamName) => {
        const teamOpt = document.createElement('option')
        teamOpt.value = schools.data[teamName]
        teamOpt.text = teamName
        teamSelect.append(teamOpt)
    })
    loadingEl.style.display = 'none'

    const regattaSelect = document.createElement('select')
    regattaSelect.classList.add('selectBox')

    await updateRegattas(teamSelect, regattaSelect, seasonSelect.value)

    seasonSelect.addEventListener('change', async () => {
        await updateRegattas(teamSelect, regattaSelect, seasonSelect.value)
        //regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value
        readData()
        await loadData()
    })
    teamSelect.addEventListener('change', async () => {
        await updateRegattas(teamSelect, regattaSelect, seasonSelect.value)
        //regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value
        readData()
        await loadData()
    })
    regattaSelect.addEventListener('change', async () => {
        console.log(regattaSelect.value, 'VAL')
        if (regattaSelect.value != '') {
            //regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value
            readData()
            await loadData()
        }
    })
    // while (Object.keys(regattas).length === 0) {
    Array.from(regattaEls.children).forEach((el) => {
        regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value
    })
    // for (let i = 0; i < regattaEls.children.length - 1; i++) {
    //     let el = regattaEls.children[i]
    //     //regattaSelect.options[regattaSelect.selectedIndex].text
    //     console.log(el.children[2].options[el.children[2].selectedIndex].text)
    //     regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value
    // }
    // }
    // regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value
    // await loadData()

    readData()

    const flexGap = document.createElement('div')
    flexGap.classList.add('flexGap')

    const delDataset = document.createElement('button')
    delDataset.classList.add('delDataset', 'fa-lg', 'fa-solid', 'fa-trash')
    // delDataset.innerHTML = '-'
    delDataset.addEventListener('click', () => {
        // delete regattas[regattaSelect.options[regattaSelect.selectedIndex].text]
        regatta.remove()
        updateGraph()
    })

    regatta.append(seasonSelect)
    regatta.append(teamSelect)
    regatta.append(regattaSelect)
    regatta.append(flexGap)
    regatta.append(delDataset)
    regattaEls.append(regatta)
}

addRegattaButton.addEventListener('click', () => {
    addRegatta()
})
async function addPerson() {
    console.log('Adding person')
    const person = document.createElement('div')
    person.classList.add('dataset')

    const nameSelect = document.createElement('select')
    nameSelect.classList.add('selectBox')

    console.log('sailors', curSailors)
    curSailors.forEach((sailor) => {
        const nameOpt = document.createElement('option')
        nameOpt.value, (nameOpt.innerText = sailor)
        nameSelect.append(nameOpt)
    })

    const colorSelect = document.createElement('input')
    colorSelect.type = 'color'
    colorSelect.classList.add('colSelect')

    const fleetSel = document.createElement('select')
    fleetSel.classList.add('selectBox', 'tooltip')
    fleetSel.dataset['tooltip'] = 'Select Fleet'
    let fleets = ['All', 'Gold', 'Silver']
    fleets.forEach((fleet) => {
        const fleetOpt = document.createElement('option')
        fleetOpt.value, (fleetOpt.innerText = fleet)
        fleetSel.append(fleetOpt)
    })

    const divSelect = document.createElement('select')
    divSelect.classList.add('selectBox')
    let divisions = ['All', 'A', 'B']
    divisions.forEach((division) => {
        const divOpt = document.createElement('option')
        divOpt.value, (divOpt.innerText = division)
        divSelect.append(divOpt)
    })

    const posSelect = document.createElement('select')
    posSelect.classList.add('selectBox')
    let positions = ['All', 'Skipper', 'Crew']
    positions.forEach((position) => {
        const posOpt = document.createElement('option')
        posOpt.value, (posOpt.innerText = position)
        posSelect.append(posOpt)
    })

    nameSelect.addEventListener('change', () => {
        updateGraph()
    })
    colorSelect.addEventListener('change', () => {
        updateGraph()
    })
    fleetSel.addEventListener('change', async () => {
        updateGraph()
    })
    divSelect.addEventListener('change', async () => {
        updateGraph()
    })
    posSelect.addEventListener('change', async () => {
        updateGraph()
    })

    const flexGap = document.createElement('div')
    flexGap.classList.add('flexGap')

    const delDataset = document.createElement('button')
    delDataset.classList.add('delDataset', 'fa-lg', 'fa-solid', 'fa-trash')
    delDataset.addEventListener('click', () => {
        person.remove()
        updateGraph()
    })

    person.append(nameSelect)
    person.append(colorSelect)
    person.append(fleetSel)
    person.append(divSelect)
    person.append(posSelect)
    person.append(flexGap)
    person.append(delDataset)
    peopleEls.append(person)
    updateGraph()
}

addPersonButton.addEventListener('click', () => {
    addPerson()
})
