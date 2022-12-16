import { people, mobileSize, firebaseConfig } from './info.js'
import { compareFn, compareFnObj, formatDate } from './client.js'
import { initializeApp } from 'firebase/app'
import { addDoc, collection, doc, getDoc, getDocs, deleteDoc, docRef, getFirestore, onSnapshot } from 'firebase/firestore'

const left = document.getElementById('left')
const right = document.getElementById('right')
const nameList = document.getElementById('listContainer')
const pairingHolder = document.getElementById('pairingHolder')
const loadHolder = document.getElementById('loadDropContainer')
const loadText = document.getElementById('loadText')
const loadSaveContainer = document.getElementById('loadSaveContainer')
const localSaved = document.getElementById('localSaved')
const officialList = document.getElementById('officialList')
const loadPermBtn = document.getElementById('loadPermBtn')
const seasonSelect = document.getElementById('seasonSelect')
const teamSelect = document.getElementById('teamSelect')

const countNamesHolder = document.getElementById('countNamesHolder')
const countWindow = document.getElementById('countWindow')
const countButton = document.getElementById('countButton')

const nameInput = document.getElementById('nameInput')
const saveButton = document.getElementById('save')
const saveButtonLocal = document.getElementById('saveLocal')
const saveButtonOfficial = document.getElementById('saveOfficial')
const selectAbsent = document.getElementById('selectAbsent')
const selectLocked = document.getElementById('selectLocked')
const resetPairs = document.getElementById('resetPairs')
const randomPairs = document.getElementById('randomPairs')

const picModeButton = document.getElementById('picMode')
const boatDisplay = document.getElementById('boatDisplay')
const betoEl = document.getElementById('betoEl')

const boatCountRnd = document.getElementById('boatCountRnd')
const prevPartRnd = document.getElementById('prevPartRnd')

const prevPairs = document.getElementById('prevPairs')
const prevPairsWindow = document.getElementById('prevPairsWindow')
const prevPairsHolder = document.getElementById('prevPairsHolder')
const selectedName = document.getElementById('selectedName')

let picMode = false
let selAbsent = false
let selLocked = false
let byPos = true
let byBoatCount = false
let byPrevParts = true
let absent = []
let locked = []
let boatDisplayVal = 'true'

let pageReads = 0

// Initialize Firebase
initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const db = getFirestore()

const pairsDB = collection(db, 'pairs')
const backupDB = collection(db, 'backup-pairs')
const officialDB = collection(db, 'official-pairs')

// getDocs(pairsDB).then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         console.log(doc.data(), doc.id)
//     })
// })

let mobile = window.matchMedia(`only screen and (max-width: ${mobileSize})`).matches
const observer = new ResizeObserver((entries) => {
    mobile = window.matchMedia(`only screen and (max-width: ${mobileSize})`).matches
})
observer.observe(document.body)

seasonSelect.value = localStorage.getItem('season') ? localStorage.getItem('season') : seasonSelect.value
let season = seasonSelect.value
teamSelect.value = localStorage.getItem('team') ? localStorage.getItem('team') : teamSelect.value
let team = teamSelect.value

let names = people[season][team].map((person) => person.name)

seasonSelect.onchange = async function () {
    season = seasonSelect.value
    names = people[season][team].map((person) => person.name)
    slotsLength = Math.floor(names.length / 2) * 3
    document.documentElement.style.setProperty('--slotCount', slotsLength / 3)
    makePairs()
    makeNames()
    let snapshot = await getDocs(officialDB)
    pageReads++
    updateOfficial(snapshot)
    localStorage.setItem('season', season)
}

teamSelect.onchange = function () {
    team = teamSelect.value
    names = people[season][team].map((person) => person.name)
    slotsLength = Math.floor(names.length / 2) * 3
    document.documentElement.style.setProperty('--slotCount', slotsLength / 3)
    makePairs()
    makeNames()
    localStorage.setItem('team', team)
}

// let betoQuotes = ['Hi',"I'm bad at sailing!"];
let betoClicks = 0
let sabrinaClicks = 0
let elliottClicks = 0

let prevClickName = ''
let prevClickTime

let slotsLength = Math.floor(names.length / 2) * 3
document.documentElement.style.setProperty('--slotCount', slotsLength / 3)
document.documentElement.style.setProperty('--colCount', 3)
console.log(slotsLength, 'slotsLength')

parseUrl()
makePairs(JSON.parse(window.localStorage.getItem('tempPairs')))
makeNames(JSON.parse(window.localStorage.getItem('tempPairs')))

getLocalSaved()

