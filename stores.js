'use strict';

//Data and objects
//*******************************************************************************************************************
//specific store data array
//array data is of the form [store location, address, opening hour in military time, closing hour in military time, minimum
//number of customers, maximum number of customers, average cookies per customer]

var arrStoreData = [];
if (!localStorage.getItem('localArrStoreData')) {
  arrStoreData = [  ['1st and Pike', 6, 20, 23, 65, 6.3],
                    ['SeaTac Airport', 6, 20, 3, 24, 1.2],
                    ['Seattle Center', 6, 20, 11, 38, 3.7],
                    ['Capitol Hill', 6, 20, 20, 38, 2.3],
                    ['Alki', 6, 20, 2, 16, 4.6] ];
  localStorage.setItem('localArrStoreData',JSON.stringify(arrStoreData));
}
arrStoreData = JSON.parse(localStorage.getItem('localArrStoreData'));

//The earliest and latest store hours among all locations
var earlyHour = arrStoreData[0][1];
var lateHour = arrStoreData[0][2];
for (var i = 1; i < arrStoreData.length; ++i) {
  if (arrStoreData[i][1] < earlyHour) earlyHour = arrStoreData[i][1];
  if (arrStoreData[i][2] > lateHour) lateHour = arrStoreData[i][2];
}

//array of store hours for printing table headers
var arrStoreHrs = [];
for (var i = 0; i < lateHour - earlyHour; ++i) arrStoreHrs[i] = hourToStd(earlyHour + i);

//Global helper functions
//*******************************************************************************************************************
//Converts from military time to standard time
function hourToStd(hour) {
  if (hour < 12) hour += 'am';
  else if (hour === 12) hour += 'pm';
  else {
    hour -= 12;
    hour += 'pm';
  }
  return hour;
};

//Generates a random integer between min and max, inclusive
var random = function(min,max) {
  return Math.round(Math.random() * (max - min) + min);
};

//Appends a header to table $tableId using elements in array $arr. Adds a header $addHead and final column $addLast if desired
var renderArrAsHead = function(arr,tableId,addHead,addLast) {
  var trEl = document.createElement('tr');

  //Create header column for row using addHead if applicable
  if (addHead) {
    var thEl = document.createElement('th');
    thEl.textContent = addHead;
    trEl.appendChild(thEl);
  }

  //Generate <th>'s for header
  for (var i = 0; i < arr.length; ++i) {
    var thEl = document.createElement('th');
    thEl.textContent = arr[i];
    trEl.appendChild(thEl);
  }

  //Create ending column using addLast if applicable
  if (addLast) {
    var thEl = document.createElement('th');
    thEl.textContent = addLast;
    trEl.appendChild(thEl);
  }

  document.getElementById(tableId).appendChild(trEl);
};

//Appends a row to table $tableId using elements in array $arr. Adds a header $addHead and final column $addLast if desired
var renderArrAsRow = function(arr,tableId,addHead,addLast) {
  var trEl = document.createElement('tr');

  //Create header column for row using addHead if applicable
  if (addHead) {
    var thEl = document.createElement('th');
    thEl.textContent = addHead;
    trEl.appendChild(thEl);
  }

  //Generate <td>'s for row
  for (var i = 0; i < arr.length; ++i) {
    var tdEl = document.createElement('td');
    tdEl.textContent = arr[i];
    trEl.appendChild(tdEl);
  }

  //Create ending column using addLast if applicable
  if (addLast) {
    var tdEl = document.createElement('td');
    tdEl.textContent = addLast;
    trEl.appendChild(tdEl);
  }

  document.getElementById(tableId).appendChild(trEl);
};

//Store constructor function
//*******************************************************************************************************************
var Store = function(locale,hrOpen,hrClose,minCust,maxCust,cookiesPerCust) {
  this.locale = locale;
  this.hourOpen = hrOpen;
  this.hourClose = hrClose;
  this.minCustomers = minCust;
  this.maxCustomers = maxCust;
  this.cookiesPerCust = cookiesPerCust;
  this.minToss = 2;
  this.custPerToss = 20;
  this.custPerHour = [];
  this.cookiesPerHour = [];
  this.tossPerHour = [];
  this.totalCust = 0;
  this.totalCookies = 0;

  //Simulates the number of customers for this store object for every hour of all stores' operations
  //Uses that number of customers to build associated arrays for cookies sold per hour and tossers required per hour
  this.simCust = function() {
    //size and initialize arrays
    for (var i = 0; i < lateHour - earlyHour; ++i) {
      this.custPerHour.push(0);
      this.cookiesPerHour.push(0);
      this.tossPerHour.push(0);
    }
    /*
    for (var i = 0; i < 24; ++i) {
      this.custPerHour.push('');
      this.cookiesPerHour.push('');
      this.tossPerHour.push('');
    }
    */
    //load applicable array elements
    for (var i = this.hourOpen - earlyHour; i < this.hourClose - earlyHour; ++i) {
      this.custPerHour[i] = random(this.minCustomers,this.maxCustomers);
      this.cookiesPerHour[i] = Math.ceil(this.custPerHour[i] * this.cookiesPerCust);
      this.tossPerHour[i] = Math.ceil(this.custPerHour[i] / this.custPerToss);
      if (this.tossPerHour[i] < this.minToss) this.tossPerHour[i] = this.minToss;
      this.totalCust += this.custPerHour[i];
      this.totalCookies += this.cookiesPerHour[i];
    }
  };
  
  this.simCust();
}


//Instantiate store objects and load them into array
//*******************************************************************************************************************
var arrStores = [];
for (var i = 0; i < arrStoreData.length; i++)
 arrStores.push(new Store(arrStoreData[i][0], arrStoreData[i][1], arrStoreData[i][2], arrStoreData[i][3], arrStoreData[i][4], arrStoreData[i][5]));
