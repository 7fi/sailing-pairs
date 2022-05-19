const graphMode = document.getElementById('graphMode');
//let cScores =  [NaN,NaN,11, 4, 9, 8, 9, 8, 9,11, 3, 4, 6, 3, 5, 8, 6, 5,NaN,NaN, 3, 4, 4, 7, 4, 1, 1, 2, 11,  8,10,12,  5,  7, 4, 8, 16, 21, 1, 3, 8, 9,11,10,12];
//let eScores =  [  7,  4,10, 9, 8,10, 2, 7, 9,11, 3, 4, 6, 3, 5, 8, 6, 5,  2,  9, 3, 4, 4, 7, 4, 1, 1, 2,NaN,NaN, 4, 1,NaN,NaN,15, 4,NaN,NaN, 1, 1, 8, 9,11,10,NaN]; 
let scores1 = [];
let scores2 = [];
let fleetNum = [ 13, 13,13,13,13,13,13,13,15,15,15,15,15,15,15,15,15,15, 30, 30,10,10,10,10,10,10,10,10, 24, 24,24,24, 24, 24,24,24, 24, 24,24,24,27,27,27,27,27];
let venues = [];
let cPoints = [];
let ePoints = [];
var config;
const ctx = document.getElementById('graph');
var chart = new Chart(ctx, config);

loadScores();
async function loadScores(){
    loadingEl.style.display ='block';
    options = {method:"GET",headers:{"Content-Type":"application/json"}
    };
    const response = await fetch("http://127.0.0.1:3000" + '/scores', options);
    const json = await response.json();
    const data = json.body; 
    // console.log(json.test);

    for(let i = 1; i < fleetNum.length; i++){
        if(data[i][0] != undefined){
            scores1.push(parseInt(data[i][0]));
        }else{
            scores1.push(NaN);
        }
        if(data[i][2] != undefined){
            scores2.push(parseInt(data[i][2]));
        }else{
            scores2.push(NaN);
        }
        venues.push(json.labels[i][0]);
    }
    console.log(scores1);

    // for(let i = 0; i < fleetNum.length; i++){
    //     cPoints.push(fleetNum[i] - cScores[i]);
    //     ePoints.push(fleetNum[i] - eScores[i]);
    // }
    // console.log(cPoints);

    var datasets = [{
        label: data[0],
        data: scores1,
        borderColor: '#f00',
        backgroundColor: '#ff000055',
        fill:true,
    }]
    if(scores2.length < 0){
        datasets.push({
            label: data[0][1],
                data: scores2,
                borderColor: '#00f',
                backgroundColor: '#0000ff55',
                fill:true,
        })
    }

    config = {
        type: 'bar',
        data: {
            labels: venues,
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