// dragging on desktop
nameList.addEventListener('dragover', (e) => {
    e.preventDefault()
    if (!mobile) {
        const draggingEl = document.querySelector('.dragging')
        if (draggingEl) nameList.appendChild(draggingEl)
    }
})

pairingHolder.addEventListener('dragover', (e) => {
    e.preventDefault()

    const afterElement = getDragAfterElement(e.clientY)
    const draggingEl = document.querySelector('.dragging2')

    if (afterElement == null && draggingEl) {
        pairingHolder.appendChild(draggingEl)
    } else if (draggingEl) {
        pairingHolder.insertBefore(draggingEl, afterElement)
    }
})

// deselecting on mobile
nameList.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target == nameList && mobile) {
        const tempSelected = document.querySelector('.selected')
        if (tempSelected != null || tempSelected != undefined) {
            nameList.append(tempSelected)
            tempSelected.classList.remove('selected')
            console.log('Removed 2')
        }
    }
})

// loadPermBtn.addEventListener('click', async () => {
//     loadingEl.style.display = 'block'
//     loadingEl.style.display = 'none'

//     makeNames(json.pairs[0].pairs)
//     makeNames(json.pairs[0].pairs)
// })

//Saving pairings
saveButton.addEventListener('click', async () => {
    if (nameInput.value != '') {
        let pairs = { name: nameInput.value }
        for (let i = 0; i < slotsLength; i++) {
            if (i % 3 == 0) {
                for (let j = 0; j < 3; j++) {
                    if (pairingHolder.children[i / 3].children[j + 1] != undefined && pairingHolder.children[i / 3].children[j + 1].children[0]) {
                        pairs[i + j] = pairingHolder.children[i / 3].children[j + 1].children[0].textContent
                    } else {
                        pairs[i + j] = ''
                    }
                }
            }
        }

        console.log(pairs)
        nameInput.value = ''
        loadingEl.style.display = 'block'
        addDoc(pairsDB, pairs)
        addDoc(backupDB, pairs)
        loadingEl.style.display = 'none'
        // console.log(json)

        //reset
        makePairs()
        makeNames()
    } else {
        alert('Please Enter Your Name')
    }
})
/*{0: 'Owen', 1: 'Talia', 2: '', 3: 'Nick', 4: 'Fin', 5: '', 6: 'Joseph', 7: 'Holden', 8: '', 9: 'Nelson', 10: 'Cyrus', 11: '', 12: 'Suraj', 13: 'Sharkey', 14: '', 15: 'Adam', 16: 'Gretchen I', 17: '', 18: 'Luke', 19: 'Payton', 20: '', 21: 'Chris', 22: 'Andrea', 23: '', 24: 'Elliott', 25: 'Carson', 26: '', 27: 'Carter', 28: 'Gretchen F', 29: '', 30: 'Jeffrey', 31: 'Stella', 32: '', 33: 'Isaia', 34: 'Maura', 35: '', 36: 'Nolan', 37: 'Kai', 38: '', 39: '', 40: '', 41: '', 42: '', 43: '', 44: '', 45: '', 46: '', 47: '', 48: '', 49: '', 50: '', name: 'temp'} */
saveButtonOfficial.addEventListener('click', async () => {
    if (nameInput.value != '') {
        if (confirm('Are you sure you want to save these pairings officially?')) {
            let inputDate = prompt('Enter date of pairings (Leave blank for todays date) (YYYY-MM-DD)')
            if (inputDate != '' && inputDate.length != 10) {
                alert('Invalid Date Format')
                return
            } else {
                inputDate = formatDate(new Date(), 0)
            }
            let pairs = { name: nameInput.value, practiceDate: inputDate, season: season }
            for (let i = 0; i < slotsLength; i++) {
                if (i % 3 == 0) {
                    for (let j = 0; j < 3; j++) {
                        if (pairingHolder.children[i / 3].children[j + 1] != undefined && pairingHolder.children[i / 3].children[j + 1].children[0]) {
                            pairs[i + j] = pairingHolder.children[i / 3].children[j + 1].children[0].textContent
                        } else {
                            pairs[i + j] = ''
                        }
                    }
                }
            }

            console.log(pairs)
            nameInput.value = ''

            //send to server
            loadingEl.style.display = 'block'
            addDoc(officialDB, pairs)
            loadingEl.style.display = 'none'

            //reset
            makePairs()
            makeNames()
        }
    } else {
        alert('Please Enter Your Name')
    }
})
saveButtonLocal.addEventListener('click', () => {
    if (nameInput.value != '') {
        let pairs = { name: nameInput.value }
        for (let i = 0; i < slotsLength; i++) {
            if (i % 3 == 0) {
                for (let j = 0; j < 3; j++) {
                    if (pairingHolder.children[i / 3].children[j + 1] != undefined && pairingHolder.children[i / 3].children[j + 1].children[0]) {
                        pairs[i + j] = pairingHolder.children[i / 3].children[j + 1].children[0].textContent
                    } else {
                        pairs[i + j] = ''
                    }
                }
            }
        }
        console.log(pairs)
        nameInput.value = ''

        let oldpairs = JSON.parse(window.localStorage.getItem('pairs'))
        if ((oldpairs != undefined) & (oldpairs != null)) {
            oldpairs.push(pairs)
        } else {
            oldpairs = []
            oldpairs.push(pairs)
        }

        window.localStorage.setItem('pairs', JSON.stringify(oldpairs))

        //reset
        makePairs()
        makeNames()
    } else {
        alert('Please Enter Your Name')
    }
})

