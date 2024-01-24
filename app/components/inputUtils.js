const digits = /[0-9]/;

const isDigit = (char) => {
  return char.test(digits);
};

export function formatInPlace(str, selectionStart, selectionEnd) {
  let [start, end, res, buf, isDec] = [
    selectionStart,
    selectionEnd,
    "",
    "",
    false,
  ];

  str.split("").forEach((char, i) => {
    if (isDigit(char)) {
      if (!isDec) {
      }
    }
  });

  return [res, start, end];
}
