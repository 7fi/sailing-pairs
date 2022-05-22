const graphMode = document.getElementById('graphMode');
const datasets = document.getElementById('datasets');
var config;
const ctx = document.getElementById('graph');
var chart = new Chart(ctx, config);

addDataset();
async function addDataset(){
    const datasetEl = document.createElement('div');
    datasetEl.classList.add("dataset");

    let types = ["raw", "points", "ratio"];
    let fleets = ["any","g", "s","z"];
    let divisions = ["any","a", "b"];

    const typeDrop = document.createElement('div');
    typeDrop.classList.add("dropdown");
    const typeDropLabel = document.createElement('div');
    typeDropLabel.innerHTML = "raw";
    typeDrop.appendChild(typeDropLabel);
    
    for(let i = 0; i < types.length; i++){
        const typeDropMember = document.createElement('div');
        typeDropMember.innerHTML = types[i];
        typeDropMember.classList.add("dropMember");
        typeDropMember.addEventListener('click', async() =>{
            typeDropLabel.innerHTML = typeDropMember.innerHTML;
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML);
        })
        typeDrop.appendChild(typeDropMember);
    }

    const nameDrop = document.createElement('div');
    nameDrop.classList.add("dropdown");
    const nameDropLabel = document.createElement('div');
    nameDropLabel.innerHTML = "Barrett";
    nameDrop.appendChild(nameDropLabel);
    for(let i = 0; i < people.length; i++){
        const loadScoreEl = document.createElement('div');
        loadScoreEl.innerHTML = people[i].name;
        loadScoreEl.classList.add("dropMember");
        loadScoreEl.addEventListener('click', async() =>{
            nameDropLabel.innerHTML = loadScoreEl.innerHTML;
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML,divisionDropLabel.innerHTML);
        })

        nameDrop.appendChild(loadScoreEl);
    }

    const fleetDrop = document.createElement('div');
    fleetDrop.classList.add("dropdown");
    const fleetDropLabel = document.createElement('div');
    fleetDropLabel.innerHTML = "any";
    fleetDrop.appendChild(fleetDropLabel);
    for(let i = 0; i < fleets.length; i++){
        const fleetEl = document.createElement('div');
        fleetEl.innerHTML = fleets[i];
        fleetEl.classList.add("dropMember");
        fleetEl.addEventListener('click', async() =>{
            fleetDropLabel.innerHTML = fleetEl.innerHTML;
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML,divisionDropLabel.innerHTML);
        })

        fleetDrop.appendChild(fleetEl);
    }

    const divisionDrop = document.createElement('div');
    divisionDrop.classList.add("dropdown");
    const divisionDropLabel = document.createElement('div');
    divisionDropLabel.innerHTML = "any";
    divisionDrop.appendChild(divisionDropLabel);
    for(let i = 0; i < divisions.length; i++){
        const divisionEl = document.createElement('div');
        divisionEl.innerHTML = divisions[i];
        divisionEl.classList.add("dropMember");
        divisionEl.addEventListener('click', async() =>{
            divisionDropLabel.innerHTML = divisionEl.innerHTML;
            await loadScores(typeDropLabel.innerHTML,nameDropLabel.innerHTML,fleetDropLabel.innerHTML,divisionDropLabel.innerHTML);
        })

        divisionDrop.appendChild(divisionEl);
    }

    datasetEl.appendChild(typeDrop);
    datasetEl.appendChild(nameDrop);
    datasetEl.appendChild(fleetDrop);
    datasetEl.appendChild(divisionDrop);

    datasets.appendChild(datasetEl);
}

loadScores("points","Barrett");
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

    var datasets = [{
        label: name,
        data: data,
        borderColor: '#f00',
        backgroundColor: '#ff000055',
        fill:true,
    }]
    
    config = {
        type: 'bar',
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
    loadingEl.style.display ='none';
}


graphMode.addEventListener('click', () =>{
    type();
})
function type(){
    if(config.type == 'bar'){
        config.type = 'line';
    }else{
        config.type = 'bar';
    }
    chart.destroy();
    chart = new Chart(ctx, config);
}