countButton.addEventListener('click', () => {
    countWindow.style.display = 'block'
})
countWindow.addEventListener('click', (e) => {
    if (e.target == countWindow) countWindow.style.display = 'none'
})
prevPairs.addEventListener('click', (e) => {
    if (e.target == prevPairs) prevPairs.style.display = 'none'
})

loadText.addEventListener('click', () => {
    if (loadText.style.display == 'grid') {
        loadSaveContainer.style.display = 'none'
    } else {
        loadSaveContainer.style.display = 'grid'
    }
})
loadSaveContainer.addEventListener('click', (e) => {
    if (e.target == loadSaveContainer) loadSaveContainer.style.display = 'none'
})

selectAbsent.addEventListener('click', () => {
    selAbsent = !selAbsent
    selectAbsent.classList.toggle('absent')
})
selectLocked.addEventListener('click', () => {
    selLocked = !selLocked
    selectLocked.classList.toggle('locked')
})

//Reset pairs button
resetPairs.addEventListener('click', () => {
    makeNames()
    makePairs()
    locked = []
    absent = []

    saveTemp()

    document.querySelectorAll('.name').forEach((name) => {
        if (name.classList.contains('absent')) name.classList.remove('absent')
        if (name.classList.contains('locked')) name.classList.remove('locked')
    })
})

boatDisplay.addEventListener('click', () => {
    if (boatDisplayVal == 'true') {
        boatDisplayVal = 'false'
    } else {
        boatDisplayVal = 'true'
    }
    document.querySelectorAll('.pairSlotHolder').forEach((slot) => {
        slot.setAttribute('boatDisplay', boatDisplayVal)
    })
})

