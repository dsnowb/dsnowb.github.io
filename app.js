//NOTE: This script depends on stores.js being loaded before it.

'use strict';

//Looks for loclist <ul> and prints into it a series of <li>'s,
//each consisting of a store location and its respective hours
var loclist = document.getElementById('loclist');
for (var i = 0; i < arrStores.length; i++) {
  var locli = document.createElement('li');
  var loch5 = document.createElement('h5');
  var locaddr = document.createElement('p');
  var lochrs = document.createElement('p');

  loch5.textContent = arrStores[i].locale;
//  locaddr.textContent = arrStores[i].address;
  lochrs.textContent = hourToStd(arrStores[i].hourOpen) + ' - ' + hourToStd(arrStores[i].hourClose);

  locli.appendChild(loch5);
//  locli.appendChild(locaddr);
  locli.appendChild(lochrs);

  loclist.appendChild(locli);
}
