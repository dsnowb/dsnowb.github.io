'use strict';

//first five Q&A's
//{{{
function firstFive() {
	var arrQs = ['Do I like whales? Y/n',
               'Do I like to *eat* whales? [Y/n]',
               'Am I a sailor? [Y/n]',
               'Do I like to *eat* sailors? [Y/n]',
               'Do I like bananas? [Y/n]'];
	var arrAs = [ true, false, true, false, true ];

	for (var i = 0; i < arrQs.length; ++i) {
		var answer = prompt(arrQs[i]);
		console.log('answer: ', answer);
		answer = answer.toLowerCase();
		if (answer !=='y' && answer !=='yes' && answer !== 'n' && answer != 'no') alert('Invalid input'); //validate input
		else if ((arrAs[i] && (answer==='y' || answer==='yes')) ||
             (!arrAs[i] && (answer==='n' || answer==='no'))) alert('You\'re right!')
		else alert('You\'re wrong.');
	}
}
//}}}

//number guessing game
//{{{
function guessingGame() {
	var numGuesses = 4;
	var range = 50;
	var number = Math.floor(Math.random()*range);
	console.log('number: ', number);

	for (var i = 0; i < numGuesses; ++i) {
  	var guess = parseInt(prompt('Guess the number! [0-' + range + ']: '));
  	console.log('guess: ', guess);
  	if (guess > number) alert('Too high');
  	else if (guess < number) alert('Too low');
  	else if (guess === number) {
   		alert('You got it!');
    	break;
  	}
  	else alert('Please enter a non-negative integer');
	}
}
//}}}

//absolutely unreasonable favorite color guessing game
//{{{
var favColors = ['blue',
                 'violet',
                 'mauve',
                 'the color of the moon',
                 'noir!',
                 'blache for that matter',
                 'plaid (red/brown/white only, all others are suboptimal)',
                 'verdant',
                 'carmine (I just heard this somewhere)',
                 'THE COLOR OF NIGHT. SUP'];

function colorGame() {
	var numGuesses = 6;
	var flag = false;
	for (var i = 0; i < numGuesses; ++i) {
		var guess = prompt('Guess one of my favorite colors!');
		console.log('guess: ', guess);
		for (var j = 0; j < favColors.length; ++j) {
			if (guess === favColors[j]) {
				alert('You got it!');
				flag = true;
				break;
			}
		}
		if (flag === true) break;
		else alert('Wrong!');
	}

	//print favColors
	var fcString = '';
	for (var i = 0; i < favColors.length; ++i) {
		fcString += '\'' + favColors[i] + '\'\n';
	}
	alert('Possible options were: \n' + fcString);
}
//}}}

//build top ten list
var fcString = '';
for (var i = 0; i < favColors.length; ++i) fcString += '<li> ' + favColors[i] + ' </li>\n';
var fcList = document.getElementById('color_list');
fcList.innerHTML = fcString;
