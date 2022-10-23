// Randomize pairs button
randomPairs.addEventListener('click', () => {
  let lockedPairs = []
  for (let i = 0; i < slotsLength / 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pairingHolder.children[i].children[j] != undefined && pairingHolder.children[i].children[j].children[0]) {
        if (locked.includes(pairingHolder.children[i].children[j].children[0].textContent)) {
          lockedPairs.push(pairingHolder.children[i].children[j].children[0].textContent)
        } else if (i % 3 != 2) lockedPairs.push('')
      }
    }
  }
  // console.log('Locked: ', lockedPairs)

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
  // console.log(shuffledNames);
  // console.log(skippers);
  // console.log(crews);

  //shuffle skippers
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

  // console.log(lockedPairs)
  // console.log(skippers)
  // console.log(crews)
  let newNames = []

  let skipperIndex = 0
  let crewIndex = 0
  for (let i = 0; i < shuffledNames.length; i++) {
    if (lockedPairs[i] != '' && lockedPairs[i] != undefined) {
      newNames.push(lockedPairs[i])
      console.log('pushing locked')
    } else if (skippers[skipperIndex] != undefined && i % 2 == 0) {
      newNames.push(skippers[skipperIndex])
      skipperIndex++
      // console.log('pushing skipper')
    } else if (crews[crewIndex] != undefined && i % 2 == 1) {
      newNames.push(crews[crewIndex])
      crewIndex++
      // console.log('pushing crew')
    }
    // console.log(i, newNames[i])
  }
  newNames = newNames.slice(0, 34)
  if (Math.round(newNames.length / 2) != newNames.length / 2) newNames = newNames.slice(0, -1)
  // console.log("leftover: ", newNames[newNames.length - 1])
  makeNames(newNames)
  makePairs(newNames)
})
