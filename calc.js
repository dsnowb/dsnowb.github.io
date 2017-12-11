function isNumber(val) {
  return parseInt(val) == val;
}

function Token(kind,value) {
  this.kind = kind;
  this.value = value;
}

function TokenStream() {
  this.full = false;
  this.buffer = 0;
}

TokenStream.prototype.unget = function(headToken) {
  this.full = true;
  this.buffer = headToken;
}


TokenStream.prototype.get = function(stream) {
  if (this.full) {
    this.full = false;
    return this.buffer;
  }
  
  var index = 0;
  var input = stream[index];
  switch (input) {
    case '+':
    case '-':
    case '*':
    case '/':
      stream = stream.slice(1,stream.length);
      var token = new Token(input,0);
      return [token,stream];
    case '.':
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      while (index < stream.length && (isNumber(stream[index+1]) || stream[index+1] === '.')) {
        input += stream[index+1];
        ++index;
      }
      input = parseFloat(input);
      stream = stream.slice(index+1,stream.length);
      var token = new Token('8',input);
      return [token,stream];
    default:
      alert('Bad token');
  }
}

var ts = new TokenStream;

function calculate() {
  var stream = prompt('Please enter a mathmatical expression using numbers and the available operators, then press \'OK\'\nAvailable operators: + - * /');
    for (var i = 0; i < 3; ++i) {
    arrGet = ts.get(stream);
    stream = arrGet[1];
    token = arrGet[0];
    console.log(token);
  }





  alert(stream);

}
