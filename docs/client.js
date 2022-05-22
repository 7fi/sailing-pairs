//Grab elements from dom
const left = document.getElementById('left');
const right = document.getElementById('right');
const nameList = document.getElementById('listContainer');
const pairingHolder = document.getElementById('pairingHolder');
const loadHolder = document.getElementById('loadDropContainer');
const loadingEl = document.getElementById('loadingEl');
const loadText = document.getElementById('loadText');
const loadSaveContainer = document.getElementById('loadSaveContainer');
const localSaved = document.getElementById('localSaved');

const nameInput = document.getElementById('nameInput');
const saveButton = document.getElementById('save');
const saveButtonLocal = document.getElementById('saveLocal');
const modeToggle = document.getElementById('modeToggle');
const resetPairs = document.getElementById('resetPairs');
const randomPairs = document.getElementById('randomPairs');
const squareMode = document.getElementById('squareMode');
const betoEl = document.getElementById('betoEl');

let lightMode = true;
let square = false;

let betoClicks = 0;
let betoQuotes = ['Hi',"I'm bad at sailing!"];
let sabrinaClicks = 0;
let elliottClicks = 0;

var thisPage;
// console.log(window.location.href.split("/"));
if(window.location.href.includes("scores")){
    thisPage = "scores";
}else{
    thisPage = "main";
}
/*else if(window.location.href.split("/")[window.location.href.split("/").length - 1] != ""){
    console.log(window.location.href.split("/")[window.location.href.split("/").length - 1]);
} */

//Check for mobile (only works on reload)
let mobile = window.matchMedia("only screen and (max-width: 1000px)").matches;
let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);

// const API_URL = 'https://bhspairs.herokuapp.com'; // For deployment
const API_URL = 'http://localhost:3000'; // For development 

const people =[
    {name: "Adam", skipper: true, crew: false},
    {name: "Alden", skipper: true, crew: false},
    {name: "Ava", skipper: true, crew: true},
    {name: "Barrett", skipper: true, crew: false},
    {name: "Ben", skipper: true, crew: true},
    {name: "Beto", skipper: true, crew: false},
    {name: "Carter", skipper: true, crew: false},
    {name: "Chris", skipper: false, crew: true},
    {name: "Elliott", skipper: true, crew: true},
    {name: "Evan", skipper: true, crew: false},
    {name: "Fin", skipper: false, crew: true},
    {name: "Gianna", skipper: true, crew: false},
    {name: "Jaya", skipper: false, crew: true},
    {name: "Jeffery", skipper: false, crew: true},
    {name: "Joseph", skipper: false, crew: true},
    {name: "Lauren", skipper: true, crew: true},
    {name: "Logan", skipper: true, crew: true},
    {name: "Luke", skipper: false, crew: true},
    {name: "Maura", skipper: true, crew: true},
    {name: "Maxwell", skipper: false, crew: true},
    {name: "Nick", skipper: false, crew: true},
    {name: "Nolan L", skipper: true, crew: false},
    {name: "Nolan W", skipper: true, crew: false},
    {name: "Owen", skipper: true, crew: false},
    {name: "Payton", skipper: false, crew: true},
    {name: "Pearl", skipper: false, crew: true},
    {name: "Ryan", skipper: true, crew: false},
    {name: "Sabrina", skipper: false, crew: true},
    {name: "Sharkey", skipper: false, crew: true},
    {name: "Stone", skipper: true, crew: false},
    {name: "Talia", skipper: false, crew: true},
    {name: "Zane", skipper: true, crew: true}
]

// Name list
const names = ['Adam','Alden','Ava','Barrett','Ben','Beto','Carter','Chris','Elliott','Evan','Fin','Gianna','Jaya','Jeffrey','Joseph','Lauren','Logan','Luke','Maura','Maxwell','Nick','Nolan W','Nolan L','Owen','Payton','Pearl','Ryan','Sabrina','Sharkey','Stone','Talia','Zane'];
const pref = [true, true,true,true,true,true,true,false,false,true,false,true,false,false,false,true,false,true, false,false,false,true,true,true,false,false,true,false,false,true,false,true];

