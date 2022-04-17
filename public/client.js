const left = document.getElementById('left');
const right = document.getElementById('right');
const nameList = document.getElementById('listContainer');
const pairingHolder = document.getElementById('pairingHolder');

const nameInput = document.getElementById('nameInput');
const saveButton = document.getElementById('save');
const loadButton = document.getElementById('load');

const names = ['Adam', 'Alden','Ava','Barrett','Ben','Beto','Carter','Chris','Elliott','Evan','Fin','Giana','Jaya','Jeffrey','Joseph','Lauren','Luke','Maura','Maxwell','Nick','Nolan W','Nolan L','Owen','Payton','Pearl','Ryan','Sabrina','Sharkey','Stone','Talia','Zane'];
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
            
            //Event listeners for dragging
            nameEl.addEventListener('dragstart', () =>{
                nameEl.classList.add('dragging');
            })  
            
            nameEl.addEventListener('dragend', async () =>{
                nameEl.classList.remove('dragging');
                console.log("dragend: " , nameEl.textContent);
            })
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
function makeNames(){
    while (nameList.firstChild) {
        nameList.removeChild(nameList.firstChild);
    }
    names.forEach(name => {
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
}

nameList.addEventListener('dragover', e => {
    e.preventDefault();
    
    const draggingEl = document.querySelector('.dragging');
    nameList.appendChild(draggingEl);
})

saveButton.addEventListener('click', async () => {
    console.log('saveClicked');
    if(nameInput.value != ""){
        var pairs = {name:nameInput.value};
        for (let i = 0; i < 30; i++) {
            pairs[i] = pairingHolder.children[i].textContent;
        }
        console.log(pairs);
        nameInput.value = "";
        // nameInput.focus();

        options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify(pairs)};
        // loadingEl.style.display ='block';
        const response = await fetch('http://localhost:3000/pairs', options);
        const json = await response.json();
        // loadingEl.style.display ='none';
        console.log(json);
        
        // location.reload();
        makePairs();
        makeNames();
        makePairs(json.pairs);
    }else{
        alert("Please Enter Your Name");
    }
})
loadButton.addEventListener('click', async () =>{
    if(nameInput.value != ""){
        options = {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({name:nameInput.value})};
        // loadingEl.style.display ='block';
        const response = await fetch('http://localhost:3000/getPairs', options);
        const json = await response.json();
        // loadingEl.style.display ='none';
        console.log(json);
        makeNames();
        makePairs(json.pairs);
        nameInput.value = "";
    }else{
        alert("Please Enter Your Name");
    }
})