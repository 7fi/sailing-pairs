const graphMode = document.getElementById('graphMode');
const dataset1 = document.getElementById('dataset1');
var config;
const ctx = document.getElementById('graph');
var chart = new Chart(ctx, config);

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
        dataset1.appendChild(loadScoreEl);
    }
}

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