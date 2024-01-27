const ops = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
  exp: "^",
  srt: "√",
  per: "%",
  fac: "!",
};

const constants = {
  e: Math.E,
  π: Math.PI,
};

const digits = /[0-9]/;

const functions = {
  sin: (v) => Math.sin(v),
  cos: (v) => Math.cos(v),
  tan: (v) => Math.tan(v),
  asin: (v) => Math.asin(v),
  acos: (v) => Math.acos(v),
  atan: (v) => Math.atan(v),
  abs: (v) => Math.abs(v),
};

function isOp(char) {
  let v = false;
  for (const op in ops) {
    if (char === ops[op]) {
      v = true;
    }
  }
  return v;
}

function isDigit(char) {
  return digits.test(char);
}

function isNumChar(char) {
  return isDigit(char) || char === "." || char === "," || char === "-";
}

const isFuncChar = (char) => {
  for (const func in functions) {
    if (func.includes(char)) {
      return true;
    }
  }
  return false;
};

const isfunc = (str) => {
  for (const func in functions) {
    if (str === func) {
      return true;
    }
  }
  return false;
};

const isConst = (str) => {
  for (const constant in constants) {
    if (str === constant) {
      return true;
    }
  }
  return false;
};

function parseNum(str) {
  const withoutCommas = str.replaceAll(",", "");
  //console.log(`Commas removed: ${withoutCommas}`);
  const parsedNum = parseFloat(withoutCommas);
  //console.log(`Parsed num: ${parsedNum}`);
  return parsedNum;
}

/*
 * Returns [123.456, "+", "(", 14, "/", 1234.5, ")", "+", "s", "i", "n", "(", "π", ")"]
 */
function extractNumbers(str) {
  let [result, buffer] = [[], ""];
  str.split("").forEach((char, ind, arr) => {
    if (isNumChar(char)) {
      //console.log("found number char")
      buffer = buffer.concat(char);
      if (ind === arr.length - 1) {
        //console.log(`pushing num from buf: ${buffer}`);
        result.push(parseNum(buffer));
      }
    } else if (char !== " ") {
      //console.log("found non-number Char")
      if (buffer.length > 0) {
        //console.log(`pushing num from buf: ${buffer}`);
        result.push(parseNum(buffer), char);
        buffer = "";
      } else {
        result.push(char);
      }
    }
  });
  return result;
}

/*
 * Returns [123.456, "+", "(", 14, "/", 1234.5, ")", "+", "sin", "(", "π", ")"]
 */
function condenseFunctions(arr) {
  let [res, buf] = [[], ""];
  arr.forEach((char, ind) => {
    if (isFuncChar(char)) {
      buf = buf.concat(char);
      if (ind === arr.length + 1) {
        if (isfunc(buf)) {
          res.push(buf);
        } else {
          res.push(NaN);
        }
      }
    } else {
      if (buf.length > 0) {
        if (isfunc(buf)) {
          res.push(buf, char);
          buf = "";
        } else {
          res.push(NaN, char);
          console.log(`unknown string detected, not included in calculation`);
        }
      } else {
        res.push(char);
      }
    }
  });
  return res;
}

/*
 * Returns [123.456, "+", "(", 14, "/", 1234.5, ")", "+", "sin", "(", 3.14159..., ")"]
 */
function subConstants(arr) {
  return arr.map((v) => {
    if (isConst(v)) {
      return constants[v];
    } else {
      return v;
    }
  });
}

/*
 * Returns ["123.456", "+", ["14", "/", "1,234.5" ], "+", "sin", [3.14159...]]
 */
function group(arr) {
  let [res, buf, inGroup, depth] = [[], [], false, 0];
  arr.forEach((val, ind) => {
    if (val === "(") {
      if (!inGroup) {
        //console.log("starting group")
        inGroup = true;
        depth++;
      } else {
        buf.push(val);
        depth++;
      }
    } else if (val === ")") {
      if (inGroup && depth === 1) {
        //console.log(`ending group`)
        res.push(group(buf));
        buf = [];
        inGroup = false;
        depth = 0;
      } else if (inGroup && depth > 1) {
        buf.push(val);
        depth--;
      } else {
        res.push(group(buf));
        console.log(`Missing opening (, Assuming group starts block`);
      }
    } else {
      if (inGroup) {
        buf.push(val);
      } else {
        res.push(val);
      }
    }
    if (ind === arr.length - 1) {
      if (buf.length > 0) {
        if (inGroup) {
          res.push(group(buf));
          console.log(`Missing closing ), Assuming group finishes block`);
        } else {
          res.push(buf);
        }
      }
    }
  });

  return res;
}