function load(){
    let myBool = (decodeURIComponent(document.cookie).split('=')[1] === 'true');
    console.log("Lightmode is wrong:", myBool != lightMode)
    if(myBool != lightMode){
        switchMode();
    }
}

if(thisPage == 'main'){
makePairs();
function makePairs(inputPairs){ // Creates pair slots either empty or populated with inputPairs object
    // deletes all previous pair slots
    while (pairingHolder.firstChild) {
        pairingHolder.removeChild(pairingHolder.firstChild);
    }
    // Creates all pair slots
    for (let i = 0; i < names.length; i++) {
        const pairSlotEl = document.createElement('div');
        pairSlotEl.classList.add('pairSlot');

        //If input pairing supplied then populate with new name
        if(inputPairs != undefined && inputPairs[i] != ""){
            const nameEl = makeName(inputPairs[i]);
            pairSlotEl.appendChild(nameEl);
        }
        //add event listeners
        pairSlotEl.addEventListener('click', () => {
            const tempSelected = document.querySelector('.selected');
            if(tempSelected != null || tempSelected != undefined){
                pairSlotEl.append(tempSelected);
                tempSelected.classList.remove('selected');
            }
        })
        pairSlotEl.addEventListener('dragover', e => {
            e.preventDefault();
            if(!mobile){
                const draggingEl = document.querySelector('.dragging');
                // console.log(pref[names.indexOf(draggingEl.textContent)]);
                if(pairSlotEl.childElementCount < 2){ //&& pref[names.indexOf(draggingEl.textContent)]
                    pairSlotEl.appendChild(draggingEl);
                }
            }
        })
        pairingHolder.appendChild(pairSlotEl);
    }
}
makeNames();
function makeNames(inputPairs){ // makes name list without the input parings 
    while (nameList.firstChild) { // removed all previous names
        nameList.removeChild(nameList.firstChild);
    }
    // if input pairs supplied then dont create those names
    if(inputPairs != undefined){
        let tempNames = names.slice();
        for (let i = 0; i < names.length; i++) {
            if(inputPairs[i] != ''){
                tempNames.splice(tempNames.indexOf(inputPairs[i]), 1);
                // console.log(tempNames);
            }
        }
        tempNames.forEach(name => {
            const nameEl = makeName(name);
            nameList.appendChild(nameEl);
        });
    }else{ // otherwise make all names
        names.forEach(name => {
            const nameEl = makeName(name);
            nameList.appendChild(nameEl);
        });
    }
}
function makeName(name){ // creates single name 
    const nameEl = document.createElement('button');
    nameEl.textContent = name;
    nameEl.classList.add('name');
    nameEl.classList.add('draggable');
    nameEl.setAttribute("draggable", "true");
    
    if(!mobile){ // if on desktop
        //Event listeners for dragging
        nameEl.addEventListener('dragstart', () =>{
            nameEl.classList.add('dragging');
        })
        
        nameEl.addEventListener('dragend', async () =>{
            for (let i = 0; i < names.length; i++) {
                const cur = pairingHolder.children[i];
                if(cur.childElementCount > 1){
                    nameList.appendChild(cur.children[0]);
                }
            }

            nameEl.classList.remove('dragging');
            console.log("dragend: " , nameEl.textContent);
        })
    }else{ // otherwise mobile
        nameEl.addEventListener('click', async () => {
            const tempSelected = document.querySelector('.selected');
            if(tempSelected != null || tempSelected != undefined){
                tempSelected.classList.remove('selected');
            }
            nameEl.classList.add('selected');
        }) 
    }

    if(name == 'Beto'){
        nameEl.addEventListener('click', ()=>{
            betoClicks++;
            if(betoClicks == 10){
                betoClicks = 0;
                console.log('Beto secret');
                console.log(betoQuotes[Math.round(Math.random(betoQuotes.length - 1))]);
                // betoEl.before = betoQuotes[Math.round(Math.random(betoQuotes.length - 1))];
                // betoEl.target.setAttribute('data-before', betoQuotes[Math.round(Math.random(betoQuotes.length - 1))]);
                betoEl.style.display = 'block';
            }
        })
    }
    if(name == 'Sabrina'){
        nameEl.addEventListener('click', ()=>{
            betoClicks++;
            if(betoClicks == 10){
                betoClicks = 0;
                console.log('Sabrina secret');
                location.href = 'https://smachef.wordpress.com'
            }
        })
    }
    if(name == 'Elliott'){
        nameEl.addEventListener('click', ()=>{
            betoClicks++;
            if(betoClicks == 10){
                betoClicks = 0;
                console.log('Elliott secret');
                location.href = 'https://exoplanetresearch.netlify.app/'
            }
        })
    }

    return nameEl;
}

// dragging on desktop
nameList.addEventListener('dragover', e => { 
    e.preventDefault();
    if(!mobile){
        const draggingEl = document.querySelector('.dragging');
        nameList.appendChild(draggingEl);
    }
})

// deselecting on mobile
nameList.addEventListener('click', e => {
    e.preventDefault();
    if(e.target == nameList && mobile){
        const tempSelected = document.querySelector('.selected');
        if(tempSelected != null || tempSelected != undefined){
            tempSelected.classList.remove('selected');
        }
    }
})


//Saving pairings
saveButton.addEventListener('click', async () => {
    if(nameInput.value != ""){
        let pairs = {name:nameInput.value};
        for (let i = 0; i < names.length; i++) {
            pairs[i] = pairingHolder.children[i].textContent;
        }

        console.log(pairs);
        nameInput.value = "";

        //send to server
        options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify(pairs)};
        loadingEl.style.display ='block';
        const response = await fetch(API_URL + '/pairs', options);
        const json = await response.json();
        loadingEl.style.display ='none';
        console.log(json);
        
        //reset
        makePairs();
        makeNames();
        getSaved();
    }else{
        alert("Please Enter Your Name");
    }
})
saveButtonLocal.addEventListener('click', () => {
    if(nameInput.value != ""){
        let pairs = {name:nameInput.value};
        let pairsArray = [];
        for (let i = 0; i < names.length; i++) {
            pairs[i] = pairingHolder.children[i].textContent;
            pairsArray.push(pairingHolder.children[i].textContent);
        }
        console.log(pairsArray);
        console.log("Duplicates found: " + [...new Set(findDuplicates(pairsArray))]);
        if(findDuplicates(pairsArray) != ''){
            console.log("Duplicates foundd!!!")
        }
        console.log(pairs);
        nameInput.value = "";

        let oldpairs = JSON.parse(window.localStorage.getItem('pairs'));
        if(oldpairs != undefined & oldpairs != null){
            oldpairs.push(pairs);
        }else{
            oldpairs = [];
            oldpairs.push(pairs);
        }

        window.localStorage.setItem('pairs', JSON.stringify(oldpairs));
        
        //reset
        makePairs();
        makeNames();
        getSaved();
    }else{
        alert("Please Enter Your Name");
    }
})

