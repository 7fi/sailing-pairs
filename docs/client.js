const left = document.getElementById('left');
const right = document.getElementById('right');
const nameList = document.getElementById('listContainer');
const pairingHolder = document.getElementById('pairingHolder');
const loadHolder = document.getElementById('loadDropContainer');

const nameInput = document.getElementById('nameInput');
const saveButton = document.getElementById('save');
// const loadButton = document.getElementById('load');
const modeToggle = document.getElementById('modeToggle');
const resetPairs = document.getElementById('resetPairs');
let lightMode = false;

let mobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    mobile = true;
}

// const API_URL = 'https://bhspairs.herokuapp.com';
const API_URL = 'http://localhost:3000';

const names = ['Adam', 'Alden','Ava','Barrett','Ben','Beto','Carter','Chris','Elliott','Evan','Fin','Gianna','Jaya','Jeffrey','Joseph','Lauren','Luke','Maura','Maxwell','Nick','Nolan W','Nolan L','Owen','Payton','Pearl','Ryan','Sabrina','Sharkey','Stone','Talia','Zane'];

makePairs();
function makePairs(inputPairs){
    while (pairingHolder.firstChild) {
        pairingHolder.removeChild(pairingHolder.firstChild);
    }
    for (let i = 0; i < 30; i++) {
        const pairSlotEl = document.createElement('div');
        pairSlotEl.classList.add('pairSlot');

        if(inputPairs != undefined && inputPairs[i] != ""){
            const nameEl = document.createElement('div');
            nameEl.textContent = inputPairs[i];
            nameEl.classList.add('name');
            nameEl.classList.add('draggable');
            nameEl.setAttribute("draggable", "true");
            
            if(!mobile){
            //Event listeners for dragging
            nameEl.addEventListener('dragstart', () =>{
                nameEl.classList.add('dragging');
            })
            
            nameEl.addEventListener('dragend', async () =>{
                nameEl.classList.remove('dragging');
                console.log("dragend: " , nameEl.textContent);
            })
            }else{
                nameEl.addEventListener('click', async () => {
                    nameEl.classList.add('selected');
                })
            }
            pairSlotEl.appendChild(nameEl);
        }
    
        pairSlotEl.addEventListener('dragover', e => {
            e.preventDefault();
            
            const draggingEl = document.querySelector('.dragging');
            if(pairSlotEl.childElementCount < 1){
                pairSlotEl.appendChild(draggingEl);
            }
        })
        pairingHolder.appendChild(pairSlotEl);
    }
}
makeNames();
function makeNames(inputPairs){
    while (nameList.firstChild) {
        nameList.removeChild(nameList.firstChild);
    }
    if(inputPairs != undefined){
        let tempNames = names.slice();
        for (let i = 0; i < 30; i++) {
            if(inputPairs[i] != ''){
                tempNames.splice(tempNames.indexOf(inputPairs[i]), 1);
                console.log(tempNames);
            }
        }
        tempNames.forEach(name => {
            const nameEl = document.createElement('div');
            nameEl.textContent = name;
            nameEl.classList.add('name');
            nameEl.classList.add('draggable');
            nameEl.setAttribute("draggable", "true");

            //Event listeners for dragging
            nameEl.addEventListener('dragstart', () =>{
                nameEl.classList.add('dragging');
            })  

            nameEl.addEventListener('dragend', async () =>{
                nameEl.classList.remove('dragging');
                console.log("dragend: " , nameEl.textContent);
            })

            nameList.appendChild(nameEl);
        });
    }else{
        names.forEach(name => {
            const nameEl = document.createElement('div');
            nameEl.textContent = name;
            nameEl.classList.add('name');
            nameEl.classList.add('draggable');
            nameEl.setAttribute("draggable", "true");

            //Event listeners for dragging
            // nameEl.addEventListener('touchmove', (e) =>{
            //     console.log("touched" + nameEl.textContent);
            //     nameEl.classList.add('dragging');
            //     let touchLocation = e.targetTouches[0];

            //     nameEl.style.position = 'fixed';
            //     nameEl.style.left = touchLocation.pageX + 'px';
            //     nameEl.style.top = touchLocation.pageY + 'px';
            // })  
            nameEl.addEventListener('dragstart', () =>{
                nameEl.classList.add('dragging');
            })  
            nameEl.addEventListener('dragend', async () =>{
                nameEl.classList.remove('dragging');
                console.log("dragend: " , nameEl.textContent);
            })

            nameList.appendChild(nameEl);
        });
    }
}

nameList.addEventListener('dragover', e => {
    e.preventDefault();
    
    const draggingEl = document.querySelector('.dragging');
    nameList.appendChild(draggingEl);
})

saveButton.addEventListener('click', async () => {
    if(nameInput.value != ""){
        let pairs = {name:nameInput.value};
        for (let i = 0; i < 30; i++) {
            pairs[i] = pairingHolder.children[i].textContent;
        }
        console.log(pairs);
        nameInput.value = "";
        // nameInput.focus();

        options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify(pairs)};
        // loadingEl.style.display ='block';
        const response = await fetch(API_URL + '/pairs', options);
        const json = await response.json();
        // loadingEl.style.display ='none';
        console.log(json);
        
        // location.reload();
        makePairs();
        makeNames();
        getSaved();
        // makePairs(json.pairs);
    }else{
        alert("Please Enter Your Name");
    }
})
getSaved();
async function getSaved(){
    options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({})};
    // loadingEl.style.display ='block';
    const response = await fetch(API_URL + '/getNames', options);
    const json = await response.json();
    // loadingEl.style.display ='none';
    console.log(json);
    // let savedNames; 

    
    if(json.pairs != null){
        while(loadHolder.firstChild){
            loadHolder.removeChild(loadHolder.firstChild);
        }
        for (let i = 0; i < json.pairs.length; i++) {
            const loadNameHolder = document.createElement('div');
            loadNameHolder.classList.add('loadNameHolder');

            const loadName = document.createElement('button');
            loadName.classList.add('loadName');
            loadName.textContent = json.pairs[i].name;
            loadName.addEventListener('click', async () =>{
                options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({name:loadName.textContent})};
                // loadingEl.style.display ='block';
                const response = await fetch(API_URL + '/getPairs', options);
                const json = await response.json();
                // loadingEl.style.display ='none';
                console.log(json);
                getSaved();
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
            const loadDel = document.createElement('button');
            loadDel.classList.add('loadDel');
            const loadDelIcon = document.createElement('i');
            loadDelIcon.classList.add('gg-trash');
            loadDel.appendChild(loadDelIcon);
            loadDel.addEventListener('click', async () =>{
                options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({name:loadName.textContent})};
                // loadingEl.style.display ='block';
                const response = await fetch(API_URL + '/delPair', options);
                const json = await response.json();
                // loadingEl.style.display ='none';
                console.log(json);
                getSaved();
            });
            loadNameHolder.appendChild(loadName);
            loadNameHolder.appendChild(loadDel);
            // savedNames[i] = json.pairs[i].name;
            loadHolder.appendChild(loadNameHolder);
        }
    }
}

modeToggle.addEventListener('click', () => {
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
        document.documentElement.style.setProperty('--highlight1','#24646a');
        document.documentElement.style.setProperty('--highlight2','#44536b');
    }
    lightMode = !lightMode;
})
resetPairs.addEventListener('click', () => {
    getSaved();
    makeNames();
    makePairs();
})