function makePairs(inputPairs) {
    // Creates pair slots either empty or populated with inputPairs object
    // deletes all previous pair slots
    while (pairingHolder.firstChild) {
        pairingHolder.removeChild(pairingHolder.firstChild)
    }
    let newNames
    // console.log(inputPairs)
    if (inputPairs != undefined) {
        let newInput = Object.values(inputPairs)
        if (newInput.length <= slotsLength - 6) {
            newNames = newInput.slice(0, (slotsLength / 3) * 2)
            for (let i = 0; i < newNames.length; i++) {
                if (i % 3 == 2) {
                    newNames.splice(i, 0, '')
                }
            }
        } else {
            newNames = Object.values(inputPairs)
        }
    }
    // console.log(newNames)
    // Creates all pair slots
    for (let i = 0; i < slotsLength; i++) {
        if (i % 3 == 0) {
            const pairSlotHolder = document.createElement('div')
            pairSlotHolder.classList.add('pairSlotHolder')
            pairSlotHolder.setAttribute('boatDisplay', boatDisplayVal)
            pairSlotHolder.setAttribute('draggable', true)

            pairSlotHolder.addEventListener('dragstart', (e) => {
                if (e.target == pairSlotHolder) pairSlotHolder.classList.add('dragging2')
            })
            pairSlotHolder.addEventListener('dragend', () => {
                pairSlotHolder.classList.remove('dragging2')
            })
            const pairSlotDrag = document.createElement('div')
            pairSlotDrag.classList.add('pairDrag', 'fa-lg', 'fa-bars', 'fa-solid')
            // pairSlotDrag.addEventListener('dragend')
            pairSlotHolder.appendChild(pairSlotDrag)

            for (let j = 0; j < 3; j++) {
                const pairSlotEl = document.createElement('div')
                pairSlotEl.classList.add('pairSlot')

                //If input pairing supplied then populate with new name  && i % 3 != 2
                if (inputPairs != undefined && newNames[i + j] != '' && newNames[i + j] != undefined) {
                    const nameEl = makeName(newNames[i + j])
                    pairSlotEl.appendChild(nameEl)
                }

                //add event listeners
                pairSlotEl.addEventListener('click', (e) => {
                    const tempSelected = document.querySelector('.selected')
                    if (tempSelected != null || tempSelected != undefined) {
                        pairSlotEl.append(tempSelected)
                        if (e.target != tempSelected) {
                            tempSelected.classList.remove('selected')
                            // console.log("Removed 3")
                            saveTemp()
                        }
                    }
                })
                pairSlotEl.addEventListener('dragover', (e) => {
                    e.preventDefault()
                    // console.log(e)
                    if (!mobile) {
                        const draggingEl = document.querySelector('.name.dragging')
                        // console.log(draggingEl)
                        // console.log(pref[names.indexOf(draggingEl.textContent)]);
                        if (pairSlotEl.childElementCount < 2 && draggingEl) {
                            //&& pref[names.indexOf(draggingEl.textContent)]
                            pairSlotEl.appendChild(draggingEl)
                        }
                    }
                })
                pairSlotHolder.appendChild(pairSlotEl)
            }
            pairingHolder.appendChild(pairSlotHolder)
        }
    }
    saveTemp()
}
function makeNames(inputPairs) {
    // makes name list without the input parings
    while (nameList.firstChild) {
        // removed all previous names
        nameList.removeChild(nameList.firstChild)
    }
    // if input pairs supplied then dont create those names
    if (inputPairs != undefined) {
        let tempNames = names.slice()
        let newNames = Object.values(inputPairs)
        // console.log('newnames', newNames)
        let len = newNames.length
        if (Object.values(inputPairs).length > slotsLength - 6) len--
        for (let i = 0; i < len; i++) {
            if (newNames[i] != '' && newNames[i] != undefined) {
                tempNames.splice(tempNames.indexOf(newNames[i]), 1)
                // console.log(tempNames)
            }
        }
        console.log('Tempnames:', tempNames)
        tempNames.forEach((name) => {
            const nameEl = makeName(name)
            nameList.appendChild(nameEl)
            if (absent.includes(nameEl.innerHTML)) {
                nameEl.classList.add('absent')
            }
        })
    } else {
        // otherwise make all names
        names.forEach((name) => {
            const nameEl = makeName(name)
            nameList.appendChild(nameEl)
        })
    }
}
function makeName(name) {
    // creates single name
    const nameEl = document.createElement('button')
    if (picMode == false) {
        nameEl.textContent = name
    } else {
        nameEl.innerHTML = name
        let noPics = ['Adam', 'Alexander', 'Owen', 'Cascade', 'Cyrus', 'Gretchen I', 'Gretchen F', 'Holden', 'Nelson', 'Stella', 'Suraj', 'Zephyr']
        if (!noPics.includes(name)) {
            const profilePic = document.createElement('img')
            profilePic.classList.add('profilePic')
            profilePic.src = '/img/ppl/' + name + '.png'
            // if(name == "Carter"){
            //     profilePic.src = people[7].pic;
            // }
            nameEl.appendChild(profilePic)
        }
    }
    nameEl.classList.add('name', 'draggable')
    nameEl.setAttribute('draggable', 'true')
    if (locked.includes(name)) nameEl.classList.add('locked')
    if (absent.includes(name)) nameEl.classList.add('absent')

    if (!mobile) {
        // if on desktop
        //Event listeners for dragging
        nameEl.addEventListener('dragstart', () => {
            nameEl.classList.add('dragging')
        })

        nameEl.addEventListener('dragend', async () => {
            for (let i = 0; i < slotsLength / 3; i++) {
                for (let j = 1; j < 4; j++) {
                    const cur = pairingHolder.children[i].children[j]
                    //console.log(cur)
                    if (cur.childElementCount > 1) {
                        nameList.appendChild(cur.children[0])
                    }
                }
            }

            nameEl.classList.remove('dragging')
            saveTemp()
            console.log('dragend: ', nameEl.textContent)
        })

        nameEl.addEventListener('click', async () => {
            if (selAbsent) {
                if (!absent.includes(nameEl.innerHTML)) {
                    absent.push(nameEl.innerHTML)
                    nameEl.classList.add('absent')
                    nameList.appendChild(nameEl)
                } else {
                    absent.splice(absent.indexOf(nameEl.innerHTML), 1)
                    nameEl.classList.remove('absent')
                }
                //console.log(absent);
            } else if (selLocked) {
                if (!locked.includes(nameEl.innerHTML)) {
                    locked.push(nameEl.innerHTML)
                    nameEl.classList.add('locked')
                } else {
                    locked.splice(locked.indexOf(nameEl.innerHTML), 1)
                    nameEl.classList.remove('locked')
                }
            }
        })
    } else {
        // otherwise mobile
        nameEl.addEventListener('click', async () => {
            if (!selAbsent && !selLocked) {
                const tempSelected = document.querySelector('.selected')
                if (tempSelected != null || tempSelected != undefined) {
                    nameEl.parentElement.append(tempSelected)
                    nameList.appendChild(nameEl)
                    tempSelected.classList.remove('selected')
                } else {
                    nameEl.classList.add('selected')
                }
            } else if (selAbsent) {
                if (!absent.includes(nameEl.innerHTML)) {
                    absent.push(nameEl.innerHTML)
                    nameEl.classList.add('absent')
                } else {
                    absent.splice(absent.indexOf(nameEl.innerHTML), 1)
                    nameEl.classList.remove('absent')
                }
                //console.log(absent);
            } else {
                if (!locked.includes(nameEl.innerHTML)) {
                    locked.push(nameEl.innerHTML)
                    nameEl.classList.add('locked')
                } else {
                    locked.splice(locked.indexOf(nameEl.innerHTML), 1)
                    nameEl.classList.remove('locked')
                }
            }

            for (let i = 0; i < slotsLength / 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cur = pairingHolder.children[i].children[j]
                    //console.log(cur)
                    if (cur.childElementCount > 1) {
                        nameList.appendChild(cur.children[0])
                    }
                }
            }
        })
    }
    nameEl.addEventListener('click', async () => {
        // console.log(prevClickName);
        let old = document.querySelector('.name.tooltip')
        if (old) {
            old.setAttribute('data-tooltip', '')
            old.classList.remove('tooltip')
        }

        if (prevClickName == name && Date.now() - prevClickTime < 250) {
            // nameEl.classList.add('tooltip')
            let prevParts = await getPrevPartners(name)
            // if (!mobile) {
            //   nameEl.setAttribute('data-tooltip', prevParts.join(', '))
            // } else {
            while (prevPairsHolder.firstChild) {
                prevPairsHolder.removeChild(prevPairsHolder.firstChild)
            }
            prevPairs.style.display = 'block'
            selectedName.textContent = name
            prevParts.forEach((partner) => {
                const nameEl = document.createElement('div')
                nameEl.classList.add('name')
                nameEl.innerHTML = partner
                prevPairsHolder.appendChild(nameEl)
            })
            // }
        }

        prevClickName = name
        prevClickTime = Date.now()
    })

    // if(name == 'Sabrina'){
    //     nameEl.addEventListener('click', ()=>{
    //         betoClicks++;
    //         if(betoClicks == 10){
    //             betoClicks = 0;
    //             console.log('Sabrina secret');
    //             location.href = 'https://smachef.wordpress.com'
    //         }
    //     })
    // }
    // if(name == 'Elliott'){
    //     nameEl.addEventListener('click', ()=>{
    //         elliottClicks++;
    //         if(elliottClicks == 10){
    //             elliottClicks = 0;
    //             console.log('Elliott secret');
    //             location.href = 'https://open.spotify.com/track/2QhURnm7mQDxBb5jWkbDug?si=806e79489ecd49bb'
    //             // location.href = 'https://exoplanetresearch.netlify.app/'
    //         }
    //     })
    // }

    return nameEl
}