getSaved();
//Gets list of saved paring names from server
async function getSaved(){
    //Gets names from server
    options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({})};
    loadingEl.style.display ='block';
    const response = await fetch(API_URL + '/getNames', options);
    const json = await response.json();
    loadingEl.style.display ='none';
    console.log(json);
    
    // if names exist create buttons for them
    if(json.pairs != null){
        while(loadHolder.firstChild){ // remove old buttons
            loadHolder.removeChild(loadHolder.firstChild);
        }
        // loop through names and create button
        for (let i = 0; i < json.pairs.length; i++) {
            const loadNameHolder = document.createElement('div');
            loadNameHolder.classList.add('loadNameHolder');

            const loadName = document.createElement('button');
            loadName.classList.add('loadName');
            loadName.textContent = json.pairs[i].name;
            loadName.addEventListener('click', async () =>{
                //on click get pairings from server
                options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({name:loadName.textContent})};
                loadingEl.style.display ='block';
                const response = await fetch(API_URL + '/getPairs', options);
                const json = await response.json();
                loadingEl.style.display ='none';
                console.log(json);

                getSaved();
                // if pairs exist create them
                if(json.pairs != null){
                    makeNames(json.pairs);
                    makePairs(json.pairs);
                    nameInput.value = "";
                }else{
                    makeNames();
                    makePairs();
                    alert("No pairs saved under this name.");
                }
            })

            //Delete button
            if(!mobile){
                const loadDel = document.createElement('button');
                loadDel.classList.add('loadDel');
                const loadDelIcon = document.createElement('i');
                loadDelIcon.classList.add('gg-trash');
                loadDel.appendChild(loadDelIcon);
                loadDel.addEventListener('click', async () =>{
                    //send deletion request to server
                    options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({name:loadName.textContent})};
                    loadingEl.style.display ='block';
                    const response = await fetch(API_URL + '/delPair', options);
                    const json = await response.json();
                    loadingEl.style.display ='none';
                    console.log(json);
                    getSaved();
                });
                loadNameHolder.appendChild(loadName);
                loadNameHolder.appendChild(loadDel);
            }else{
                loadNameHolder.appendChild(loadName);
            }
            loadHolder.appendChild(loadNameHolder);
        }
    }

    let curPairs = JSON.parse(window.localStorage.getItem('pairs'));
    console.log(curPairs);
    if(curPairs != null){
        while(localSaved.firstChild){ // remove old buttons
            localSaved.removeChild(localSaved.firstChild);
        }
        // loop through names and create button
        for (let i = 0; i < curPairs.length; i++) {
            const loadNameHolder = document.createElement('div');
            loadNameHolder.classList.add('loadNameHolder');

            const loadName = document.createElement('button');
            loadName.classList.add('loadName');
            loadName.textContent = curPairs[i].name;
            loadName.addEventListener('click', async () =>{

                getSaved();
                // if pairs exist create them
                if(curPairs[i] != null){
                    makeNames(curPairs[i]);
                    makePairs(curPairs[i]);
                    nameInput.value = "";
                }else{
                    makeNames();
                    makePairs();
                    alert("No pairs saved under this name.");
                }
            })

            //Delete button
            if(!mobile){
                const loadDel = document.createElement('button');
                loadDel.classList.add('loadDel');
                const loadDelIcon = document.createElement('i');
                loadDelIcon.classList.add('gg-trash');
                loadDel.appendChild(loadDelIcon);
                loadDel.addEventListener('click', async () =>{
                    curPairs.splice(i,1);
                    console.log(curPairs);
                    window.localStorage.setItem('pairs', JSON.stringify(curPairs));
                    getSaved();
                });
                loadNameHolder.appendChild(loadDel);
            }
            loadNameHolder.appendChild(loadName);
            localSaved.appendChild(loadNameHolder);
        }
    }

}

