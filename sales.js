//NOTE: This script depends upon stores.js being loaded before it

'use strict';

//calculates the hourly totals for all stores' array $arr and optionally adds a total for all hourly totals by setting addSum
//returns the result as an array
var arrTotals = function(arr,addSum) {
  var arrTotals = [];
  var totDaily = 0;
  for (var i = 0; i < arrStoreHrs.length; ++i) {
    var totPerHour = 0;
    for (var j = 0; j < arrStores.length; ++j) totPerHour += arrStores[j][arr][i];
    arrTotals[i] = totPerHour;
    totDaily += totPerHour;
  }
  if (addSum) arrTotals.push(totDaily);

  return arrTotals;
};

//renders into a customer per hour table $tableId
var renderCustTable = function(tableId) {
  renderArrAsHead(arrStoreHrs,tableId,' ','Totals');
  for (var i = 0; i < arrStores.length; ++i)
    renderArrAsRow(arrStores[i].custPerHour,tableId,arrStores[i].locale,arrStores[i].totalCust);
  renderArrAsRow(arrTotals('custPerHour',1),tableId,'Totals','');
};

//renders into a cookie sales table $tableId
var renderSalesTable = function(tableId) {
  renderArrAsHead(arrStoreHrs,tableId,' ','Totals');
  for (var i = 0; i < arrStores.length; ++i)
    renderArrAsRow(arrStores[i].cookiesPerHour,tableId,arrStores[i].locale,arrStores[i].totalCookies);
  renderArrAsRow(arrTotals('cookiesPerHour',1), tableId,'Totals','');
};

//render into a tossers required per store per hour table $tableId
var renderTosserTable = function(tableId) {
  renderArrAsHead(arrStoreHrs,tableId,' ','');
  for (var i = 0; i < arrStores.length; ++i)
    renderArrAsRow(arrStores[i].tossPerHour,tableId,arrStores[i].locale,'');
  renderArrAsRow(arrTotals('tossPerHour',0),tableId,'Totals','');
};

function renderTables() {
  renderCustTable('customer_table');
  renderSalesTable('sales_table');
  renderTosserTable('tosser_table');
}

function unrenderTables() {
  document.getElementById('customer_table').innerHTML = '';
  document.getElementById('sales_table').innerHTML = '';
  document.getElementById('tosser_table').innerHTML = '';
}

//Right now this can't properly render the table if store hours are chosen outside initial earlyHour and lateHour
//Tables are rendered right after page reload.
function addStore(e) {
  e.preventDefault();
  var locale = e.target.name.value;
  var hrOpen = parseInt(e.target.open.value);
  var hrClose = parseInt(e.target.close.value);
  var minCust = parseInt(e.target.minC.value);
  var maxCust = parseInt(e.target.maxC.value);
  var cookiesPerCust = parseFloat(e.target.cpc.value);
  arrStores.push(new Store(locale,hrOpen,hrClose,minCust,maxCust,cookiesPerCust));
  arrStoreData.push([locale,hrOpen,hrClose,minCust,maxCust,cookiesPerCust]);
  localStorage.setItem('localArrStoreData', JSON.stringify(arrStoreData));
  unrenderTables();
  renderTables();
  addStoreForm.reset();
}
  
renderTables();
var addStoreForm = document.getElementById('add_store');
addStoreForm.addEventListener('submit', function(e) {addStore(e)});
