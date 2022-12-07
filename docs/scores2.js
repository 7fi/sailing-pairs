const updateGraphBtn = document.getElementById('updateGraph')
const regattasBox = document.getElementById('regattas')
const namesBox = document.getElementById('namesBox')
updateGraphBtn.addEventListener('click', () => {
    updateGraph()
})
const API_URL = 'http://localhost:3000' // For development
// const API_URL = 'https://bhspairs.onrender.com' // For deployment

var config
const ctx = document.getElementById('graph')
var chart = new Chart(ctx, config)
let datasets = []
let chartType = 'line'

// let regattas = {"south regional": "s22/south-regional-nwisa",  "oak gold": "s22/island-cup", "oak silver": "s22/islands-cup-silver", "SSP gold": "s22/nwisa-combined-division", "SSP silver": "s22/nwisa-combined-division-silver", "SSP bronze": "s22/nwisa-combined-division-bronze", "bellingham": "s22/bellingham-fleet-race", "anacortes gold": "s22/seafarers-cup-gold", "anacortes silver": "s22/seafarers-cup-silver", "fleet champs gold": "s22/nwisa-doublehanded", "fleet champs silver": "s22/nwisa-silver-fleet-champs", "PT open": "s22/port-townsend-open"}
// let regattas = {"oak gold": "s22/island-cup"}
let names = { 'Elliott Chalcraft': '#e0570d', 'Carter Anderson': '#3684a3', 'Ryan Downey': '#2de00d', 'Sabrina Anderson': '#d20de0', 'Barrett Lhamon': '#f00' }
let Type = 'Raw'

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

async function updateGraph() {
    loadingEl.style.display = 'block'
    console.log(regattasBox.value)
    options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regattas: regattasBox.value }),
    }
    const response = await fetch(API_URL + '/scores', options)
    const json = await response.json()
    console.log(json)

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
