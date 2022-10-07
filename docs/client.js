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

const countNamesHolder = document.getElementById('countNamesHolder')
const countWindow = document.getElementById('countWindow')
const countButton = document.getElementById('countButton')
const infoButton = document.getElementById('infoButton')
const infoWindow = document.getElementById('infoWindow')

const nameInput = document.getElementById('nameInput')
const saveButton = document.getElementById('save')
const saveButtonLocal = document.getElementById('saveLocal')
const saveButtonOfficial = document.getElementById('saveOfficial')
const modeToggle = document.getElementById('modeToggle')
const selectAbsent = document.getElementById('selectAbsent')
const selectLocked = document.getElementById('selectLocked')
const resetPairs = document.getElementById('resetPairs')
const randomPairs = document.getElementById('randomPairs')
const squareMode = document.getElementById('squareMode')
const picModeButton = document.getElementById('picMode')
const boatDisplay = document.getElementById('boatDisplay')
const betoEl = document.getElementById('betoEl')

let lightMode = true
let square = false
let picMode = false
let selAbsent = false
let selLocked = false
let absent = []
let locked = []
let boatDisplayVal = 'false'

let betoClicks = 0
// let betoQuotes = ['Hi',"I'm bad at sailing!"];
let sabrinaClicks = 0
let elliottClicks = 0

let prevClickName = ''
let prevClickTime

let rotatingSlot = true

var thisPage
console.log(window.location.href.split('/')[3])
if (window.location.href.includes('scores')) {
  thisPage = 'scores'
} else {
  thisPage = 'main'
}
/*else if(window.location.href.split("/")[window.location.href.split("/").length - 1] != ""){
    console.log(window.location.href.split("/")[window.location.href.split("/").length - 1]);
} */

//Check for mobile (only works on reload)
let mobile = window.matchMedia('only screen and (max-width: 1000px)').matches
let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

const API_URL = 'https://bhspairs.herokuapp.com' // For deployment
// const API_URL = 'http://localhost:3000'; // For development

const people = [
  { name: 'Adam', skipper: true, crew: false },
  { name: 'Alexander', skipper: true, crew: false },
  { name: 'Andreta', skipper: true, crew: true },
  { name: 'Ava', skipper: true, crew: true },
  { name: 'Ben', skipper: true, crew: false },
  { name: 'Beto', skipper: true, crew: false },
  { name: 'Carson', skipper: false, crew: true },
  {
    name: 'Carter',
    skipper: true,
    crew: false,
    pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',
  },
  { name: 'Chris', skipper: false, crew: true },
  { name: 'Cole', skipper: false, crew: true },
  { name: 'Cyrus', skipper: false, crew: true },
  { name: 'Elliott', skipper: true, crew: true },
  { name: 'Fin', skipper: false, crew: true },
  { name: 'Gretchen F', skipper: false, crew: true },
  { name: 'Gretchen I', skipper: false, crew: true },
  { name: 'Holden', skipper: false, crew: true },
  { name: 'Isaia', skipper: true, crew: true },
  { name: 'Jaya', skipper: false, crew: true },
  { name: 'Jeffrey', skipper: false, crew: true },
  { name: 'Joseph', skipper: false, crew: true },
  { name: 'Kai', skipper: false, crew: true },
  { name: 'Luke', skipper: false, crew: true },
  { name: 'Maura', skipper: true, crew: true },
  { name: 'Nelson', skipper: true, crew: true },
  { name: 'Nick', skipper: false, crew: true },
  { name: 'Nolan', skipper: true, crew: false },
  { name: 'Owen', skipper: true, crew: false },
  { name: 'Payton', skipper: false, crew: true },
  { name: 'Ryan', skipper: true, crew: false },
  { name: 'Sabrina', skipper: false, crew: true },
  { name: 'Sharkey', skipper: false, crew: true },
  { name: 'Stella', skipper: false, crew: true },
  { name: 'Suraj', skipper: false, crew: true },
  { name: 'Talia', skipper: false, crew: true },
  { name: 'Zephyr', skipper: false, crew: true },
]