function saveTemp() {
    let pairs = { name: 'temp' }
    // let pairsArray = []
    for (let i = 0; i < slotsLength; i++) {
        if (i % 3 == 0) {
            for (let j = 0; j < 3; j++) {
                if (pairingHolder.children[i / 3].children[j + 1] != undefined && pairingHolder.children[i / 3].children[j + 1].children[0]) {
                    pairs[i + j] = pairingHolder.children[i / 3].children[j + 1].children[0].textContent
                } else {
                    pairs[i + j] = ''
                }
            }
        }
    }
    console.log('Pairs', pairs)

    window.localStorage.setItem('tempPairs', JSON.stringify(pairs))
}

onSnapshot(pairsDB, async (snapshot) => {
    pageReads++
    loadingEl.style.display = 'block'
    let namesObj = {}
    snapshot.docs.forEach((doc) => {
        namesObj[doc.data().name] = doc.id
    })
    let names = Object.keys(namesObj)

    // if names exist create buttons for them
    if (names.length > 0) {
        while (loadHolder.firstChild) {
            // remove old buttons
            loadHolder.removeChild(loadHolder.firstChild)
        }
        // loop through names and create button
        for (let i = 0; i < names.length; i++) {
            const loadNameHolder = document.createElement('div')
            loadNameHolder.classList.add('loadNameHolder')

            const loadName = document.createElement('button')
            loadName.classList.add('loadName')
            loadName.textContent = names[i]
            let tempName = loadName.textContent.replace(' ', '%20')
            let tempSeason = season[0] + season[season.length - 2] + season[season.length - 1]
            let link = `https://www.bhspairs.cf/?${tempSeason}/?p/${tempName}`
            loadName.addEventListener('click', async () => {
                // console.log(namesObj)
                let pairs = await getPairs(namesObj[names[i]])
                // window.location.href = link

                // if pairs exist create them
                if (pairs != null) {
                    makeNames(pairs)
                    makePairs(pairs)
                    nameInput.value = ''
                } else {
                    makeNames()
                    makePairs()
                    alert('No pairs saved under this name.')
                }
                loadSaveContainer.style.display = 'none'
            })

            //Delete button
            if (!mobile) {
                const loadDel = document.createElement('button')
                loadDel.classList.add('loadDel')
                const loadDelIcon = document.createElement('i')
                loadDelIcon.classList.add('fa-trash', 'fa-solid', 'fa-lg')
                loadDel.appendChild(loadDelIcon)
                loadDel.addEventListener('click', async () => {
                    loadingEl.style.display = 'block'
                    const docRef = doc(db, 'pairs', namesObj[names[i]])
                    await deleteDoc(docRef)
                    loadingEl.style.display = 'none'
                })

                const copyLink = document.createElement('button')
                copyLink.classList.add('loadDel')
                const copyLinkIcon = document.createElement('i')
                copyLinkIcon.classList.add('fa-copy', 'fa-solid', 'fa-lg')
                copyLink.appendChild(copyLinkIcon)
                copyLink.addEventListener('click', () => {
                    navigator.clipboard.writeText(link)
                })

                loadNameHolder.appendChild(loadName)
                loadNameHolder.appendChild(copyLink)
                loadNameHolder.appendChild(loadDel)
            } else {
                loadNameHolder.appendChild(loadName)
            }
            loadHolder.appendChild(loadNameHolder)
        }
    }
    loadingEl.style.display = 'none'
})

