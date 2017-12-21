'use strict';

var numSelects = 25;
var countSelects = 0;

var fcPaths = ['img/bag.jpg', 'img/banana.jpg', 'img/bathroom.jpg', 'img/boots.jpg',
               'img/breakfast.jpg', 'img/bubblegum.jpg', 'img/chair.jpg', 'img/cthulhu.jpg',
               'img/dog-duck.jpg', 'img/dragon.jpg', 'img/pen.jpg', 'img/pet-sweep.jpg',
               'img/scissors.jpg', 'img/shark.jpg', 'img/sweep.png', 'img/tauntaun.jpg',
               'img/unicorn.jpg', 'img/usb.gif', 'img/water-can.jpg', 'img/wine-glass.jpg']

FocusChoice.choices = [];
loadChoices();
if (localStorage.FocusChoiceChoices) askStartOver();
else init();

function askStartOver() {
  var body = document.querySelector('body');
  var overlay = document.createElement('div');
  var challenge = document.createElement('p');
  var yBtn = document.createElement('div');
  var nBtn = document.createElement('div');
  overlay.setAttribute('id', 'overlay');
  yBtn.setAttribute('class', 'overlay_btn');
  nBtn.setAttribute('class', 'overlay_btn');
  challenge.textContent = 'It appears you\'ve already entered some info...';
  yBtn.textContent = 'Start Over';
  nBtn.textContent = 'Continue';
  nBtn.addEventListener('click',function() { loadPrior(); document.querySelector('body').removeChild(document.getElementById('overlay')); init();});
  yBtn.addEventListener('click',function() { document.querySelector('body').removeChild(document.getElementById('overlay')); init();});
  
  overlay.appendChild(challenge);
  overlay.appendChild(yBtn);
  overlay.appendChild(nBtn);
  body.appendChild(overlay);
}

function loadPrior() {
  countSelects = parseInt(localStorage.countSelects);
  FocusChoice.choices = JSON.parse(localStorage.FocusChoiceChoices);
}

function FocusChoice(path) {
  this.path = path;
  this.numClicks = 0;
  this.numShown = 0;
  this.ratio = 0;
  this.shownThis = false;
  this.shownLast = false; 
  this.name = path.split('/')[1].split('.')[0].toLowerCase();
  FocusChoice.choices.push(this);
}

function loadChoices() {
  for (var i = 0; i < fcPaths.length; ++i) new FocusChoice(fcPaths[i]);
}

function getFocusChoice() {
  var choicesIndex;
  do {
    choicesIndex = Math.floor(Math.random() * FocusChoice.choices.length);
  } while (FocusChoice.choices[choicesIndex].shownThis || FocusChoice.choices[choicesIndex].shownLast)
  
  return choicesIndex;
}

function renderChoice(imgId) {
  var imgEl = document.getElementById(imgId);
  var choicesIndex = getFocusChoice();
  imgEl.setAttribute('src', FocusChoice.choices[choicesIndex].path);
  imgEl.setAttribute('alt', choicesIndex);
  FocusChoice.choices[choicesIndex].shownThis = true;
  ++FocusChoice.choices[choicesIndex].numShown;
}

function renderChoices() {
  var arrImgEl = document.getElementsByClassName('focus_choice');
  for (var i = 0; i < arrImgEl.length; ++i) renderChoice(arrImgEl[i].getAttribute('id'));
  for (var i = 0; i < FocusChoice.choices.length; ++i) {
    FocusChoice.choices[i].shownLast = false;
    if (FocusChoice.choices[i].shownThis) FocusChoice.choices[i].shownLast = true;
    FocusChoice.choices[i].shownThis = false;
  }
}

function selectChoice(e) {
  ++countSelects;
  var choiceIndex = e.target.getAttribute('alt');
  ++FocusChoice.choices[choiceIndex].numClicks;
  localStorage.FocusChoiceChoices = JSON.stringify(FocusChoice.choices);
  localStorage.countSelects = countSelects;
  renderChoices();
  if (countSelects === numSelects) {
    calcRatios();
    renderResults();
  }
}

function calcRatios() {
  for (var i = 0; i < FocusChoice.choices.length; ++i)
    !FocusChoice.choices[i].numShown ? FocusChoice.choices[i].ratio = 0 : FocusChoice.choices[i].ratio = FocusChoice.choices[i].numClicks / FocusChoice.choices[i].numShown;
  sortChoicesByRatio();
}

