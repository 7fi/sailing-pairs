const graphMode = document.getElementById('graphMode')
const regattaEls = document.getElementById('regattas')
const peopleEls = document.getElementById('ppl')

// const updateGraphBtn = document.getElementById('updateGraph')
// const regattasBox = document.getElementById('regattas')
// const namesBox = document.getElementById('namesBox')
// updateGraphBtn.addEventListener('click', () => {
//     updateGraph()
// })
// const API_URL = 'http://localhost:3000' // For development
// const API_URL = 'https://bhspairs.onrender.com' // For deployment

var config
const ctx = document.getElementById('graph')
// var chart = new Chart(ctx, config);
let datasets = []
let chartType = 'scatter'

let regattaData = {}

const seasons = ['f22', 's22']
const addRegattaButton = document.getElementById('addRegatta')
const addPersonButton = document.getElementById('addPerson')

// let regattas = {"south regional": "s22/south-regional-nwisa",  "oak gold": "s22/island-cup", "oak silver": "s22/islands-cup-silver", "SSP gold": "s22/nwisa-combined-division", "SSP silver": "s22/nwisa-combined-division-silver", "SSP bronze": "s22/nwisa-combined-division-bronze", "bellingham": "s22/bellingham-fleet-race", "anacortes gold": "s22/seafarers-cup-gold", "anacortes silver": "s22/seafarers-cup-silver", "fleet champs gold": "s22/nwisa-doublehanded", "fleet champs silver": "s22/nwisa-silver-fleet-champs", "PT open": "s22/port-townsend-open"}
// let regattas = {"oak gold": "s22/island-cup"}
let regattas = {}
let inputNames = {}
let sailors = []
// let inputNames = { 'Elliott Chalcraft': '#e0570d', 'Carter Anderson': '#3684a3', 'Ryan Downey': '#2de00d', 'Sabrina Anderson': '#d20de0', 'Barrett Lhamon': '#f00' }
let Type = 'Raw'

setup()
async function setup() {
    await addRegatta()
    readData()
    await addPerson()
}

function getData(type, name, fleet = undefined, division = undefined, position = undefined, pair = undefined, regatta = undefined) {
    let data = {}
    people.forEach((p) => {
        if (p.name == name) {
            p.races.forEach((r) => {
                if (regatta != undefined && r.venue == regatta) {
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
                            data[`${regatta} ${r.division}${r.number}`] = 1 - r.score / r.teams.length
                        } else {
                            data[`${regatta} ${r.division}${r.number}`] = r.teams.length + 1
                        }
                    }
                }
            })
        }
    })
    return data
}
function compare(first, second) {
    if (first[first.length - 1] > second[second.length - 1]) {
        return 1
    }
    if (first[first.length - 1] < second[second.length - 1]) {
        return -1
    }
    if (first[first.length - 2] > second[second.length - 2]) {
        return 1
    }
    if (first[first.length - 2] < second[second.length - 2]) {
        return -1
    }
    return 0
}
async function loadData() {
    loadingEl.style.display = 'block'
    // console.log(regattasBox.value)
    readData()
    console.log(regattas)
    options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regattas: regattas }),
    }
    const response = await fetch(API_URL + '/scores', options)
    const json = await response.json()
    regattaData = json
    sailors = json.people.map((person) => person.name)
    // console.log(sailors)
    console.log(json)
    loadingEl.style.display = 'none'
}

async function updateGraph() {
    // let namess = JSON.parse(regattasBox.value)
    let namess = { 'Elliott Chalcraft': '#e0570d', 'Carter Anderson': '#3684a3', 'Ryan Downey': '#2de00d', 'Sabrina Anderson': '#d20de0', 'Barrett Lhamon': '#f00' }
    let nameList = Object.keys(namess)

    let prev = 0
    let xTicks = []
    let nameLabels = []
    let maxVals = []
    nameList.forEach((regatta) => {
        let data = {}
        let races = []
        let names = Object.keys(JSON.parse(namesBox.value))
        names.forEach((p) => {
            try {
                data[p] = getData(Type, p, undefined, undefined, undefined, undefined, regatta)
                races.push(Object.keys(data[p]))
                maxVals.push(max(Object.values(data[p])))
            } catch (error) {
                console.error(error)
            }
        })
        races = races.sort(compare(a, b))
        console.log(races)
        names.forEach((p) => {
            let x = []
            let y = []

            if (x != [] && y != []) {
                datasets.push({
                    label: p,
                    data: data[p],
                    backgroundColor: namess[p] + '55',
                    borderColor: namess[p],
                    borderWidth: 2,
                    fill: false,
                    trendlineLinear: {
                        colorMin: colors[colorNum],
                        lineStyle: 'dotted',
                        width: 2,
                    },
                })
            }
        })
    })

    console.log('datasets:', datasets)
    //Graph ppl
    config = {
        type: chartType,
        data: {
            labels: labels,
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
                    text: 'Spring 2022 Scores (From Spreadsheet)',
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
            },
        },
    }
    chart.destroy()
    chart = new Chart(ctx, config)

    loadingEl.style.display = 'none'
}