onSnapshot(officialDB, (snapshot) => {
    pageReads++
    updateOfficial(snapshot)
})

function updateOfficial(snapshot) {
    console.log(`Updating official w/${snapshot.docs}`)
    let namesObj = {}
    snapshot.docs.forEach((doc) => {
        console.log(doc.data().season == season)
        if (doc.data().season == season) namesObj[doc.data().name] = doc.id
    })
    let names = Object.keys(namesObj)
    let sorted = names.sort(compareFn)

    while (officialList.firstChild) {
        // remove old buttons
        officialList.removeChild(officialList.firstChild)
    }

    if (names.length > 0) {
        // loop through names and create button
        for (let i = 0; i < sorted.length; i++) {
            const loadNameHolder = document.createElement('div')
            loadNameHolder.classList.add('loadNameHolder')

            const loadName = document.createElement('button')
            loadName.classList.add('loadName')
            loadName.textContent = sorted[i]
            let tempName = loadName.textContent.replace(' ', '%20')
            let tempSeason = season[0] + season[season.length - 2] + season[season.length - 1]
            let link = `https://www.bhspairs.cf/?${tempSeason}/?o/${tempName}`
            loadName.addEventListener('click', async () => {
                //on click get pairings from server
                loadingEl.style.display = 'block'
                let pairs = await getPairsOfficialOne(namesObj[sorted[i]])
                loadingEl.style.display = 'none'

                // window.location.href = link
                // if pairs exist create them
                if (pairs != null) {
                    makeNames(pairs)
                    makePairs(pairs)
                    nameInput.value = ''
                } else {
                    makeNames()
                    makePairs()
                    alert('No pairs saved under this name.')
                }
                loadSaveContainer.style.display = 'none'
            })
            loadNameHolder.appendChild(loadName)
            if (!mobile) {
                const copyLink = document.createElement('button')
                copyLink.classList.add('loadDel')
                const copyLinkIcon = document.createElement('i')
                copyLinkIcon.classList.add('fa-copy', 'fa-solid', 'fa-lg')
                copyLink.appendChild(copyLinkIcon)
                copyLink.addEventListener('click', () => {
                    navigator.clipboard.writeText(link)
                })
                loadNameHolder.appendChild(copyLink)
            }

            officialList.appendChild(loadNameHolder)
        }
    }
    console.log('PAGE READS:', pageReads)
}

