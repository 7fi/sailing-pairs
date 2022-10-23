randomPairs.addEventListener('click', async () => {
  //Create locked pair list with blank slots
  let lockedPairs = []
  for (let i = 0; i < slotsLength / 3; i++) {
    for (let j = 1; j < 4; j++) {
      if (locked.includes(pairingHolder.children[i].children[j].innerHTML)) {
        console.log(i)
        lockedPairs.push(pairingHolder.children[i].children[j].innerHTML)
      } else if (i % 3 != 2) lockedPairs.push('')
    }
  }

  //Get list of non absent people
  let shuffledNames = []
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
    ;[shuffledNames[currentIndex], shuffledNames[randomIndex]] = [shuffledNames[randomIndex], shuffledNames[currentIndex]]
  }

  let skippers = []
  let crews = []
  for (let i = 0; i < shuffledNames.length; i++) {
    if (people[people.findIndex((e) => e.name == shuffledNames[i])].skipper && !(skippers.length >= shuffledNames.length / 2)) {
      skippers.push(shuffledNames[i])
      // console.log(shuffledNames[i], " is a skipper ", people[people.findIndex((e) => e.name == shuffledNames[i])].skipper);
    } else {
      crews.push(shuffledNames[i])
    }
  }
  console.log(skippers, crews)
  ;(currentIndex = skippers.length), randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[skippers[currentIndex], skippers[randomIndex]] = [skippers[randomIndex], skippers[currentIndex]]
  }

  //shuffle crews
  ;(currentIndex = crews.length), randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[crews[currentIndex], crews[randomIndex]] = [crews[randomIndex], crews[currentIndex]]
  }
  console.log(skippers, crews)

  //Shuffle skippers here

  options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }
  loadingEl.style.display = 'block'
  const response = await fetch(API_URL + '/getPairsOfficial', options)
  let pairings = await response.json()

  let newNames = []
  for (let i = 0; i < slotsLength / 3; i++) {
    // find crew for given skipper
    newNames.push(skippers[0])
    let prevPairs = await getPrevPartners(skippers[0], pairings)
    console.log(prevPairs)
    let crew
    for (let j = 0; j < crews.length; j++) {
      if (!prevPairs.includes(crews[j])) {
        crew = crews[j]
        break
      }
    }
    if (crew == undefined) {
      let frequency = {}
      for (let i = 0; i < prevPairs.length; i++) {
        frequency[prevPairs[i]] = prevPairs.filter((x) => x === prevPairs[i]).length
      }
      console.log('Frequency', frequency)
    } else {
      newNames.push(crew)
      crews.splice(crews.indexOf(crew), 1)
      console.log('Crews:', crews)
    }
    skippers.splice(skippers.indexOf(skippers[0]), 1)
    console.log('skippers:', skippers)
  }

  makeNames(newNames)
  makePairs(newNames)
})
