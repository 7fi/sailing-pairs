randomPairs.addEventListener('click', async () => {
  // console.log(byBoatCount)
  console.log('settings', byPos, byBoatCount, byPrevParts)
  //Create locked pair list with blank slots
  let lockedPairs = []
  for (let i = 0; i < slotsLength / 3; i++) {
    for (let j = 1; j < 3; j++) {
      if (pairingHolder.children[i].children[j] != undefined && pairingHolder.children[i].children[j].children[0] != undefined && locked.includes(pairingHolder.children[i].children[j].children[0].innerHTML)) {
        // console.log(i)
        lockedPairs.push(pairingHolder.children[i].children[j].children[0].innerHTML)
      } else lockedPairs.push('')
    }
  }
  console.log(lockedPairs)

  //Get list of non absent people
  let shuffledNames = names[season][team].slice()
  if (byBoatCount) {
    shuffledNames = await getBoatCount(true)
  }
  console.log(shuffledNames)
  for (let i = shuffledNames.length - 1; i >= 0; i--) {
    console.log(shuffledNames[i])
    if (absent.includes(shuffledNames[i]) || lockedPairs.includes(shuffledNames[i])) {
      console.log(`${shuffledNames[i]} is absent or locked`)
      shuffledNames.splice(i, 1)
      // console.log(shuffledNames)
    }
  }
  console.log(shuffledNames)

  let newNames = []
  if (byPos) {
    let skippers = []
    let crews = []
    for (let i = 0; i < shuffledNames.length; i++) {
      if (people[season][team][people[season][team].findIndex((e) => e.name == shuffledNames[i])].skipper && !(skippers.length >= shuffledNames.length / 2)) {
        skippers.push(shuffledNames[i])
        // console.log(shuffledNames[i], " is a skipper ", people[people.findIndex((e) => e.name == shuffledNames[i])].skipper);
      } else {
        crews.push(shuffledNames[i])
      }
    }
    console.log(skippers, crews)

    let currentIndex = skippers.length,
      randomIndex
    if (!byBoatCount) {
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[skippers[currentIndex], skippers[randomIndex]] = [skippers[randomIndex], skippers[currentIndex]]
      }
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

    let pairings
    if (byPrevParts) {
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
      loadingEl.style.display = 'block'
      const response = await fetch(API_URL + '/getPairsOfficial', options)
      pairings = await response.json()
    }

    let lpI = 0
    for (let i = 0; i < slotsLength / 3; i++) {
      // find crew for given skipper
      // console.log('Locked pair', lockedPairs[lpI], lpI)
      let skipper
      if (lockedPairs[lpI] != '') {
        skipper = lockedPairs[lpI]
        newNames.push(lockedPairs[lpI])
      } else {
        skipper = skippers[0]
        newNames.push(skippers[0])
        skippers.splice(skippers.indexOf(skippers[0]), 1)
      }
      console.log('Skipper:', skipper)
      lpI++
      if (skipper) {
        let crew
        let prevPairs
        if (lockedPairs[lpI] != '') crew = lockedPairs[lpI]
        else {
          if (byPrevParts) {
            prevPairs = await getPrevPartners(skipper, pairings)
            for (let j = 0; j < crews.length; j++) {
              if (!prevPairs.includes(crews[j])) {
                crew = crews[j]
                break
              }
            }
          } else {
            crew = crews[0]
          }
          if (crew == undefined && byPrevParts) {
            let frequency = {}
            for (let i = 0; i < prevPairs.length; i++) {
              frequency[prevPairs[i]] = prevPairs.filter((x) => x === prevPairs[i]).length
            }
            console.log('Frequency', frequency)
            const sortable = Object.entries(frequency)
              .sort((a, b) => a[1] - b[1])
              .map((el) => el[0])
            let j = 0
            while (locked.includes(sortable[j]) || absent.includes(sortable[j])) j++
            crew = sortable[j]
          }
        }
        newNames.push(crew)
        crews.splice(crews.indexOf(crew), 1)
      }
      console.log('Crews:', crews)
      lpI++
      console.log('skippers:', skippers)
    }
  } else {
    let currentIndex = shuffledNames.length,
      randomIndex
    if (!byBoatCount) {
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[shuffledNames[currentIndex], shuffledNames[randomIndex]] = [shuffledNames[randomIndex], shuffledNames[currentIndex]]
      }
    }
    newNames = shuffledNames
    if (newNames.length > (slotsLength / 3) * 2) {
      newNames = newNames.slice(0, (slotsLength / 3) * 2)
    }
  }

  makeNames(newNames)
  makePairs(newNames)
})
