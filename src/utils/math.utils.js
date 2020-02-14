/**
 * Floors a given number and format to show only the given number of decimal digits
 * 
 * @param {Number} n number to floor
 * @param {Number} digits number of digits after the decimal separator
 */
const floorTo = (n, digits) => {
  let negative = false;
  if (digits === undefined) digits = 0;
  
  if (n < 0) {
    negative = true;
    n = n * -1;
  }

  let multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.floor(n) / multiplicator).toFixed(digits);
  if (negative) n = (n * -1).toFixed(digits);
  return n;
}

export default floorTo;