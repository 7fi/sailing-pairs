//Grab elements from dom
const left = document.getElementById('left')
const right = document.getElementById('right')
const nameList = document.getElementById('listContainer')
const pairingHolder = document.getElementById('pairingHolder')
const loadHolder = document.getElementById('loadDropContainer')
const loadingEl = document.getElementById('loadingEl')
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
const infoButton = document.getElementById('infoButton')
const infoWindow = document.getElementById('infoWindow')
const settingsWindow = document.getElementById('settingsWindow')

const nameInput = document.getElementById('nameInput')
const saveButton = document.getElementById('save')
const saveButtonLocal = document.getElementById('saveLocal')
const saveButtonOfficial = document.getElementById('saveOfficial')
const modeToggle = document.getElementById('modeToggle')
const selectAbsent = document.getElementById('selectAbsent')
const selectLocked = document.getElementById('selectLocked')
const settingsBtn = document.getElementById('settingsButton')
const resetPairs = document.getElementById('resetPairs')
const randomPairs = document.getElementById('randomPairs')
const squareMode = document.getElementById('squareMode')
const picModeButton = document.getElementById('picMode')
const boatDisplay = document.getElementById('boatDisplay')
const betoEl = document.getElementById('betoEl')

const boatCountRnd = document.getElementById('boatCountRnd')
const prevPartRnd = document.getElementById('prevPartRnd')

const prevPairs = document.getElementById('prevPairs')
const prevPairsWindow = document.getElementById('prevPairsWindow')
const prevPairsHolder = document.getElementById('prevPairsHolder')
const selectedName = document.getElementById('selectedName')

let lightMode = true
let square = false
let picMode = false
let selAbsent = false
let selLocked = false
let byPos = true
let byBoatCount = false
let byPrevParts = true
let absent = []
let locked = []
let boatDisplayVal = 'true'

seasonSelect.value = localStorage.getItem('season') ? localStorage.getItem('season') : seasonSelect.value
let season = seasonSelect.value
teamSelect.value = localStorage.getItem('team') ? localStorage.getItem('team') : teamSelect.value
let team = teamSelect.value

seasonSelect.onchange = function () {
  season = seasonSelect.value
  makePairs()
  makeNames()
  getSaved()
  localStorage.setItem('season', season)
}

teamSelect.onchange = function () {
  team = teamSelect.value
  makePairs()
  makeNames()
  getSaved()
  localStorage.setItem('team', team)
}

// let betoQuotes = ['Hi',"I'm bad at sailing!"];
let betoClicks = 0
let sabrinaClicks = 0
let elliottClicks = 0

let prevClickName = ''
let prevClickTime

var thisPage
console.log(window.location.href.split('/'))
if (window.location.href.includes('scores')) {
  thisPage = 'scores'
} else {
  thisPage = 'main'
}

/*else if(window.location.href.split("/")[window.location.href.split("/").length - 1] != ""){
    console.log(window.location.href.split("/")[window.location.href.split("/").length - 1]);
} */

//Check for mobile (only works on reload)
let mobile = window.matchMedia(`only screen and (max-width: ${mobileSize})`).matches
const observer = new ResizeObserver((entries) => {
  mobile = window.matchMedia(`only screen and (max-width: ${mobileSize})`).matches
})
observer.observe(document.body)

let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

const slotsLength = Math.floor(names[season][team].length / 2) * 3
document.documentElement.style.setProperty('--slotCount', slotsLength / 3)
document.documentElement.style.setProperty('--colCount', 3)
console.log(slotsLength, 'slotsLength')

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme)
  if (currentTheme === 'dark') {
    switchMode()
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0')
}

function formatDate(date, dateOffset) {
  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate() + dateOffset)].join('-')
}

function compareFn(a, b) {
  aMonth = parseInt(a.name.split(' ')[1].split('/')[0])
  aDay = parseInt(a.name.split(' ')[1].split('/')[1])
  bMonth = parseInt(b.name.split(' ')[1].split('/')[0])
  bDay = parseInt(b.name.split(' ')[1].split('/')[1])
  let num = 0
  if (aMonth < bMonth) num = -1
  else if (aMonth == bMonth && aDay < bDay) num = -1
  else if (aMonth == bMonth && aDay > bDay) num = 1
  else if (aMonth > bMonth) num = 1
  // else return 0
  return num
}

