"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunksailing_pairs"] = self["webpackChunksailing_pairs"] || []).push([["docs_scores2_js"],{

/***/ "./docs/scores2.js":
/*!*************************!*\
  !*** ./docs/scores2.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"./node_modules/firebase/app/dist/esm/index.esm.js\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/functions */ \"./node_modules/firebase/functions/dist/esm/index.esm.js\");\n\r\n\r\n\r\n\r\nconst graphMode = document.getElementById('graphMode')\r\nconst regattaEls = document.getElementById('regattas')\r\nconst peopleEls = document.getElementById('ppl')\r\nconst dataType = document.getElementById('dataType')\r\nconst fleetSelect = document.getElementById('fleetSelect')\r\nconst divSelect = document.getElementById('divSelect')\r\nconst posSelect = document.getElementById('posSelect')\r\nconst vertLabels = document.getElementById('vertLabels')\r\n\r\nvertLabels.addEventListener('change', () => {\r\n    verticalLabels = vertLabels.checked\r\n    updateGraph()\r\n})\r\n\r\n// const updateGraphBtn = document.getElementById('updateGraph')\r\n// const regattasBox = document.getElementById('regattas')\r\n// const namesBox = document.getElementById('namesBox')\r\n// updateGraphBtn.addEventListener('click', () => {\r\n//     updateGraph()\r\n// })\r\n// const API_URL = 'http://localhost:3000' // For development\r\n// const API_URL = 'https://bhspairs.onrender.com' // For deployment\r\n\r\nconst firebaseConfig = {\r\n    apiKey: 'AIzaSyAIlmAr8qfAjVweURTIvOmvNbZzlii1QXc',\r\n    authDomain: 'bhspairs.firebaseapp.com',\r\n    projectId: 'bhspairs',\r\n    storageBucket: 'bhspairs.appspot.com',\r\n    messagingSenderId: '853792589116',\r\n    appId: '1:853792589116:web:0d634d29b62ae7cab90a39',\r\n    measurementId: 'G-KPRQEN42TT',\r\n}\r\n\r\n// Initialize Firebase\r\n;(0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig)\r\n\r\nconst functions = (0,firebase_functions__WEBPACK_IMPORTED_MODULE_2__.getFunctions)()\r\nconst getSchools = (0,firebase_functions__WEBPACK_IMPORTED_MODULE_2__.httpsCallable)(functions, 'getSchools')\r\nconst getRegattas = (0,firebase_functions__WEBPACK_IMPORTED_MODULE_2__.httpsCallable)(functions, 'getRegattas')\r\nconst getRegattaData = (0,firebase_functions__WEBPACK_IMPORTED_MODULE_2__.httpsCallable)(functions, 'getRegattaData')\r\n\r\nvar config\r\nconst ctx = document.getElementById('graph')\r\nvar chart = new Chart(ctx, config)\r\nlet datasets = []\r\nlet chartType = 'line'\r\n\r\nlet regattaData = {}\r\n\r\nconst seasons = ['f22', 's22']\r\nconst addRegattaButton = document.getElementById('addRegatta')\r\nconst addPersonButton = document.getElementById('addPerson')\r\n\r\n// let regattas = {\"south regional\": \"s22/south-regional-nwisa\",  \"oak gold\": \"s22/island-cup\", \"oak silver\": \"s22/islands-cup-silver\", \"SSP gold\": \"s22/nwisa-combined-division\", \"SSP silver\": \"s22/nwisa-combined-division-silver\", \"SSP bronze\": \"s22/nwisa-combined-division-bronze\", \"bellingham\": \"s22/bellingham-fleet-race\", \"anacortes gold\": \"s22/seafarers-cup-gold\", \"anacortes silver\": \"s22/seafarers-cup-silver\", \"fleet champs gold\": \"s22/nwisa-doublehanded\", \"fleet champs silver\": \"s22/nwisa-silver-fleet-champs\", \"PT open\": \"s22/port-townsend-open\"}\r\n// let regattas = {\"oak gold\": \"s22/island-cup\"}\r\nlet regattas = {}\r\nlet regattasList = {}\r\nlet inputNames = {}\r\nlet teams = []\r\nlet sailors = []\r\nlet curSailors = []\r\n// let inputNames = { 'Elliott Chalcraft': '#e0570d', 'Carter Anderson': '#3684a3', 'Ryan Downey': '#2de00d', 'Sabrina Anderson': '#d20de0', 'Barrett Lhamon': '#f00' }\r\nlet Type = 'Raw'\r\nlet verticalLabels = false\r\n\r\nconst titles = {\r\n    Raw: 'Raw score (Lower is better)',\r\n    Points: 'Number of boats beat (Higher is better)',\r\n    Ratio: 'Percentage of fleet beat (Higher is better)',\r\n}\r\n\r\nsetup()\r\nasync function setup() {\r\n    // const getSchools = firebase.functions().httpsCallable('getSchools')\r\n    await addRegatta()\r\n    readData()\r\n    await loadData()\r\n    await addPerson()\r\n    readData()\r\n    updateGraph()\r\n}\r\n\r\nfunction getData(type, name, fleet = undefined, division = undefined, position = undefined, pair = undefined, regatta = undefined) {\r\n    let data = {}\r\n    regattaData.forEach((p) => {\r\n        if (p.name == name) {\r\n            p.races.forEach((r) => {\r\n                if ((regatta != undefined && r.venue == regatta) || regatta == undefined) {\r\n                    if (((division != 'All' && r.division == division) || division == 'All') && ((position != 'All' && r.position == position) || position == 'All') && ((fleet != 'All' && r.fleet == fleet) || fleet == 'All')) {\r\n                        if (type == 'Raw') {\r\n                            if (!isNaN(r.score)) {\r\n                                data[`${regatta} ${r.division}${r.number}`] = r.score\r\n                            } else {\r\n                                data[`${regatta} ${r.division}${r.number}`] = r.teams.length + 1\r\n                            }\r\n                        }\r\n                        if (type == 'Points') {\r\n                            if (!isNaN(r.score)) {\r\n                                data[`${regatta} ${r.division}${r.number}`] = r.teams.length - r.score + 1\r\n                            } else {\r\n                                data[`${regatta} ${r.division}${r.number}`] = r.teams.length + 1\r\n                            }\r\n                        }\r\n                        if (type == 'Ratio') {\r\n                            if (!isNaN(r.score)) {\r\n                                data[`${regatta} ${r.division}${r.number}`] = (1 - (r.score - 1) / r.teams.length) * 100\r\n                            } else {\r\n                                data[`${regatta} ${r.division}${r.number}`] = 0\r\n                            }\r\n                        }\r\n                    }\r\n                }\r\n            })\r\n        }\r\n    })\r\n    return data\r\n}\r\nfunction compareRace(first, second) {\r\n    let longF = false\r\n    let longS = false\r\n    let firstDiv = first[first.length - 2]\r\n    if (firstDiv != 'A' && firstDiv != 'B') {\r\n        firstDiv = first[first.length - 3]\r\n        longF = true\r\n    }\r\n    let secondDiv = second[second.length - 2]\r\n    if (secondDiv != 'A' && secondDiv != 'B') {\r\n        secondDiv = second[second.length - 3]\r\n        longS = true\r\n    }\r\n    //Compare race numbers\r\n\r\n    if (longF && !longS) return 1\r\n    else if (!longF && longS) return -1\r\n\r\n    if (longF && longS) {\r\n        if (first[first.length - 2] > second[second.length - 2]) {\r\n            return 1\r\n        }\r\n        if (first[first.length - 2] < second[second.length - 2]) {\r\n            return -1\r\n        }\r\n    }\r\n    if (first[first.length - 1] > second[second.length - 1]) {\r\n        return 1\r\n    }\r\n    if (first[first.length - 1] < second[second.length - 1]) {\r\n        return -1\r\n    }\r\n\r\n    //Compare divisions\r\n    if (firstDiv > secondDiv) {\r\n        return 1\r\n    }\r\n    if (firstDiv < secondDiv) {\r\n        return -1\r\n    }\r\n    return 0\r\n}\r\nasync function loadData() {\r\n    loadingEl.style.display = 'block'\r\n    // console.log(regattasBox.value)\r\n    readData()\r\n    console.log(regattas)\r\n    // options = {\r\n    //     method: 'POST',\r\n    //     headers: { 'Content-Type': 'application/json' },\r\n    //     body: JSON.stringify({ regattas: regattas }),\r\n    // }\r\n    // const response = await fetch(API_URL + '/scores', options)\r\n    // const json = await response.json()\r\n    regattaData = await getRegattaData({ regattas: regattas })\r\n    regattaData = regattaData.data\r\n    // regattaData = json\r\n    console.log('REGATTADAT', regattaData)\r\n    curSailors = regattaData.filter(function (el) {\r\n        return teams.includes(el.home)\r\n    })\r\n    curSailors = curSailors.map((person) => person.name)\r\n    //   console.log(curSailors)\r\n    //   sailors = json.people.map((person) => person.name)\r\n    //   console.log(sailors)\r\n    // console.log('Fetched Data', json)\r\n    updateNames()\r\n    updateGraph()\r\n    loadingEl.style.display = 'none'\r\n}\r\n\r\nasync function updateGraph() {\r\n    // let namess = JSON.parse(regattasBox.value)\r\n    //   let namess = { 'Elliott Chalcraft': '#e0570d', 'Carter Anderson': '#3684a3', 'Ryan Downey': '#2de00d', 'Sabrina Anderson': '#d20de0', 'Barrett Lhamon': '#f00' }\r\n    //   let nameList = Object.keys(namess)\r\n\r\n    readData()\r\n\r\n    let prev = 0\r\n    let xTicks = []\r\n    let nameLabels = []\r\n    datasets = []\r\n    let maxVals = []\r\n    Object.keys(regattas).forEach((regatta) => {\r\n        let data = {}\r\n        let races = []\r\n        let names = Object.keys(inputNames)\r\n        console.log(regattaData)\r\n        if (regattaData != undefined && regattaData.length > 0) {\r\n            names.forEach((p) => {\r\n                try {\r\n                    let fleet = fleetSelect.value\r\n                    if (fleet == 'All' && inputNames[p].fleet != 'All') fleet = inputNames[p].fleet\r\n                    let div = divSelect.value\r\n                    if (div == 'All' && inputNames[p].div != 'All') div = inputNames[p].div\r\n                    let pos = posSelect.value\r\n                    if (pos == 'All' && inputNames[p].pos != 'All') pos = inputNames[p].pos\r\n                    console.log('FLTDIVPOS', fleet, div, pos)\r\n                    data[p] = getData(Type, p, fleet, div, pos, undefined, regatta)\r\n                    console.log(data[p])\r\n                    races.push(...Object.keys(data[p]))\r\n                    maxVals.push(Math.max(Object.values(data[p])))\r\n                } catch (error) {\r\n                    console.error(error)\r\n                }\r\n            })\r\n            races = races.sort(compareRace)\r\n            xTicks.push(...races)\r\n            xTicks = [...new Set(xTicks)]\r\n            console.log('XTICKS', xTicks)\r\n            names.forEach((p) => {\r\n                console.log(p, data[p])\r\n                if (Object.keys(data[p]).length > 0) {\r\n                    let found = false\r\n                    datasets.forEach((dataset) => {\r\n                        if (dataset.label == p) {\r\n                            dataset.data = {\r\n                                ...dataset.data,\r\n                                ...data[p],\r\n                            }\r\n                            found = true\r\n                        }\r\n                    })\r\n                    if (!found) {\r\n                        datasets.push({\r\n                            label: p,\r\n                            data: data[p],\r\n                            backgroundColor: inputNames[p].color + '55',\r\n                            borderColor: inputNames[p].color,\r\n                            borderWidth: 5,\r\n                            pointRadius: 5,\r\n                            fill: false,\r\n                            pointHitRadius: 10,\r\n                        })\r\n                    }\r\n                }\r\n            })\r\n            console.log(`Input names: ${names}`)\r\n            /*trendlineLinear: {\r\n          colorMin: colors[colorNum],\r\n          lineStyle: 'dotted',\r\n          width: 2,\r\n        }, */\r\n        }\r\n    })\r\n\r\n    console.log('datasets:', datasets, 'labels:', xTicks)\r\n    //Graph ppl\r\n    config = {\r\n        type: chartType,\r\n        data: {\r\n            labels: [...xTicks],\r\n            datasets: datasets,\r\n        },\r\n        options: {\r\n            responsive: true,\r\n            plugins: {\r\n                legend: {\r\n                    position: 'top',\r\n                },\r\n                title: {\r\n                    display: true,\r\n                    text: titles[Type],\r\n                },\r\n            },\r\n            scales: {\r\n                x: {\r\n                    ticks: {\r\n                        autoSkip: false,\r\n                    },\r\n                },\r\n            },\r\n        },\r\n    }\r\n\r\n    if (Type == 'Ratio') {\r\n        config.options.scales.y = {\r\n            max: 100,\r\n            min: 0,\r\n            ticks: {\r\n                stepSize: 5,\r\n            },\r\n        }\r\n    }\r\n    if (verticalLabels) {\r\n        config.options.scales.x = {\r\n            ticks: {\r\n                maxRotation: 90,\r\n                minRotation: 90,\r\n                autoSkip: false,\r\n            },\r\n        }\r\n    }\r\n    /*scales: {\r\n                x: {\r\n                    ticks: {\r\n                        callback: function (val, index) {\r\n                            console.log('val index', val, index)\r\n                            return xTicks[index]\r\n                        },\r\n                    },\r\n                },\r\n            },\r\n            animations: {\r\n                tension: {\r\n                    duration: 1000,\r\n                    easing: 'linear',\r\n                    from: 0.7,\r\n                    to: 0,\r\n                    loop: true,\r\n                },\r\n            }, */\r\n    // console.log('config', config)\r\n    config.type = 'line'\r\n    chart.destroy()\r\n    chart = new Chart(ctx, config)\r\n    config.type = 'scatter'\r\n    chart.destroy()\r\n    chart = new Chart(ctx, config)\r\n\r\n    loadingEl.style.display = 'none'\r\n}\r\n\r\nfunction readData() {\r\n    regattas = {}\r\n    inputNames = {}\r\n    teams = []\r\n\r\n    //   console.log('reading data', regattaEls.children.length, peopleEls.children.length)\r\n\r\n    Array.from(regattaEls.children).forEach((el) => {\r\n        //regattaSelect.options[regattaSelect.selectedIndex].text\r\n        // console.log(el.children[2].options[el.children[2].selectedIndex].text)\r\n        if (el.children[2].value == 'All') {\r\n            Array.from(el.children[2].options).forEach((option) => {\r\n                if (option.text != 'All') regattas[option.text] = option.value\r\n            })\r\n            // regattas = { ...el.children[2].value }\r\n        } else {\r\n            regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value\r\n        }\r\n\r\n        if (!teams.includes(el.children[1].options[el.children[1].selectedIndex].text)) teams.push(el.children[1].options[el.children[1].selectedIndex].text)\r\n    })\r\n    regattas = Object.keys(regattas)\r\n        .sort(function (a, b) {\r\n            if (regattasList[a] != undefined && regattasList[b] != undefined) return new Date(regattasList[a].date) - new Date(regattasList[b].date)\r\n            return 0\r\n        })\r\n        .reduce((obj, key) => {\r\n            obj[key] = regattas[key]\r\n            return obj\r\n        }, {})\r\n\r\n    Array.from(peopleEls.children).forEach((el) => {\r\n        inputNames[el.children[0].options[el.children[0].selectedIndex].text] = {\r\n            color: el.children[1].value,\r\n            fleet: el.children[2].value,\r\n            div: el.children[3].value,\r\n            pos: el.children[4].value,\r\n        }\r\n    })\r\n\r\n    console.log('ReadData:', regattas, teams, inputNames)\r\n}\r\n\r\nlet types = ['bar', 'line', 'scatter']\r\ngraphMode.addEventListener('click', () => {\r\n    type(types[(types.indexOf(config.type) + 1) % 3])\r\n})\r\ndataType.addEventListener('change', () => {\r\n    Type = dataType.value\r\n    updateGraph()\r\n})\r\nfleetSelect.addEventListener('change', () => {\r\n    updateGraph()\r\n})\r\ndivSelect.addEventListener('change', () => {\r\n    updateGraph()\r\n})\r\nposSelect.addEventListener('change', () => {\r\n    updateGraph()\r\n})\r\n\r\nfunction type(type) {\r\n    config.type = type\r\n    // chartType = type;\r\n    console.log(config.type)\r\n    chart.destroy()\r\n    chart = new Chart(ctx, config)\r\n}\r\n\r\nfunction updateNames() {\r\n    Array.from(peopleEls.children).forEach((el) => {\r\n        let prevSelected = el.children[0].options[el.children[0].selectedIndex].text\r\n\r\n        while (el.children[0].firstChild) {\r\n            el.children[0].removeChild(el.children[0].firstChild)\r\n        }\r\n\r\n        curSailors.forEach((sailor) => {\r\n            const nameOpt = document.createElement('option')\r\n            nameOpt.value, (nameOpt.innerText = sailor)\r\n            el.children[0].append(nameOpt)\r\n        })\r\n        const allOpt = document.createElement('option')\r\n        allOpt.value = 'All'\r\n        allOpt.text = 'All'\r\n        el.children[0].append(allOpt)\r\n\r\n        console.log(curSailors.indexOf(prevSelected), el.children[0].options)\r\n        if (curSailors.indexOf(prevSelected) != -1) {\r\n            el.children[0].selectedIndex = curSailors.indexOf(prevSelected)\r\n        } else {\r\n            // console.log('FIRST CHILD:', el.children[0].options[0].text)\r\n            el.children[0].options[0].selected = true\r\n        }\r\n    })\r\n}\r\n\r\nasync function updateRegattas(teamSelect, regattaSelect, season) {\r\n    loadingEl.style.display = 'block'\r\n\r\n    // options = {\r\n    //     method: 'POST',\r\n    //     headers: { 'Content-Type': 'application/json' },\r\n    //     body: JSON.stringify({ link: teamSelect.value, season: season }),\r\n    // }\r\n    // const response = await fetch(API_URL + '/regattas', options)\r\n    // let json = await response.json()\r\n\r\n    let regattasList = await getRegattas({ schoolLink: teamSelect.value, season: season })\r\n    regattasList = regattasList.data\r\n\r\n    // console.log(response.status)\r\n    if (Object.keys(regattasList).length > 0) {\r\n        // let curList = json.regattas\r\n        // regattasList = {\r\n        //     ...json.regattas,\r\n        // }\r\n        console.log(regattasList)\r\n\r\n        if (regattaSelect.firstChild) {\r\n            //Deletes regatta even if selected on another team :/\r\n            // delete regattas[regattaSelect.options[regattaSelect.selectedIndex].text]\r\n        }\r\n\r\n        while (regattaSelect.firstChild) {\r\n            regattaSelect.removeChild(regattaSelect.firstChild)\r\n        }\r\n\r\n        Object.keys(regattasList).forEach((regatta) => {\r\n            const regattaOpt = document.createElement('option')\r\n            regattaOpt.value = regattasList[regatta].link\r\n            regattaOpt.text = regatta\r\n            regattaSelect.append(regattaOpt)\r\n        })\r\n        const allOpt = document.createElement('option')\r\n        allOpt.value = 'All'\r\n        allOpt.text = 'All'\r\n        regattaSelect.append(allOpt)\r\n\r\n        console.log('Regattas Filled in')\r\n    } else {\r\n        alert('Team not found')\r\n    }\r\n    loadingEl.style.display = 'none'\r\n}\r\n\r\nasync function addRegatta() {\r\n    console.log('Adding regatta')\r\n\r\n    const regatta = document.createElement('div')\r\n    regatta.classList.add('dataset')\r\n\r\n    const seasonSelect = document.createElement('select')\r\n    seasonSelect.classList.add('selectBox')\r\n\r\n    seasons.forEach((season) => {\r\n        const seasonOpt = document.createElement('option')\r\n        seasonOpt.value, (seasonOpt.innerText = season)\r\n        seasonSelect.append(seasonOpt)\r\n    })\r\n\r\n    const teamSelect = document.createElement('select')\r\n    teamSelect.classList.add('selectBox')\r\n\r\n    let schools = await getSchools({ district: 'NWISA' })\r\n    console.log(schools.data)\r\n\r\n    Object.keys(schools.data).forEach((teamName) => {\r\n        const teamOpt = document.createElement('option')\r\n        teamOpt.value = schools.data[teamName]\r\n        teamOpt.text = teamName\r\n        teamSelect.append(teamOpt)\r\n    })\r\n    loadingEl.style.display = 'none'\r\n\r\n    const regattaSelect = document.createElement('select')\r\n    regattaSelect.classList.add('selectBox')\r\n\r\n    await updateRegattas(teamSelect, regattaSelect, seasonSelect.value)\r\n\r\n    seasonSelect.addEventListener('change', async () => {\r\n        await updateRegattas(teamSelect, regattaSelect, seasonSelect.value)\r\n        //regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value\r\n        readData()\r\n        await loadData()\r\n    })\r\n    teamSelect.addEventListener('change', async () => {\r\n        await updateRegattas(teamSelect, regattaSelect, seasonSelect.value)\r\n        //regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value\r\n        readData()\r\n        await loadData()\r\n    })\r\n    regattaSelect.addEventListener('change', async () => {\r\n        console.log(regattaSelect.value, 'VAL')\r\n        if (regattaSelect.value != '') {\r\n            //regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value\r\n            readData()\r\n            await loadData()\r\n        }\r\n    })\r\n    // while (Object.keys(regattas).length === 0) {\r\n    Array.from(regattaEls.children).forEach((el) => {\r\n        regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value\r\n    })\r\n    // for (let i = 0; i < regattaEls.children.length - 1; i++) {\r\n    //     let el = regattaEls.children[i]\r\n    //     //regattaSelect.options[regattaSelect.selectedIndex].text\r\n    //     console.log(el.children[2].options[el.children[2].selectedIndex].text)\r\n    //     regattas[el.children[2].options[el.children[2].selectedIndex].text] = el.children[2].value\r\n    // }\r\n    // }\r\n    // regattas[regattaSelect.options[regattaSelect.selectedIndex].text] = regattaSelect.value\r\n    // await loadData()\r\n\r\n    readData()\r\n\r\n    const flexGap = document.createElement('div')\r\n    flexGap.classList.add('flexGap')\r\n\r\n    const delDataset = document.createElement('button')\r\n    delDataset.classList.add('delDataset', 'fa-lg', 'fa-solid', 'fa-trash')\r\n    // delDataset.innerHTML = '-'\r\n    delDataset.addEventListener('click', () => {\r\n        // delete regattas[regattaSelect.options[regattaSelect.selectedIndex].text]\r\n        regatta.remove()\r\n        updateGraph()\r\n    })\r\n\r\n    regatta.append(seasonSelect)\r\n    regatta.append(teamSelect)\r\n    regatta.append(regattaSelect)\r\n    regatta.append(flexGap)\r\n    regatta.append(delDataset)\r\n    regattaEls.append(regatta)\r\n}\r\n\r\naddRegattaButton.addEventListener('click', () => {\r\n    addRegatta()\r\n})\r\nasync function addPerson() {\r\n    console.log('Adding person')\r\n    const person = document.createElement('div')\r\n    person.classList.add('dataset')\r\n\r\n    const nameSelect = document.createElement('select')\r\n    nameSelect.classList.add('selectBox')\r\n\r\n    console.log('sailors', curSailors)\r\n    curSailors.forEach((sailor) => {\r\n        const nameOpt = document.createElement('option')\r\n        nameOpt.value, (nameOpt.innerText = sailor)\r\n        nameSelect.append(nameOpt)\r\n    })\r\n\r\n    const colorSelect = document.createElement('input')\r\n    colorSelect.type = 'color'\r\n    colorSelect.classList.add('colSelect')\r\n\r\n    const fleetSel = document.createElement('select')\r\n    fleetSel.classList.add('selectBox', 'tooltip')\r\n    fleetSel.dataset['tooltip'] = 'Select Fleet'\r\n    let fleets = ['All', 'Gold', 'Silver']\r\n    fleets.forEach((fleet) => {\r\n        const fleetOpt = document.createElement('option')\r\n        fleetOpt.value, (fleetOpt.innerText = fleet)\r\n        fleetSel.append(fleetOpt)\r\n    })\r\n\r\n    const divSelect = document.createElement('select')\r\n    divSelect.classList.add('selectBox')\r\n    let divisions = ['All', 'A', 'B']\r\n    divisions.forEach((division) => {\r\n        const divOpt = document.createElement('option')\r\n        divOpt.value, (divOpt.innerText = division)\r\n        divSelect.append(divOpt)\r\n    })\r\n\r\n    const posSelect = document.createElement('select')\r\n    posSelect.classList.add('selectBox')\r\n    let positions = ['All', 'Skipper', 'Crew']\r\n    positions.forEach((position) => {\r\n        const posOpt = document.createElement('option')\r\n        posOpt.value, (posOpt.innerText = position)\r\n        posSelect.append(posOpt)\r\n    })\r\n\r\n    nameSelect.addEventListener('change', () => {\r\n        updateGraph()\r\n    })\r\n    colorSelect.addEventListener('change', () => {\r\n        updateGraph()\r\n    })\r\n    fleetSel.addEventListener('change', async () => {\r\n        updateGraph()\r\n    })\r\n    divSelect.addEventListener('change', async () => {\r\n        updateGraph()\r\n    })\r\n    posSelect.addEventListener('change', async () => {\r\n        updateGraph()\r\n    })\r\n\r\n    const flexGap = document.createElement('div')\r\n    flexGap.classList.add('flexGap')\r\n\r\n    const delDataset = document.createElement('button')\r\n    delDataset.classList.add('delDataset', 'fa-lg', 'fa-solid', 'fa-trash')\r\n    delDataset.addEventListener('click', () => {\r\n        person.remove()\r\n        updateGraph()\r\n    })\r\n\r\n    person.append(nameSelect)\r\n    person.append(colorSelect)\r\n    person.append(fleetSel)\r\n    person.append(divSelect)\r\n    person.append(posSelect)\r\n    person.append(flexGap)\r\n    person.append(delDataset)\r\n    peopleEls.append(person)\r\n    updateGraph()\r\n}\r\n\r\naddPersonButton.addEventListener('click', () => {\r\n    addPerson()\r\n})\r\n\n\n//# sourceURL=webpack://sailing-pairs/./docs/scores2.js?");

/***/ })

}]);