function exp(arr) {
  let [operation, buffer, result] = [null, null, []];
  arr.concat("END").forEach((v) => {
    if (v === ops.exp || v == ops.srt) {
      operation = v;
    } else if (typeof v === "number") {
      if (operation === ops.exp) {
        buffer = buffer ** v;
        operation = null;
      } else if (operation === ops.srt) {
        if (buffer) {
          result.push(buffer);
        }
        if (v >= 0) {
          buffer = v ** 0.5;
        } else {
          buffer = NaN;
        }
        operation = null;
      } else {
        if (buffer !== null) {
          result.push(buffer);
          buffer = v;
        } else {
          buffer = v;
        }
      }
    } else if (v === "END") {
      if (buffer !== null) {
        result.push(buffer);
      }
    } else {
      if (buffer) {
        result.push(buffer, v);
        buffer = null;
      } else {
        result.push(v);
      }
    }
  });
  //clconsole.log(result);
  return result;
}

function mulDiv(arr) {
  let [operation, buffer, result] = [null, null, []];
  arr.concat("END").forEach((v) => {
    if (v === ops.mul || v === ops.div) {
      operation = v;
    } else if (v === ops.per) {
      if (buffer) {
        buffer /= 100;
      }
    } else if (v === ops.fac) {
      if (buffer !== null && buffer % 1 === 0 && buffer >= 0) {
        buffer = factorial(buffer);
      } else if (buffer !== null) {
        return NaN;
      }
    } else if (typeof v === "number") {
      if (operation === ops.mul) {
        buffer *= v;
        operation = null;
      } else if (operation === ops.div) {
        //console.log("dividing");
        if (v !== 0) {
          buffer /= v;
        } else {
          console.log(`Div0 Error`);
          buffer = NaN;
        }
        operation = null;
      } else {
        if (buffer !== null) {
          buffer *= v;
        } else {
          buffer = v;
        }
      }
    } else if (v === "END") {
      if (buffer !== null) {
        result.push(buffer);
      }
    } else {
      if (buffer) {
        result.push(buffer, v);
        buffer = null;
      } else {
        result.push(v);
      }
    }
  });
  //console.log(result);
  return result;
}

function addSub(arr) {
  let [operation, buffer, result] = [null, null, []];
  arr.concat("END").forEach((v) => {
    if (v === ops.add || v === ops.sub) {
      operation = v;
    } else if (typeof v === "number") {
      if (operation === ops.add) {
        buffer += v;
        operation = null;
      } else if (operation === ops.sub) {
        buffer -= v;
        operation = null;
      } else {
        buffer = v;
      }
    } else if (v === "END") {
      if (buffer !== null) {
        result.push(buffer);
      }
    } else {
      if (buffer) {
        result.push(buffer, v);
        buffer = null;
      } else {
        result.push(v);
      }
    }
  });
  //console.log(result);
  return result;
}

function factorial(n) {
  let v = 1;
  if (n === 0 || n === 1) {
    return v;
  }
  for (let i = 2; i <= n; i++) {
    v *= i;
  }
  return v;
}

export function computeArr(arr) {
  let [res, func] = [[], null];

  arr.forEach((v) => {
    if (isfunc(v)) {
      func = v;
    } else if (typeof v === "object") {
      if (func) {
        //console.log(`Resolving function: "${func}" on ${JSON.stringify(v)}`);
        const funcRes = functions[func](computeArr(v));
        //console.log(`Function result: ${JSON.stringify(funcRes)}`);
        res.push(funcRes);
        func = null;
      } else {
        //console.log(`Resolving group: ${JSON.stringify(v)}`)
        res.push(computeArr(v));
      }
    } else {
      res.push(v);
    }
  });
  //console.log(`Block resolved: ${JSON.stringify(res)}`)
  res = exp(res);
  res = mulDiv(res);
  //console.log(`Post mulDiv: ${JSON.stringify(res)}`)
  res = addSub(res);

  if (res.length === 1) {
    return res[0];
  }
}

export function parseEquation(str) {
  if (typeof str === "string" && str.length === 0) {
    return " ";
  }
  let arr = extractNumbers(str);
  //console.log(`Post extractNumbers: ${JSON.stringify(arr)}`);
  arr = condenseFunctions(arr);
  arr = subConstants(arr);
  arr = group(arr);
  //console.log(`Post group: ${JSON.stringify(arr)}`);
  return computeArr(arr);
}
