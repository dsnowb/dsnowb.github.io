//tokenization
//{{{
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
  this.stream = '';
}

TokenStream.prototype.unget = function(token) {
  this.full = true;
  this.buffer = token;
}

TokenStream.prototype.get = function() {
  if (this.full) {
    this.full = false;
    return this.buffer;
  }
 
  if (this.stream.length === 0)
    return new Token(0,0);

  var index = 0;
  var input = this.stream[index];
  switch (input) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '(':
    case ')':
      this.stream = this.stream.slice(1,this.stream.length);
      console.log(input);
      return new Token(input,0);
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
      while (index < this.stream.length && (isNumber(this.stream[index+1]) || this.stream[index+1] === '.')) {
        input += this.stream[index+1];
        ++index;
      }
      this.stream = this.stream.slice(index+1,this.stream.length);
      console.log(input);
      return new Token('8', parseFloat(input));
    default:
      alert('Bad Token');
  }
}
//}}}

function primary(ts) {
  console.log('primary');
  var token = ts.get();
  switch (token.kind) {
    case '(':
      var d = expression(ts);
      token = ts.get();
      if (token.kind != ')') alert('\')\' expected!');
      return d;
    case '-':
      return - term(ts);
    case '8':
      return token.value;
    default:
      ts.unget(token);
  }
}

//multiplication and division
function term(ts) {
  console.log('term');
  var left = primary(ts);
  while(true) {
    var token = ts.get();
    switch (token.kind) {
      case '*':
        left *= primary(ts);
        break;
      case '/':
        var zcheck = ts.get();
        if (zcheck.kind==='8' && zcheck.value===0) alert('Division by zero');
        ts.unget(zcheck);
        left /= primary(ts);
        break;
      default:
        ts.unget(token);
        return left;
    }
  }
}

//addition and subtraction
function expression(ts) {
  console.log('expression');
  var left = term(ts);
  while(true) {
    var token = ts.get();
    switch (token.kind) {
      case '+':
        left += term(ts);
        break;
      case '-':
        left -= term(ts);
        break;
      default:
        ts.unget(token);
        return left;
      }
   }
}

function calculate() {
  var ts = new TokenStream;
  ts.stream = prompt('Please enter a mathmatical expression using numbers and the available operators, then press \'OK\'\nAvailable operators: () + - * /');

  alert(ts.stream + ' = ' + expression(ts));
}