if (thisPage == 'main') {
  parseUrl()
  makePairs(JSON.parse(window.localStorage.getItem('tempPairs')))
  makeNames(JSON.parse(window.localStorage.getItem('tempPairs')))

  getSaved()
  getBoatCount()

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

  loadPermBtn.addEventListener('click', async () => {
    loadingEl.style.display = 'block'
    response = await fetch(API_URL + '/getPairsOfficial', options)
    json = await response.json()
    loadingEl.style.display = 'none'

    makeNames(json.pairs[0].pairs)
    makeNames(json.pairs[0].pairs)
  })

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

      //send to server
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pairs),
      }
      loadingEl.style.display = 'block'
      const response = await fetch(API_URL + '/pairs', options)
      const responseBackup = await fetch(API_URL + '/pairsBackup', options)
      // const json = await response.json()
      loadingEl.style.display = 'none'
      // console.log(json)

      //reset
      makePairs()
      makeNames()
      getSaved()
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
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pairs),
        }
        loadingEl.style.display = 'block'
        const response = await fetch(API_URL + '/pairsOfficial', options)
        const json = await response.json()
        loadingEl.style.display = 'none'
        console.log(json)

        //reset
        makePairs()
        makeNames()
        getSaved()
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
      getSaved()
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
    getSaved()
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
  settingsBtn.addEventListener('click', () => {
    settingsWindow.style.display = 'block'
  })
}

async function parseUrl() {
  const urlArgs = window.location.search.split('/', 4)
  console.log(urlArgs)
  if (urlArgs[0] == '?F22') season = 'Fall 2022'
  if (urlArgs[0] == '?S23') season = 'Spring 2023'
  console.log(season)
  let pairingName
  if (urlArgs.length > 3) pairingName = urlArgs[2] + '/' + urlArgs[3]
  else pairingName = urlArgs[1]
  if (pairingName != undefined) pairingName = pairingName.replace('%20', ' ')
  if (urlArgs[1] == '?p') {
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pairingName, season: season }),
    }
    loadingEl.style.display = 'block'
    const response = await fetch(API_URL + '/getPairs', options)
    const json = await response.json()
    loadingEl.style.display = 'none'
    console.log(json)

    getSaved()
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
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pairingName, season: season }),
    }
    loadingEl.style.display = 'block'
    const response = await fetch(API_URL + '/getPairsOfficialOne', options)
    const json = await response.json()
    loadingEl.style.display = 'none'
    console.log(json)

    getSaved()
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
    let tempNames = names[season][team].slice()
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
    names[season][team].forEach((name) => {
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

//Gets list of saved paring names from server
async function getSaved() {
  //Gets names from server
  options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ season: season }),
  }
  loadingEl.style.display = 'block'
  let response = await fetch(API_URL + '/getNames', options)
  let json = await response.json()
  loadingEl.style.display = 'none'
  console.log(json)

  // if names exist create buttons for them
  if (json.pairs != null) {
    while (loadHolder.firstChild) {
      // remove old buttons
      loadHolder.removeChild(loadHolder.firstChild)
    }
    // loop through names and create button
    for (let i = 0; i < json.pairs.length; i++) {
      const loadNameHolder = document.createElement('div')
      loadNameHolder.classList.add('loadNameHolder')

      const loadName = document.createElement('button')
      loadName.classList.add('loadName')
      loadName.textContent = json.pairs[i].name
      let tempName = loadName.textContent.replace(' ', '%20')
      let tempSeason = season[0] + season[season.length - 2] + season[season.length - 1]
      let link = `https://www.bhspairs.cf/?${tempSeason}/?p/${tempName}`
      loadName.addEventListener('click', async () => {
        //on click get pairings from server
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: loadName.textContent }),
        }
        loadingEl.style.display = 'block'
        const response = await fetch(API_URL + '/getPairs', options)
        const json = await response.json()
        loadingEl.style.display = 'none'
        console.log(json)
        window.location.href = link

        getSaved()
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
      })

      //Delete button
      if (!mobile) {
        const loadDel = document.createElement('button')
        loadDel.classList.add('loadDel')
        const loadDelIcon = document.createElement('i')
        loadDelIcon.classList.add('fa-trash', 'fa-solid', 'fa-lg')
        loadDel.appendChild(loadDelIcon)
        loadDel.addEventListener('click', async () => {
          //send deletion request to server
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: loadName.textContent, season: season }),
          }
          loadingEl.style.display = 'block'
          const response = await fetch(API_URL + '/delPair', options)
          const json = await response.json()
          loadingEl.style.display = 'none'
          console.log(json)
          getSaved()
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

  //Gets names from server
  loadingEl.style.display = 'block'
  response = await fetch(API_URL + '/getPairsOfficial', options)
  json = await response.json()
  loadingEl.style.display = 'none'

  sorted = Object.values(json.pairs).sort(compareFn)

  // if names exist create buttons for them
  if (json.pairs != null) {
    while (officialList.firstChild) {
      // remove old buttons
      officialList.removeChild(officialList.firstChild)
    }
    // loop through names and create button
    for (let i = 0; i < sorted.length; i++) {
      const loadNameHolder = document.createElement('div')
      loadNameHolder.classList.add('loadNameHolder')

      const loadName = document.createElement('button')
      loadName.classList.add('loadName')
      loadName.textContent = sorted[i].name
      let tempName = loadName.textContent.replace(' ', '%20')
      let tempSeason = season[0] + season[season.length - 2] + season[season.length - 1]
      let link = `https://www.bhspairs.cf/?${tempSeason}/?o/${tempName}`
      loadName.addEventListener('click', async () => {
        //on click get pairings from server
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: loadName.textContent, season: season }),
        }
        loadingEl.style.display = 'block'
        const response = await fetch(API_URL + '/getPairsOfficialOne', options)
        const json = await response.json()
        loadingEl.style.display = 'none'
        console.log(json)

        window.location.href = link
        getSaved()
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
      loadName.addEventListener('click', async () => {
        getSaved()
        // if pairs exist create them
        if (curPairs[i] != null) {
          makeNames(curPairs[i])
          makePairs(curPairs[i])
          nameInput.value = ''
        } else {
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
        loadDel.addEventListener('click', async () => {
          curPairs.splice(i, 1)
          console.log(curPairs)
          window.localStorage.setItem('pairs', JSON.stringify(curPairs))
          getSaved()
        })
        loadNameHolder.appendChild(loadDel)
      }
      loadNameHolder.appendChild(loadName)
      localSaved.appendChild(loadNameHolder)
    }
  }
}