function readData() {
    regattas = {}
    inputNames = {}

    console.log('reading data', regattaEls.children.length, peopleEls.children.length)

    for (let i = 1; i < regattaEls.children.length - 1; i++) {
        let el = regattaEls.children[i]
        //regattaSelect.options[regattaSelect.selectedIndex].text
        console.log(el.children[2].options[el.children[2].selectedIndex].text)
        regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value
    }

    for (let i = 0; i < peopleEls.children.length - 1; i++) {
        let el = peopleEls.children[i]
        inputNames[el.children[0].options[el.children[0].selectedIndex].text] = el.children[1].value
    }

    console.log(regattas, inputNames)
}

let types = ['bar', 'line', 'scatter']
graphMode.addEventListener('click', () => {
    type(types[(types.indexOf(config.type) + 1) % 3])
})
function type(type) {
    config.type = type
    // chartType = type;
    console.log(config.type)
    chart.destroy()
    chart = new Chart(ctx, config)
}

async function updateRegattas(teamSelect, regattaSelect, season) {
    loadingEl.style.display = 'block'

    options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: teamSelect.value, season: season }),
    }
    const response = await fetch(API_URL + '/regattas', options)
    let json = await response.json()
    console.log(response.status)
    if (response.status != 404) {
        let regattasList = json.regattas
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
            regattaOpt.value = regattasList[regatta]
            regattaOpt.text = regatta
            regattaSelect.append(regattaOpt)
        })
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

    loadingEl.style.display = 'block'
    options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: 'NWISA' }),
    }
    const response = await fetch(API_URL + '/teams', options)
    const json = await response.json()
    console.log(json.teams)

    Object.keys(json.teams).forEach((teamName) => {
        const teamOpt = document.createElement('option')
        teamOpt.value = json.teams[teamName]
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
    for (let i = 1; i < regattaEls.children.length - 1; i++) {
        let el = regattaEls.children[i]
        //regattaSelect.options[regattaSelect.selectedIndex].text
        console.log(el.children[2].options[el.children[2].selectedIndex].text)
        regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value
    }
    // }
    // regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value
    await loadData()

    readData()

    const flexGap = document.createElement('div')
    flexGap.classList.add('flexGap')

    const delDataset = document.createElement('div')
    delDataset.classList.add('delDataset')
    delDataset.innerHTML = '-'
    delDataset.addEventListener('click', () => {
        delete regattas[regattaSelect.options[regattaSelect.selectedIndex].text]
        regatta.remove()
        // updateGraph()
    })

    regatta.append(seasonSelect)
    regatta.append(teamSelect)
    regatta.append(regattaSelect)
    regatta.append(flexGap)
    regatta.append(delDataset)
    regattaEls.insertBefore(regatta, addRegattaButton)
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

    console.log('sailors', sailors)
    sailors.forEach((sailor) => {
        const nameOpt = document.createElement('option')
        nameOpt.value, (nameOpt.innerText = sailor)
        nameSelect.append(nameOpt)
    })

    const colorSelect = document.createElement('input')
    colorSelect.type = 'color'
    colorSelect.classList.add('colSelect')

    const divSelect = document.createElement('select')
    divSelect.classList.add('selectBox')
    let divisions = ['Any', 'A', 'B']
    divisions.forEach((division) => {
        const divOpt = document.createElement('option')
        divOpt.value, (divOpt.innerText = division)
        divSelect.append(divOpt)
    })

    const posSelect = document.createElement('select')
    posSelect.classList.add('selectBox')
    let positions = ['Any', 'Skipper', 'Crew']
    positions.forEach((position) => {
        const posOpt = document.createElement('option')
        posOpt.value, (posOpt.innerText = position)
        posSelect.append(posOpt)
    })

    const flexGap = document.createElement('div')
    flexGap.classList.add('flexGap')

    const delDataset = document.createElement('div')
    delDataset.classList.add('delDataset')
    delDataset.innerHTML = '-'
    delDataset.addEventListener('click', () => {
        // delete regattas[regattaSelect.options[regattaSelect.selectedIndex].text]
        person.remove()
        // updateGraph()
    })

    person.append(nameSelect)
    person.append(colorSelect)
    person.append(divSelect)
    person.append(posSelect)
    person.append(flexGap)
    person.append(delDataset)
    peopleEls.insertBefore(person, addPersonButton)
}

addPersonButton.addEventListener('click', () => {
    addPerson()
})
