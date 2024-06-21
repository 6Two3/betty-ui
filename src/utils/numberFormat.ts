function bettyRenderValue(amount: number) {
  return "$" + bettyRenderDouble(amount, 2);
}
function bettyRenderPrice(amount: number) {
  const decimals = 2;
  if (amount >= 0) {
    return "$" + bettyRenderDouble(amount, decimals);
  } else {
    return "($" + bettyRenderDouble(-1.0 * amount, decimals) + ")";
  }
}

function bettyRenderDouble(amount: number, numberOfDecimals: number) {
  let numberOfDec = 2;
  let decimalSep = ".";
  let thousandSep: string = ",";
  //let locale="sv-SE";
  //let locale="un-US";
  let locale = undefined;
  if (numberOfDecimals != null) {
    numberOfDec = numberOfDecimals;
  }
  return amount.toLocaleString(locale, {
    maximumFractionDigits: numberOfDec,
    minimumFractionDigits: numberOfDec,
  });
}
function bettyRenderDate(time: number): string {
  let formattedString = "";
  const date = new Date(time);
  const datePart = date.toISOString().substring(0, 10);
  const timePart = date.toISOString().substring(11, 19);
  return datePart + " " + timePart;
}

export {
  bettyRenderDouble,
  bettyRenderPrice,
  bettyRenderDate,
  bettyRenderValue,
};
