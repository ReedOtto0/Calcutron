const digits = /[0-9]/;

const isDigit = (char = false) => {
  return digits.test(char);
};

export function formatExpressionInPlace(
  str,
  selectionStart = 0,
  selectionEnd = 0
) {
  let [start, end, res, buf, inDec] = [
    selectionStart,
    selectionEnd,
    "",
    "",
    false,
  ];

  str.split("").forEach((char, i) => {
    if (isDigit(char) || char === ",") {
      if (!inDec) {
        buf = buf.concat(char);
      } else {
        res = res.concat(char);
      }
    } else {
      if (char === ".") {
        inDec = true;
      }
      if (buf.length > 0) {
        //do sting format magic here...
        if (buf.length > 3) {
          const offset = i - buf.length + 1;
          [buf, start, end] = formatNumberInPlace(
            buf,
            start - offset,
            end - offset
          );
          start += offset;
          end += offset;
          //console.log(`Found Number ${buf}!`);
        }
        res = res.concat(buf).concat(char);
        buf = "";
      } else {
        res = res.concat(char);
        if (inDec) {
          inDec = false;
        }
      }
    }
    if (i === str.length - 1) {
      if (buf.length > 3) {
        const offset = i - buf.length + 1;
        //console.log(offset);
        [buf, start, end] = formatNumberInPlace(
          buf,
          start - offset,
          end - offset
        );
        start += offset;
        end += offset;
        //console.log(`Found Number ${buf}!`);
        res = res.concat(buf);
      } else if (buf.length > 0) {
        res = res.concat(buf);
      }
    }
  });

  return [res, start, end];
}

export function formatNumberInPlace(str, selectionStart = 0, selectionEnd = 0) {
  let [res, start, end, charNum] = ["", selectionStart, selectionEnd, 1];

  for (let i = str.length - 1; i >= 0; i--) {
    const char = str[i];
    if (charNum % 4 === 0) {
      if (char === ",") {
        res = char.concat(res);
        charNum++;
      } else {
        res = char.concat(",").concat(res);
        charNum++;
        //console.log(`Inserted "," @ i = ${i}`);
        if (selectionStart >= i) {
          start++;
        }
        if (selectionEnd >= i) {
          end++;
        }
      }
    } else {
      if (char !== ",") {
        res = char.concat(res);
      } else {
        if (selectionStart > i) {
          start--;
        }
        if (selectionEnd > i) {
          end--;
        }
      }
    }
    if (isDigit(char)) {
      charNum++;
    }
  }

  return [res, start, end];
}