// Name list
const names = [
  'Adam',
  'Alexander',
  'Andrea',
  'Ava',
  'Ben',
  'Beto',
  'Carson',
  'Carter',
  'Chris',
  'Cole',
  'Cyrus',
  'Elliott',
  'Fin',
  'Gretchen F',
  'Gretchen I',
  'Holden',
  'Isaia',
  'Jaya',
  'Jeffrey',
  'Joseph',
  'Kai',
  'Luke',
  'Maura',
  'Nelson',
  'Nick',
  'Nolan',
  'Owen',
  'Payton',
  'Ryan',
  'Sabrina',
  'Sharkey',
  'Stella',
  'Suraj',
  'Talia',
  'Zephyr',
]
const slotsLength = Math.floor(names.length / 2) * 2
document.documentElement.style.setProperty('--slotCount', slotsLength / 2)
if (rotatingSlot) {
  document.documentElement.style.setProperty('--colCount', 3)
} else {
  document.documentElement.style.setProperty('--colCount', 2)
}
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
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate() + dateOffset),
  ].join('-')
}

console.log(formatDate(new Date(), 0))

if (thisPage == 'main') {
  makePairs(JSON.parse(window.localStorage.getItem('tempPairs')))
  makeNames(JSON.parse(window.localStorage.getItem('tempPairs')))
  function makePairs(inputPairs) {
    // Creates pair slots either empty or populated with inputPairs object
    // deletes all previous pair slots
    while (pairingHolder.firstChild) {
      pairingHolder.removeChild(pairingHolder.firstChild)
    }
    let newNames
    console.log(inputPairs)
    if (inputPairs != undefined) {
      let newInput = Object.values(inputPairs)
      if (newInput.length <= slotsLength + 4) {
        newNames = newInput.slice(0, slotsLength)
        for (let i = 0; i < (slotsLength / 2) * 3; i++) {
          if (i % 3 == 2) {
            newNames.splice(i, 0, '')
          }
        }
      } else {
        newNames = Object.values(inputPairs)
      }
    }
    // console.log(newNames);
    // Creates all pair slots
    if (!rotatingSlot) {
      for (let i = 0; i < slotsLength; i++) {
        const pairSlotEl = document.createElement('div')
        pairSlotEl.classList.add('pairSlot')
        pairSlotEl.setAttribute('boatDisplay', boatDisplayVal)

        //If input pairing supplied then populate with new name
        if (inputPairs != undefined && inputPairs[i] != '' && inputPairs[i] != undefined) {
          const nameEl = makeName(inputPairs[i])
          pairSlotEl.appendChild(nameEl)
        }

        //add event listeners
        pairSlotEl.addEventListener('click', (e) => {
          const tempSelected = document.querySelector('.selected')
          if (tempSelected != null || tempSelected != undefined) {
            pairSlotEl.append(tempSelected)
            if (e.target != tempSelected) {
              tempSelected.classList.remove('selected')
              console.log('Removed 3')
            }
          }
        })
        pairSlotEl.addEventListener('dragover', (e) => {
          e.preventDefault()
          if (!mobile) {
            const draggingEl = document.querySelector('.dragging')
            // console.log(pref[names.indexOf(draggingEl.textContent)]);
            if (pairSlotEl.childElementCount < 2) {
              //&& pref[names.indexOf(draggingEl.textContent)]
              pairSlotEl.appendChild(draggingEl)
            }
          }
        })
        pairingHolder.appendChild(pairSlotEl)
      }
    } else {
      for (let i = 0; i < (slotsLength / 2) * 3; i++) {
        const pairSlotEl = document.createElement('div')
        pairSlotEl.classList.add('pairSlot')
        pairSlotEl.setAttribute('boatDisplay', boatDisplayVal)

        //If input pairing supplied then populate with new name  && i % 3 != 2
        if (inputPairs != undefined && newNames[i] != '' && newNames[i] != undefined) {
          const nameEl = makeName(newNames[i])
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
          if (!mobile) {
            const draggingEl = document.querySelector('.dragging')
            // console.log(pref[names.indexOf(draggingEl.textContent)]);
            if (pairSlotEl.childElementCount < 2) {
              //&& pref[names.indexOf(draggingEl.textContent)]
              pairSlotEl.appendChild(draggingEl)
            }
          }
        })
        pairingHolder.appendChild(pairSlotEl)
      }
    }
    saveTemp()
  }
  // makeNames();
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
      for (let i = 0; i < newNames.length - 1; i++) {
        if (newNames[i] != '' && newNames[i] != undefined) {
          tempNames.splice(tempNames.indexOf(newNames[i]), 1)
          console.log(tempNames)
        }
      }
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
      let noPics = [
        'Adam',
        'Alexander',
        'Owen',
        'Cascade',
        'Cyrus',
        'Gretchen I',
        'Gretchen F',
        'Holden',
        'Nelson',
        'Stella',
        'Suraj',
        'Zephyr',
      ]
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
        for (let i = 0; i < slotsLength; i++) {
          const cur = pairingHolder.children[i]
          //console.log(cur)
          if (cur.childElementCount > 1) {
            nameList.appendChild(cur.children[0])
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

        for (let i = 0; i < slotsLength; i++) {
          const cur = pairingHolder.children[i]
          //console.log(cur)
          if (cur.childElementCount > 1) {
            nameList.appendChild(cur.children[0])
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
        nameEl.classList.add('tooltip')
        let prevParts = await getPrevPartners(name)
        nameEl.setAttribute('data-tooltip', prevParts.join(', '))
      }

      prevClickName = name
      prevClickTime = Date.now()
    })

    // if(name == 'Beto'){
    //     nameEl.addEventListener('click', ()=>{
    //         betoClicks++;
    //         if(betoClicks == 10){
    //             betoClicks = 0;
    //             console.log('Beto secret');
    //             console.log(betoQuotes[Math.round(Math.random(betoQuotes.length - 1))]);
    //             // betoEl.before = betoQuotes[Math.round(Math.random(betoQuotes.length - 1))];
    //             // betoEl.target.setAttribute('data-before', betoQuotes[Math.round(Math.random(betoQuotes.length - 1))]);
    //             betoEl.style.display = 'block';
    //         }
    //     })
    // }
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

  // dragging on desktop
  nameList.addEventListener('dragover', (e) => {
    e.preventDefault()
    if (!mobile) {
      const draggingEl = document.querySelector('.dragging')
      nameList.appendChild(draggingEl)
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

  //Saving pairings
  saveButton.addEventListener('click', async () => {
    if (nameInput.value != '') {
      let pairs = { name: nameInput.value }
      for (let i = 0; i < (slotsLength / 2) * 3; i++) {
        pairs[i] = pairingHolder.children[i].textContent
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
      const json = await response.json()
      loadingEl.style.display = 'none'
      console.log(json)

      //reset
      makePairs()
      makeNames()
      getSaved()
    } else {
      alert('Please Enter Your Name')
    }
  })
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
        let pairs = { name: nameInput.value, practiceDate: inputDate }
        for (let i = 0; i < slotsLength; i++) {
          pairs[i] = pairingHolder.children[i].textContent
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
      let pairsArray = []
      for (let i = 0; i < slotsLength; i++) {
        pairs[i] = pairingHolder.children[i].textContent
        pairsArray.push(pairingHolder.children[i].textContent)
      }
      console.log(pairsArray)
      console.log('Duplicates found: ' + [...new Set(findDuplicates(pairsArray))])
      if (findDuplicates(pairsArray) != '') {
        console.log('Duplicates foundd!!!')
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
  function saveTemp() {
    let pairs = { name: 'temp' }
    let pairsArray = []
    for (let i = 0; i < (slotsLength / 2) * 3; i++) {
      pairs[i] = pairingHolder.children[i].textContent
      pairsArray.push(pairingHolder.children[i].textContent)
    }
    console.log(pairsArray)
    console.log('Duplicates found: ' + [...new Set(findDuplicates(pairsArray))])
    if (findDuplicates(pairsArray) != '') {
      console.log('Duplicates foundd!!!')
    }
    console.log(pairs)

    // let oldpairs = JSON.parse(window.localStorage.getItem('pairs'));
    // if(oldpairs != undefined & oldpairs != null){
    //     oldpairs.push(pairs);
    // }else{
    //     oldpairs = [];
    //     oldpairs.push(pairs);
    // }

    window.localStorage.setItem('tempPairs', JSON.stringify(pairs))
  }

  getSaved()
  //Gets list of saved paring names from server
  async function getSaved() {
    //Gets names from server
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
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
              body: JSON.stringify({ name: loadName.textContent }),
            }
            loadingEl.style.display = 'block'
            const response = await fetch(API_URL + '/delPair', options)
            const json = await response.json()
            loadingEl.style.display = 'none'
            console.log(json)
            getSaved()
          })
          loadNameHolder.appendChild(loadName)
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
    console.log(json)

    // if names exist create buttons for them
    if (json.pairs != null) {
      while (officialList.firstChild) {
        // remove old buttons
        officialList.removeChild(officialList.firstChild)
      }
      // loop through names and create button
      for (let i = 0; i < json.pairs.length; i++) {
        const loadNameHolder = document.createElement('div')
        loadNameHolder.classList.add('loadNameHolder')

        const loadName = document.createElement('button')
        loadName.classList.add('loadName')
        loadName.textContent = json.pairs[i].name
        loadName.addEventListener('click', async () => {
          //on click get pairings from server
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: loadName.textContent }),
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
        })

        loadNameHolder.appendChild(loadName)
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

  getBoatCount()
  async function getBoatCount() {
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
    loadingEl.style.display = 'block'
    const response = await fetch(API_URL + '/getPairsOfficial', options)
    const pairings = await response.json()
    loadingEl.style.display = 'none'

    let fjCount = new Array(names.length).fill(0)
    let c420Count = new Array(names.length).fill(0)
    let e420Count = new Array(names.length).fill(0)
    for (let i = 0; i < pairings.pairs.length; i++) {
      for (let j = 0; j < 16; j++) {
        fjCount[names.indexOf(pairings.pairs[i][j])]++
      }
      for (let j = 16; j < 28; j++) {
        e420Count[names.indexOf(pairings.pairs[i][j])]++
      }
      for (let j = 28; j < 32; j++) {
        c420Count[names.indexOf(pairings.pairs[i][j])]++
      }
    }
    // console.log("Boat count",names,fjCount,c420Count,e420Count);

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

      if (fjCount[i] - c420Count[i] - e420Count[i] < 0) {
        nameEl.setAttribute('boat-karma', 'positive')
      }
      if (fjCount[i] - c420Count[i] - e420Count[i] > 0) {
        nameEl.setAttribute('boat-karma', 'negative')
      }

      countNamesHolder.appendChild(nameEl)
    }
  }

  async function getPrevPartners(name) {
    let partners = []

    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
    loadingEl.style.display = 'block'
    const response = await fetch(API_URL + '/getPairsOfficial', options)
    const pairings = await response.json()
    loadingEl.style.display = 'none'

    for (let i = 0; i < pairings.pairs.length; i++) {
      // console.log(Object.values(pairings.pairs[i]));
      if (Object.values(pairings.pairs[i]).indexOf(name) % 2 == 0) {
        if (
          pairings.pairs[i][Object.values(pairings.pairs[i]).indexOf(name) + 1] != undefined &&
          !partners.includes(pairings.pairs[i][Object.values(pairings.pairs[i]).indexOf(name) + 1])
        )
          partners.push(pairings.pairs[i][Object.values(pairings.pairs[i]).indexOf(name) + 1])
      } else {
        if (
          pairings.pairs[i][Object.values(pairings.pairs[i]).indexOf(name) - 1] != undefined &&
          !partners.includes(pairings.pairs[i][Object.values(pairings.pairs[i]).indexOf(name) - 1])
        )
          partners.push(pairings.pairs[i][Object.values(pairings.pairs[i]).indexOf(name) - 1])
      }
    }
    console.log('Previous partners of ', name, partners)
    return partners
  }

  countButton.addEventListener('click', () => {
    countWindow.style.display = 'block'
  })
  countWindow.addEventListener('click', (e) => {
    if (e.target == countWindow) countWindow.style.display = 'none'
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
  })

  boatDisplay.addEventListener('click', () => {
    if (boatDisplayVal == 'true') {
      boatDisplayVal = 'false'
    } else {
      boatDisplayVal = 'true'
    }
    document.querySelectorAll('.pairSlot').forEach((slot) => {
      slot.setAttribute('boatDisplay', boatDisplayVal)
    })
  })

  // Randomize pairs button
  randomPairs.addEventListener('click', () => {
    let shuffledNames = [] //names.slice()
    people.forEach((person) => {
      if (!absent.includes(person.name) && !locked.includes(person.name)) {
        shuffledNames.push(person.name)
      }
    })
    let currentIndex = shuffledNames.length,
      randomIndex

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[shuffledNames[currentIndex], shuffledNames[randomIndex]] = [
        shuffledNames[randomIndex],
        shuffledNames[currentIndex],
      ]
    }

    let skippers = []
    let crews = []
    console.log(shuffledNames.length)
    for (let i = 0; i < shuffledNames.length; i++) {
      if (
        people[people.findIndex((e) => e.name == shuffledNames[i])].skipper &&
        !(skippers.length >= shuffledNames.length / 2)
      ) {
        skippers.push(shuffledNames[i])
        // console.log(shuffledNames[i], " is a skipper ", people[people.findIndex((e) => e.name == shuffledNames[i])].skipper);
      } else {
        crews.push(shuffledNames[i])
      }
    }
    // console.log(shuffledNames);
    // console.log(skippers);
    // console.log(crews);

    //shuffle skippers
    ;(currentIndex = skippers.length), randomIndex

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[skippers[currentIndex], skippers[randomIndex]] = [
        skippers[randomIndex],
        skippers[currentIndex],
      ]
    }

    //shuffle crews
    ;(currentIndex = crews.length), randomIndex

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[crews[currentIndex], crews[randomIndex]] = [crews[randomIndex], crews[currentIndex]]
    }

    console.log(skippers)
    console.log(crews)
    let newNames = []

    for (let i = 0; i < shuffledNames.length; i++) {
      if (skippers[i] != undefined) {
        newNames.push(skippers[i])
      }
      if (crews[i] != undefined) {
        newNames.push(crews[i])
      }
    }
    makeNames(newNames)
    // console.log("leftover: ", newNames[newNames.length - 1])

    // for(let i = 0; i < (newNames.length/2)*3; i++){
    //     if(i % 3 == 2) newNames.splice(i, 0, "");
    // }

    // for (let i = 0; i < slotsLength; i++) {
    //     if()
    // }

    makePairs(newNames)
  })

  // picModeButton.addEventListener('click', () => {
  //     if(picMode){
  //         document.getElementById('pairingHolder').classList.remove('pairingHolderPic');
  //     }else{
  //         document.getElementById('pairingHolder').classList.add('pairingHolderPic');
  //     }
  //     picMode = !picMode;
  //     let pairs = {name:nameInput.value};
  //     for (let i = 0; i < names.length; i++) {
  //         pairs[i] = pairingHolder.children[i].textContent;
  //     }
  //     makeNames(pairs);
  //     makePairs(pairs);
  //     console.log(picMode);
  // })
}
// squareMode.addEventListener('click', () => {
//     if(square){
//         document.documentElement.style.setProperty('--radius', '7px');
//         squareMode.children[0].classList.replace('gg-shape-circle','gg-shape-square');
//     }else{
//         document.documentElement.style.setProperty('--radius', '0px');
//         squareMode.children[0].classList.replace('gg-shape-square','gg-shape-circle');
//     }
//     square = !square;
// });

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
  console.log(lightMode, 'HI')
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  console.log('Theme set to', theme)
}

console.log(pickSternTier() + ' is assigned to do stern ties')
function pickSternTier() {
  let potentialPpl = []
  people.forEach((person) => {
    if (person.name != 'Elliott') potentialPpl.push(person.name)
  })
  return potentialPpl[Math.floor(Math.random() * potentialPpl.length)]
}