//Gets list of saved paring names from server
function getLocalSaved() {
    let curPairs = JSON.parse(window.localStorage.getItem('pairs'))
    console.log(curPairs)
    if (curPairs != null) {
        while (localSaved.firstChild) {
            // remove old buttons
            localSaved.removeChild(localSaved.firstChild)
        }
        // loop through names and create button
        for (let i = 0; i < curPairs.length; i++) {
            const loadNameHolder = document.createElement('div')
            loadNameHolder.classList.add('loadNameHolder')

            const loadName = document.createElement('button')
            loadName.classList.add('loadName')
            loadName.textContent = curPairs[i].name
            loadName.addEventListener('click', () => {
                // if pairs exist create them
                if (curPairs[i] != null) {
                    makeNames(curPairs[i])
                    makePairs(curPairs[i])
                    nameInput.value = ''
                } else {
                    getLocalSaved()
                    makeNames()
                    makePairs()
                    alert('No pairs saved under this name.')
                }
            })

            //Delete button
            if (!mobile) {
                const loadDel = document.createElement('button')
                loadDel.classList.add('loadDel')
                const loadDelIcon = document.createElement('i')
                loadDelIcon.classList.add('fa-trash', 'fa-solid', 'fa-lg')
                loadDel.appendChild(loadDelIcon)
                loadDel.addEventListener('click', () => {
                    curPairs.splice(i, 1)
                    console.log(curPairs)
                    window.localStorage.setItem('pairs', JSON.stringify(curPairs))
                    getLocalSaved()
                })
                loadNameHolder.appendChild(loadDel)
            }
            loadNameHolder.appendChild(loadName)
            localSaved.appendChild(loadNameHolder)
        }
    }
}

function getBoatCount(snapshot, rtn) {
    let pairingsObj = {}
    snapshot.docs.forEach((doc) => {
        data[doc.id] = doc.data()
    })
    let pairings = Object.values(pairingsObj)

    let fjCount = new Array(names.length).fill(0)
    let c420Count = new Array(names.length).fill(0)
    let e420Count = new Array(names.length).fill(0)

    let fjCut = 8 * 3
    let e420Cut = fjCut + 6 * 3
    let c420Cut = e420Cut + 2 * 3

    for (let i = 0; i < pairings.length; i++) {
        console.log(Object.values(pairings[i]).length)
        for (let j = 0; j < fjCut; j++) {
            fjCount[names.indexOf(pairings[i][j])]++
        }
        for (let j = fjCut; j < e420Cut; j++) {
            e420Count[names.indexOf(pairings[i][j])]++
        }
        for (let j = e420Cut; j < c420Cut; j++) {
            c420Count[names.indexOf(pairings[i][j])]++
        }
    }
    // console.log("Boat count",names,fjCount,c420Count,e420Count);
    if (rtn == undefined) {
        let girls = ['Elliott', 'Ava', 'Sabrina', 'Talia']
        for (let i = 0; i < names.length; i++) {
            const nameEl = document.createElement('div')
            nameEl.classList.add('countName')
            nameEl.innerHTML = names[i]

            const gapEl = document.createElement('div')
            gapEl.style.flexGrow = 1
            nameEl.appendChild(gapEl)

            const fjCountEl = document.createElement('div')
            fjCountEl.classList.add('boatCount')
            fjCountEl.innerHTML = fjCount[i]
            nameEl.appendChild(fjCountEl)

            const c420CountEl = document.createElement('div')
            c420CountEl.classList.add('boatCount')
            c420CountEl.innerHTML = c420Count[i]
            nameEl.appendChild(c420CountEl)

            const e420CountEl = document.createElement('div')
            e420CountEl.classList.add('boatCount')
            e420CountEl.innerHTML = e420Count[i]
            nameEl.appendChild(e420CountEl)

            if (fjCount[i] - c420Count[i] - e420Count[i] < 0 && !girls.includes(names[i])) {
                nameEl.setAttribute('boat-karma', 'positive')
            }
            if (fjCount[i] - c420Count[i] - e420Count[i] > 0 && !girls.includes(names[i])) {
                nameEl.setAttribute('boat-karma', 'negative')
            }

            countNamesHolder.appendChild(nameEl)
        }
    } else {
        let karmalist = {}
        for (let i = 0; i < names.length; i++) {
            karmalist[names[i]] = fjCount[i] - c420Count[i] - e420Count[i]
        }
        const sortable = Object.entries(karmalist)
            .sort((a, b) => a[1] - b[1])
            .map((el) => el[0])
        return sortable
    }
}

