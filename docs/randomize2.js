randomPairs.addEventListener('click', () => {
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

  //Shuffle skippers here

  let newNames = []
  for (let i = 0; i < slotsLength / 3; i++) {
    // find crew for given skipper
    newNames.push(skippers[i])
    console.log(getPrevPartners(skippers[i]))
  }

  makeNames()
  makePairs()
})