loadText.addEventListener('click', () =>{
    if(loadText.style.display == 'grid'){
        loadSaveContainer.style.display = 'none';
    }else{
        loadSaveContainer.style.display = 'grid';
    }
})
loadSaveContainer.addEventListener('click', (e) => {
    if(e.target == loadSaveContainer){
        loadSaveContainer.style.display = 'none';
    }
})

//Reset pairs button
resetPairs.addEventListener('click', () => {
    getSaved();
    makeNames();
    makePairs();
})

// Randomize pairs button
randomPairs.addEventListener('click', () => {
    let shuffledNames = []; //names.slice()
    people.forEach(person => {
        shuffledNames.push(person.name);
    });
    let currentIndex = shuffledNames.length,  randomIndex;
    
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [shuffledNames[currentIndex], shuffledNames[randomIndex]] = [shuffledNames[randomIndex], shuffledNames[currentIndex]];
    }
    
    let skippers = [];
    let crews = [];
    console.log();
    for(let i = 0; i < shuffledNames.length; i++){
        if(people[people.findIndex((e) => e.name == shuffledNames[i])].skipper && !(skippers.length >= shuffledNames.length/2)){
            skippers.push(shuffledNames[i]);
            console.log(shuffledNames[i], " is a skipper ", people[people.findIndex((e) => e.name == shuffledNames[i])].skipper);
        }else{
            crews.push(shuffledNames[i]);
        }
    }
    // console.log(shuffledNames);
    // console.log(skippers);
    // console.log(crews);
    
    currentIndex = skippers.length,  randomIndex;
    
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [skippers[currentIndex], skippers[randomIndex]] = [skippers[randomIndex], skippers[currentIndex]];
    }
    
    currentIndex = crews.length,  randomIndex;
    
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [crews[currentIndex], crews[randomIndex]] = [crews[randomIndex], crews[currentIndex]];
    }

    // console.log(skippers);
    // console.log(crews);
    let newNames = [];
    
    for(let i = 0; i < shuffledNames.length; i++){
        if(skippers[i] != undefined){
            newNames.push(skippers[i]);
        }
        if(crews[i] != undefined){
            newNames.push(crews[i]);
        }
    }
    makePairs(newNames);
    makeNames(newNames);
})
}
squareMode.addEventListener('click', () => {
    if(square){
        document.documentElement.style.setProperty('--radius', '7px');
        squareMode.children[0].classList.replace('gg-shape-circle','gg-shape-square');
    }else{
        document.documentElement.style.setProperty('--radius', '0px');
        squareMode.children[0].classList.replace('gg-shape-square','gg-shape-circle');
    }
    square = !square;
})
// Toggle between light and dark mode
modeToggle.addEventListener('click', () => {
    switchMode();
})

