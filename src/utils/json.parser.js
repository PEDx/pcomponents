export default (function () {
  let at,
    ch,
    escapee = {
      '"': '"',
      '\\': '\\',
      '/': '/',
      b: 'b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t'
    },
    text,
    error = function (m) {
      throw {
        name: 'SyntaxError',
        massage: m,
        at, text
      }
    },
    next = function (c) {
      if (c && c !== ch) {
        error('Expected "' + c + '" instead of "' + ch + '"')
      }
      ch = text.charAt(at);
      at += 1;
      return ch;
    },
    number = function () {
      let number,
        string = '';
      if (ch === '-') {
        string = '-';
        next('-');
      }
      while (ch <= '9' && ch >= '0') {
        string += ch;
        next()
      }
      if (ch === '.') {
        string += '.';
        while (next() && ch <= '9' && ch >= '0') {
          string += ch;
        }
      }

      if (ch === 'E' || ch === 'e') {
        string += ch;
        next()
        if (ch === '-' || ch === '+') {
          string += ch;
          next();
        }
        while (ch <= '9' && ch >= '0') {
          string += ch;
          next()
        }
      }

      number = +string;
      if (isNaN(number)) {
        error("Bad Number");
      } else {
        return number;
      }
    },
    string = function () {
      let hex,
        i,
        string = '',
        uffff;


      if (ch === '"') {
        while (next()) {
          if (ch === '"') {
            next();
            return string;
          } else if (ch === '\\') { // 转义字符 unicode
            next();
            if (ch === 'u') { // unicode
              uffff = 0;
              for (let i = 0; i < 4; i++) {
                hex = parseInt(next(), 16);
                if (!isFinite(hex)) {
                  break;
                }
                uffff = uffff * 16 + hex;
              }
              string += String.fromCharCode(uffff);
            } else if (typeof escapee[ch] === 'string') {
              string += escapee[ch]
            } else {
              break;
            }
          } else {
            string += ch;
          }

        }
      }
      error("Bad String")
    },
    white = function () {
      while (ch && ch <= ' ') {
        next();
      }
    },
    word = function () {
      switch (ch) {
        case 't':
          next('t');
          next('r');
          next('u');
          next('e');
          return true;
        case 'f':
          next('f');
          if (ch === 'u') {
            next('u');
            next('n');
            next('c');
            return func();
          }
          next('a');
          next('l');
          next('s');
          next('e');
          return false;

        case 'n':
          next('n');
          next('u');
          next('l');
          next('l');
          return null;
      }
      error('Except "' + ch + '"')
    },
    func = function () {
      let arg = '',
        body = '';
      white()
      if (ch === '(') {
        next('(');
        white()
        while (ch) {
          if (ch === ')') {
            next(')')
            break
          }
          arg += ch;
          next()
        }
        white()
        next('{');
        while (ch) {
          if (ch === '}') {
            next('}')
            break;
          }
          body += ch;
          next()
        }
        white()
        return new Function(arg, body)
      }
      error('Bad func')
    },
    array = function () {
      let array = [];
      if (ch === '[') {
        next('[');
        white()
        if (ch === ']') {
          next(']');
          return array;
        }
        while (ch) {
          array.push(value());
          white();
          if (ch === ']') {
            next(']');
            return array;
          }
          next(',');
          white()
        }
      }
      error("Bad array");
    },
    object = function () {
      let key,
        object = {};

      if (ch === '{') {
        next('{');
        white();
        if (ch === '}') {
          next('}');
          return object;
        }
        while (ch) {
          key = string();
          white();
          next(':');
          object[key] = value();
          white();
          if (ch === '}') {
            next('}');
            return object;
          }
          next(',');
          white();
        }
      }
      error("Bad object");
    },
    value = function () {
      white();
      switch (ch) {
        case '{':
          return object();
        case '[':
          return array();
        case '"':
          return string();
        case '-':
          return number();
        default:
          return ch >= '0' && ch <= '9' ? number() : word();
      }
    };

  return function (source) {
    let result;
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
      error('SyntaxError');
    }
    return result;
  }
})()
