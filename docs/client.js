//Grab elements from dom
const left = document.getElementById('left');
const right = document.getElementById('right');
const nameList = document.getElementById('listContainer');
const pairingHolder = document.getElementById('pairingHolder');
const loadHolder = document.getElementById('loadDropContainer');
const loadingEl = document.getElementById('loadingEl');

const nameInput = document.getElementById('nameInput');
const saveButton = document.getElementById('save');
const modeToggle = document.getElementById('modeToggle');
const resetPairs = document.getElementById('resetPairs');
const randomPairs = document.getElementById('randomPairs');
const betoEl = document.getElementById('betoEl');
let lightMode = true;

let betoClicks = 0;
let betoQuotes = ['Hi',"I'm bad at sailing!"];
let sabrinaClicks = 0;
let elliottClicks = 0;

//Check for mobile (only works on reload)
let mobile = window.matchMedia("only screen and (max-width: 1000px)").matches;

const API_URL = 'https://bhspairs.herokuapp.com'; // For deployment
// const API_URL = 'http://localhost:3000'; // For development 

// Name list and if they preffer skippering (unused)
const names = ['Adam','Alden','Ava','Barrett','Ben','Beto','Carter','Chris','Elliott','Evan','Fin','Gianna','Jaya','Jeffrey','Joseph','Lauren','Logan','Luke','Maura','Maxwell','Nick','Nolan W','Nolan L','Owen','Payton','Pearl','Ryan','Sabrina','Sharkey','Stone','Talia','Zane'];
const pref = [true, true,true,true,true,true,true,false,false,true,false,true,false,false,false,true,false,true, false,false,false,true,true,true,false,false,true,false,false,true,false,true];

function load(){
    let myBool = (decodeURIComponent(document.cookie).split('=')[1] === 'true');
    console.log("Lightmode is wrong:", myBool != lightMode)
    if(myBool != lightMode){
        switchMode();
    }
}

makePairs();
function makePairs(inputPairs){ // Creates pair slots either empty or populated with inputPairs object
    // deletes all previous pair slots
    while (pairingHolder.firstChild) {
        pairingHolder.removeChild(pairingHolder.firstChild);
    }
    // Creates all pair slots
    for (let i = 0; i < 32; i++) {
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
                if(pairSlotEl.childElementCount < 1){ //&& pref[names.indexOf(draggingEl.textContent)]
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
        for (let i = 0; i < 32; i++) {
            if(inputPairs[i] != ''){
                tempNames.splice(tempNames.indexOf(inputPairs[i]), 1);
                console.log(tempNames);
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
        for (let i = 0; i < 32; i++) {
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
                loadHolder.appendChild(loadNameHolder);
            }
        }
    }
}

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

//Reset pairs button
resetPairs.addEventListener('click', () => {
    getSaved();
    makeNames();
    makePairs();
})

// Randomize pairs button
randomPairs.addEventListener('click', () => {
    let shuffledNames = names.slice();
    let currentIndex = shuffledNames.length,  randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [shuffledNames[currentIndex], shuffledNames[randomIndex]] = [shuffledNames[randomIndex], shuffledNames[currentIndex]];
    }
    makePairs(shuffledNames);
    makeNames(shuffledNames);
})