async function getBoatCount(rtn) {
  options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }
  loadingEl.style.display = 'block'
  const response = await fetch(API_URL + '/getPairsOfficial', options)
  const pairings = await response.json()
  loadingEl.style.display = 'none'

  let fjCount = new Array(names[season][team].length).fill(0)
  let c420Count = new Array(names[season][team].length).fill(0)
  let e420Count = new Array(names[season][team].length).fill(0)

  let fjCut = 8 * 3
  let e420Cut = fjCut + 6 * 3
  let c420Cut = e420Cut + 2 * 3

  for (let i = 0; i < pairings.pairs.length; i++) {
    console.log(Object.values(pairings.pairs[i]).length)
    for (let j = 0; j < fjCut; j++) {
      fjCount[names[season][team].indexOf(pairings.pairs[i][j])]++
    }
    for (let j = fjCut; j < e420Cut; j++) {
      e420Count[names[season][team].indexOf(pairings.pairs[i][j])]++
    }
    for (let j = e420Cut; j < c420Cut; j++) {
      c420Count[names[season][team].indexOf(pairings.pairs[i][j])]++
    }
  }
  // console.log("Boat count",names,fjCount,c420Count,e420Count);
  if (rtn == undefined) {
    let girls = ['Elliott', 'Ava', 'Sabrina', 'Talia']
    for (let i = 0; i < names[season][team].length; i++) {
      const nameEl = document.createElement('div')
      nameEl.classList.add('countName')
      nameEl.innerHTML = names[season][team][i]

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

      if (fjCount[i] - c420Count[i] - e420Count[i] < 0 && !girls.includes(names[season][team][i])) {
        nameEl.setAttribute('boat-karma', 'positive')
      }
      if (fjCount[i] - c420Count[i] - e420Count[i] > 0 && !girls.includes(names[season][team][i])) {
        nameEl.setAttribute('boat-karma', 'negative')
      }

      countNamesHolder.appendChild(nameEl)
    }
  } else {
    let karmalist = {}
    for (let i = 0; i < names[season][team].length; i++) {
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
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
    loadingEl.style.display = 'block'
    const response = await fetch(API_URL + '/getPairsOfficial', options)
    pairings = await response.json()
  }
  loadingEl.style.display = 'none'

  pairings = Object.values(pairings.pairs).sort(compareFn)

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

settingsWindow.addEventListener('click', (e) => {
  if (e.target == settingsWindow) settingsWindow.style.display = 'none'
})

// Toggle between light and dark mode
modeToggle.addEventListener('click', () => {
  switchMode()
})
infoButton.addEventListener('click', () => {
  infoWindow.style.display = 'block'
})
infoWindow.addEventListener('click', (e) => {
  if (e.target == infoWindow) infoWindow.style.display = 'none'
})

function switchMode() {
  if (!lightMode) {
    modeToggle.children[0].classList.replace('fa-sun', 'fa-moon')
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  } else {
    modeToggle.children[0].classList.replace('fa-moon', 'fa-sun')
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  }

  lightMode = !lightMode
  // console.log(lightMode, 'HI')
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  console.log('Theme set to', theme)
}

// console.log(pickSternTier() + ' is assigned to do stern ties')
function pickSternTier() {
  let potentialPpl = []
  people['Fall 2022'].forEach((person) => {
    if (person.name != 'Elliott') potentialPpl.push(person.name)
  })
  return potentialPpl[Math.floor(Math.random() * potentialPpl.length)]
}