function sortChoicesByRatio() {
  do {
    var flag = false;
    for (var i = 0; i < FocusChoice.choices.length - 1; ++i) {
      if (!FocusChoice.choices[i].numShown) {
        FocusChoice.choices.push(FocusChoice.choices.splice(i,1)[0]);
        flag = true;
      }
      if (FocusChoice.choices[i].ratio < FocusChoice.choices[i+1].ratio) {
        var temp = FocusChoice.choices[i];
        FocusChoice.choices[i] = FocusChoice.choices[i+1];
        FocusChoice.choices[i+1] = temp;
        flag = true;
      }
    }
  } while (flag)
}

function renderResults() {
  var mainEl = document.getElementsByTagName('main')[0];
  mainEl.innerHTML = '<section id="charts"></section>'; 

  var ulElLeft = document.createElement('ul');
  var ulElRight = document.createElement('ul');
  for (var i = 0; i < FocusChoice.choices.length; ++i) {
    var liElLeft = document.createElement('li');
    liElLeft.textContent = FocusChoice.choices[i].name + ': ';
    ulElLeft.appendChild(liElLeft);
    var liElRight = document.createElement('li');
    liElRight.textContent = FocusChoice.choices[i].numClicks + ' votes out of ' + FocusChoice.choices[i].numShown + ' opportunities. (' + Math.round(FocusChoice.choices[i].ratio*100) + '%)';
    ulElRight.appendChild(liElRight);
  }
 
  mainEl.appendChild(ulElLeft);
  mainEl.appendChild(ulElRight);
  renderCharts('bar');
}

function renderChart(canvasId, chartType, arrLabels, arrData, dataLabel)  {
  //make some chart colors
  var bgColors = [];
  var bdColors = [];
  for (var i = 0; i < arrData.length; ++i) {
    bgColors.push('rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')');
    bdColors.push('#000000');
  }

  //render chart
  var ctx = document.getElementById(canvasId).getContext('2d');
  var chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: arrLabels,
      datasets: [{
        label: dataLabel,
        data: arrData,
        backgroundColor: bgColors,
        borderColor: bdColors,
        borderWidth: 1
      }]
    },
    options: {}
  });
}

function renderCharts(chartType) {
  var sectionEl = document.getElementById('charts');
  sectionEl.innerHTML = '<div class="chart_btn" id="button_bar">Bars</div><div class="chart_btn" id="button_pie">Pie</div><div class="chart_btn" id="button_line">Line</div>';
  var chartBtns = document.getElementsByClassName('chart_btn');
  chartBtns[0].addEventListener('click', function() { renderCharts(chartBtns[0].getAttribute('id').split('_')[1]); });  
  chartBtns[1].addEventListener('click', function() { renderCharts(chartBtns[1].getAttribute('id').split('_')[1]); });  
  chartBtns[2].addEventListener('click', function() { renderCharts(chartBtns[2].getAttribute('id').split('_')[1]); });  
  //I have commented this out because it's not working right for unknown reasons >:|
  //for (var i = 0; i < chartBtns.length; ++i) {
  //  console.log(chartBtns[i].getAttribute('id'));
  //  chartBtns[i].addEventListener('click', function() {console.log(chartBtns[i].getAttribute('id'));});  
  //}

  //load arrays with results
  var names = [];
  var totals = [];
  var percents = [];
  for (var i = 0; i < FocusChoice.choices.length; ++i) {
    names.push(FocusChoice.choices[i].name);
    totals.push(FocusChoice.choices[i].numClicks);  
    if (FocusChoice.choices[i].numShown) percents.push(Math.round(100*FocusChoice.choices[i].ratio));
  }

  var numCharts = 2;
  var chartsEl = document.getElementById('charts');
  for (var i = 0; i < numCharts; ++i) {
    var canvasEl = document.createElement('canvas');
    canvasEl.setAttribute('id','chart_' + i);
    chartsEl.appendChild(canvasEl);
  }

  renderChart('chart_0',chartType,names,totals,'Absolute number of clicks');
  renderChart('chart_1',chartType,names,percents,'Percentage clicked when shown');
}

function init() {
  if (countSelects === numSelects) {
    calcRatios();
    renderResults();
    return;
  }
  var arrImgEl = document.getElementsByClassName('focus_choice');
  for (var i = 0; i < arrImgEl.length; ++i) 
    arrImgEl[i].addEventListener('click',selectChoice);

  renderChoices();
}