async function getPrevPartners(name, pairings) {
    let partners = []

    if (pairings == undefined) {
        // let options = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({}),
        // }
        loadingEl.style.display = 'block'
        // const response = await fetch(API_URL + '/getPairsOfficial', options)
        // pairings = await response.json()
        pairings = await getPairsOfficial()
        pageReads++
        loadingEl.style.display = 'none'
    }

    pairings = Object.values(pairings).sort(compareFnObj)

    for (let i = 0; i < pairings.length; i++) {
        let nameIndex = Object.values(pairings[i]).indexOf(name)

        if (Object.values(pairings[i]).includes(name)) {
            //if skipper slot and isnt empty crew
            if (nameIndex % 3 == 0 && pairings[i][nameIndex + 1] != undefined && pairings[i][nameIndex + 1] != '') {
                partners.push(pairings[i][nameIndex + 1])

                //if rotating slot is not empty
                if (pairings[i][nameIndex + 2] != undefined && pairings[i][nameIndex + 2] != '') {
                    partners.push(pairings[i][nameIndex + 2])
                }

                //if crew slot and skipper is not empty
            } else if (nameIndex % 3 == 1 && pairings[i][nameIndex - 1] != undefined && pairings[i][nameIndex - 1] != '') {
                partners.push(pairings[i][nameIndex - 1])

                //if rotating slot and skipper is not empty
            } else if (nameIndex % 3 == 2 && pairings[i][nameIndex - 2] != undefined && pairings[i][nameIndex - 2] != '') {
                partners.push(pairings[i][nameIndex - 2])
            }
        }
    }
    console.log('Previous partners of ', name, partners)
    return partners
}

//Gets the element after the one you are hovering on
function getDragAfterElement(y) {
    const draggableEls = [...pairingHolder.querySelectorAll('.pairSlotHolder')]

    return draggableEls.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element
}

async function parseUrl() {
    const urlArgs = window.location.search.split('/', 4)
    console.log(urlArgs)
    if (urlArgs[0] == '?F22') season = 'Fall 2022'
    if (urlArgs[0] == '?S23') season = 'Spring 2023'
    console.log(season)
    let pairingName
    if (urlArgs.length > 3) pairingName = urlArgs[2] + '/' + urlArgs[3]
    else pairingName = urlArgs[2]
    if (pairingName != undefined) pairingName = pairingName.replace('%20', ' ')
    if (urlArgs[1] == '?p') {
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pairingName, season: season }),
        }
        loadingEl.style.display = 'block'
        const response = await fetch(API_URL + '/getPairs', options)
        const json = await response.json()
        loadingEl.style.display = 'none'
        console.log(json)

        // if pairs exist create them
        if (json.pairs != null) {
            makeNames(json.pairs)
            makePairs(json.pairs)
            nameInput.value = ''
        } else {
            makeNames()
            makePairs()
            alert('No pairs saved under this name.')
            window.location.href = window.location.href.split('/?')[0]
        }
    } else if (urlArgs[1] == '?o') {
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pairingName, season: season }),
        }
        console.log(options.body)
        loadingEl.style.display = 'block'
        const response = await fetch(API_URL + '/getPairsOfficialOne', options)
        const json = await response.json()
        loadingEl.style.display = 'none'
        console.log(json)

        // if pairs exist create them
        if (json.pairs != null) {
            makeNames(json.pairs)
            makePairs(json.pairs)
            nameInput.value = ''
        } else {
            makeNames()
            makePairs()
            alert('No pairs saved under this name.')
        }
        loadSaveContainer.style.display = 'none'
    }
}

async function getPairs(id) {
    let data = {}
    let docRef = doc(db, 'pairs', id)
    let docSnap = await getDoc(docRef)
    pageReads++
    return docSnap.data()
}

async function getPairsOfficial() {
    let data = {}
    let snapshot = await getDocs(officialDB)
    pageReads++
    snapshot.docs.forEach((doc) => {
        data[doc.id] = doc.data()
    })
    return data
}
async function getPairsOfficialOne(id) {
    let data = {}
    let docRef = doc(db, 'official-pairs', id)
    let docSnap = await getDoc(docRef)
    pageReads++
    return docSnap.data()
}

export { byPos, byBoatCount, byPrevParts, slotsLength, names, absent, locked, season, team, getPairsOfficial, getPrevPartners, makeNames, makePairs }