function switchMode(){
    if(!lightMode){
        modeToggle.children[0].classList.replace('gg-sun','gg-moon');
        document.documentElement.style.setProperty('--dark','#eaeaea');
        document.documentElement.style.setProperty('--medDark','#fff');
        document.documentElement.style.setProperty('--med','#cfcfcf');
        document.documentElement.style.setProperty('--medLight','#d1d1d1');
        document.documentElement.style.setProperty('--light','#b3b3b3');
        document.documentElement.style.setProperty('--highlight','#000');
        document.documentElement.style.setProperty('--highlight1','#12A5B1');
        document.documentElement.style.setProperty('--highlight2','#203960');
    }else{
        modeToggle.children[0].classList.replace('gg-moon','gg-sun');
        document.documentElement.style.setProperty('--dark','#333');
        document.documentElement.style.setProperty('--medDark','#444');
        document.documentElement.style.setProperty('--med','#555');
        document.documentElement.style.setProperty('--medLight','#666');
        document.documentElement.style.setProperty('--light','#777');
        document.documentElement.style.setProperty('--highlight','#fff');
        document.documentElement.style.setProperty('--highlight1','#222');
        document.documentElement.style.setProperty('--highlight2','#222');
    }
    lightMode = !lightMode;
    document.cookie = ("lightMode=" + lightMode + "; path=/");
    console.log(lightMode)
}
console.log(pickSternTier() + " is assigned to do stern ties");
function pickSternTier(){
    let potentialPpl = [];
    people.forEach(person => {
        if(person.name != 'Elliott') potentialPpl.push(person.name);
    });
    return potentialPpl[Math.floor(Math.random() * potentialPpl.length)];
}

/*  
randomPairs.addEventListener('click', () => {
    let randomNames = [];
    for (let i = 0; i < people.length; i++) {
        if(i % 2 == 0){
            let temp = "";
            while(temp == ""){
                temp = getRandomPerson(randomNames,true);
                console.log(temp);
            }
            randomNames.push(temp);
        }else{
            let temp = " ";
            do {
                temp = getRandomPerson(randomNames,false);
                console.log("Crew", temp);
            } while (temp == " ");
            randomNames.push(temp);
        }
    }
    console.log(randomNames);
    makePairs(randomNames);
    makeNames(randomNames);
})

function getRandomPerson(exclude, skipper){
    let randomNum = Math.floor(Math.random() * (people.length - exclude.length));
    if(skipper){
        if(people[randomNum].skipper && !exclude.includes(people[randomNum].name)){
            // console.log(people[randomNum].name)
            return people[randomNum].name;
        }else{
            return " ";
        }
    }else{
        if(people[randomNum].crew && !exclude.includes(people[randomNum].name)){
            // console.log(people[randomNum].name)
            return people[randomNum].name;
        }else{
            return " ";
        }
    }
}*/