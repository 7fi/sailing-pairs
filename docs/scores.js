const graphMode = document.getElementById('graphMode');
const datasetsEls = document.getElementById('datasets');
var config;
const ctx = document.getElementById('graph');
const addDatasetButton = document.getElementById('addDataset');
var chart = new Chart(ctx, config);
let datasets = [];
let chartType = 'bar';

addDataset();
async function addDataset(){
    const datasetEl = document.createElement('div');
    datasetEl.classList.add("dataset");

    let types = ["raw", "points", "ratio"];
    let fleets = ["any","g", "s","z"];
    let divisions = ["any","a", "b"];

    const typeDropLabel = document.createElement('div');
    typeDropLabel.classList.add("dropLabel");
    typeDropLabel.innerHTML = "raw";
    const typeDrop = document.createElement('div');
    typeDrop.classList.add("dropdown");
    typeDrop.appendChild(typeDropLabel);
    const typeDropMenu = document.createElement('div');
    typeDropMenu.classList.add("dropdownMenu");
    typeDrop.appendChild(typeDropMenu);

    
    for(let i = 0; i < types.length; i++){
        const typeDropMember = document.createElement('div');
        typeDropMember.innerHTML = types[i];
        typeDropMember.classList.add("dropMember");
        typeDropMember.addEventListener('click', async() =>{
            typeDropLabel.innerHTML = typeDropMember.innerHTML;
            datasets.splice(datasets.findIndex(element => element.label == nameDropLabel.innerHTML),1);
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML);
        })
        typeDropMenu.appendChild(typeDropMember);
    }

    const nameDrop = document.createElement('div');
    nameDrop.classList.add("dropdown");
    const nameDropLabel = document.createElement('div');
    nameDropLabel.classList.add("dropLabel");
    nameDropLabel.innerHTML = "Carter";
    nameDrop.appendChild(nameDropLabel);
    const nameDropMenu = document.createElement('div');
    nameDropMenu.classList.add("dropdownMenu");
    nameDrop.appendChild(nameDropMenu);
    
    for(let i = 0; i < people.length; i++){
        const loadScoreEl = document.createElement('div');
        loadScoreEl.innerHTML = people[i].name;
        loadScoreEl.classList.add("dropMember");
        loadScoreEl.addEventListener('click', async() =>{
            datasets.splice(datasets.findIndex(element => element.label == nameDropLabel.innerHTML),1);
            nameDropLabel.innerHTML = loadScoreEl.innerHTML;
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML,divisionDropLabel.innerHTML);
        })

        nameDropMenu.appendChild(loadScoreEl);
    }

    const fleetDrop = document.createElement('div');
    fleetDrop.classList.add("dropdown");
    const fleetDropLabel = document.createElement('div');
    fleetDropLabel.classList.add("dropLabel");
    fleetDropLabel.innerHTML = "any";
    fleetDrop.appendChild(fleetDropLabel);
    const fleetDropMenu = document.createElement('div');
    fleetDropMenu.classList.add("dropdownMenu");
    fleetDrop.appendChild(fleetDropMenu);

    for(let i = 0; i < fleets.length; i++){
        const fleetEl = document.createElement('div');
        fleetEl.innerHTML = fleets[i];
        fleetEl.classList.add("dropMember");
        fleetEl.addEventListener('click', async() =>{
            fleetDropLabel.innerHTML = fleetEl.innerHTML;
            datasets.splice(datasets.findIndex(element => element.label == nameDropLabel.innerHTML),1);
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML,divisionDropLabel.innerHTML);
        })

        fleetDropMenu.appendChild(fleetEl);
    }

    const divisionDrop = document.createElement('div');
    divisionDrop.classList.add("dropdown");
    const divisionDropLabel = document.createElement('div');
    divisionDropLabel.classList.add("dropLabel");
    divisionDropLabel.innerHTML = "any";
    divisionDrop.appendChild(divisionDropLabel);
    const divisionDropMenu = document.createElement('div');
    divisionDropMenu.classList.add("dropdownMenu");
    divisionDrop.appendChild(divisionDropMenu);

    for(let i = 0; i < divisions.length; i++){
        const divisionEl = document.createElement('div');
        divisionEl.innerHTML = divisions[i];
        divisionEl.classList.add("dropMember");
        divisionEl.addEventListener('click', async() =>{
            divisionDropLabel.innerHTML = divisionEl.innerHTML;
            datasets.splice(datasets.findIndex(element => element.label == nameDropLabel.innerHTML),1);
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML,divisionDropLabel.innerHTML);
        })

        divisionDropMenu.appendChild(divisionEl);
    }

    const flexGap = document.createElement('div');
    flexGap.classList.add("flexGap");

    const delDataset = document.createElement('div');
    delDataset.classList.add("delDataset");
    delDataset.innerHTML = "-";
    delDataset.addEventListener('click',() => {
        datasets.splice(datasets.findIndex(element => element.label == nameDropLabel.innerHTML),1);
        datasetEl.remove();
        updateGraph();
    })

    datasetEl.appendChild(typeDrop);
    datasetEl.appendChild(nameDrop);
    datasetEl.appendChild(fleetDrop);
    datasetEl.appendChild(divisionDrop);
    datasetEl.appendChild(flexGap);
    datasetEl.appendChild(delDataset);
    
    datasetsEls.insertBefore(datasetEl, addDatasetButton);
    
    let curDrops = [typeDrop,nameDrop,fleetDrop,divisionDrop];
    curDrops.forEach(dropdown => {
        dropdown.addEventListener('click', () =>{
            document.querySelectorAll(".dropdown").forEach(x => {if(x != dropdown)x.classList.remove("active")});
            dropdown.classList.toggle("active");
        });
    })
    loadScores("raw", "Carter");

}
addDatasetButton.addEventListener('click', ()=>{
    addDataset();
})

let colors = ['#ff0000', '#00ff00', '#0000ff', "#ffbf00", "#ff7700", "#00fff7", "#008cff", "#9d00ff", "#ff00f7"];
// let backgroundColors = ["#ff000055", "#00ff0055", "#0000ff55"];
async function loadScores(type, name, fleet, division, position, pair, regatta){

    if(fleet == 'any') {fleet = undefined};
    if(division == 'any'){division = undefined};

    loadingEl.style.display ='block';
    options = {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name, type:type, fleet:fleet,division:division,position:position,pair:pair,regatta:regatta})};
    const response = await fetch(API_URL + '/scores', options);
    const json = await response.json();
    const data = json.body; 
    console.log(data);
    labels = [];
    for (let i = 1; i < json.labels.length; i++) {
        labels.push(json.labels[i]);
    }

    let colorNum = Math.floor(Math.random() * colors.length);
    let borderColor = colors[colorNum];
    datasets.push({
        label: name,
        data: data,
        backgroundColor: colors[colorNum] + "55",
        borderColor: colors[colorNum],
        borderWidth: 2,
        fill:false,
    });
    console.log(datasets)
    updateGraph();
    loadingEl.style.display ='none';
}
function updateGraph(){
    config = {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Spring 2022 Scores (From Spreadsheet)'
                }
            }
        }
    };
    chart.destroy();
    chart = new Chart(ctx, config);
}
let types = ["bar", "line", "scatter"];
graphMode.addEventListener('click', () =>{
    type(types[(types.indexOf(config.type) + 1) % 3])
})
function type(type){
    config.type = type;
    // chartType = type;
    console.log(config.type)
    chart.destroy();
    chart = new Chart(ctx, config);
}