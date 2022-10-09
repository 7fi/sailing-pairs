// Randomize pairs button
randomPairs.addEventListener('click', () => {
  let lockedPairs = []
  for (let i = 0; i < (slotsLength / 2) * 3; i++) {
    if (locked.includes(pairingHolder.children[i].textContent)) {
      console.log(i)
      lockedPairs.push(pairingHolder.children[i].textContent)
    } else if (i % 3 != 2) lockedPairs.push('')
  }

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

  console.log(lockedPairs)
  console.log(skippers)
  console.log(crews)
  let newNames = []

  let skipperIndex = 0
  let crewIndex = 0
  for (let i = 0; i < (shuffledNames.length / 2) * 3; i++) {
    if (lockedPairs[i] != '' && lockedPairs[i] != undefined) {
      newNames.push(lockedPairs[i])
      console.log('pushing locked')
    } else if (skippers[skipperIndex] != undefined && i % 2 == 0) {
      newNames.push(skippers[skipperIndex])
      skipperIndex++
      console.log('pushing skipper')
    }
    if (crews[crewIndex] != undefined && i % 2 == 1) {
      newNames.push(crews[crewIndex])
      crewIndex++
      console.log('pushing crew')
    }
    console.log(i, newNames[i])
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
