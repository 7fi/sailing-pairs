const graphMode = document.getElementById('graphMode');
const dropdown = document.getElementById('dropdown');
var config;
const ctx = document.getElementById('graph');
var chart = new Chart(ctx, config);
const people =[
    {name: "Adam", skipper: true, crew: false},
    {name: "Alden", skipper: true, crew: false},
    {name: "Ava", skipper: true, crew: true},
    {name: "Barret", skipper: true, crew: false},
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
    {name: "Zane", skipper: true, crew: true},

]

const API_URL = 'https://bhspairs.herokuapp.com'; // For deployment
// const API_URL = 'http://localhost:3000'; // For development 

makeDropdown();
async function makeDropdown(){
    for(let i = 0; i < people.length; i++){
        const loadScoreEl = document.createElement('div');
        loadScoreEl.innerHTML = people[i].name;
        loadScoreEl.classList.add("dropMember")

        loadScoreEl.addEventListener('click', async () =>{
            console.log("clicked", loadScoreEl.innerHTML)
            await loadScores("raw",loadScoreEl.innerHTML);
        })
        dropdown.appendChild(loadScoreEl);
    }
}

//
loadScores("points","Barrett");
async function loadScores(type, name, fleet, division, position, pair, regatta){
    loadingEl.style.display ='block';
    options = {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name, type:type, fleet:fleet,division:division,position:position,pair:pair,regatta:regatta})};
    const response = await fetch(API_URL + '/scores', options);
    const json = await response.json();
    const data = json.body; 
    console.log(json.labels);
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