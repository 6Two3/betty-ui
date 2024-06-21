import { Pair } from "kujira.js/lib/cjs/fin";
import { PAIRS } from "kujira.js/lib/cjs/fin";
function getDenomFromSymbol(symbol: string): string {
  let denom = "";

  const finPairs: Record<string, Pair> = PAIRS["kaiyo-1"];
  const keys: string[] = Object.keys(finPairs);
  let iteratePair: Pair;
  keys.forEach((key) => {
    iteratePair = finPairs[key];
    if (symbol === iteratePair.denoms[0].symbol.toLowerCase()) {
      denom = iteratePair.denoms[0].reference;
      return denom;
    } else if (symbol === iteratePair.denoms[1].symbol.toLowerCase()) {
      denom = iteratePair.denoms[1].reference;
      return denom;
    }
  });
  return denom;
}
function getSymbolFromDenom(denom: string): string {
  let symbol = "not found";

  const finPairs: Record<string, Pair> = PAIRS["kaiyo-1"];
  const keys: string[] = Object.keys(finPairs);
  let iteratePair: Pair;
  keys.forEach((key) => {
    iteratePair = finPairs[key];
    //console.log('Denom: ' + denom + ' Pair[0]ref: ' + iteratePair.denoms[0].reference + ' Pair[1]ref:' + iteratePair.denoms[1].reference)
    if (denom.toLowerCase() === iteratePair.denoms[0].reference.toLowerCase()) {
      //console.log('Denom FOUND: ' + denom + ' Pair[0]ref: ' + iteratePair.denoms[0].reference)
      symbol = iteratePair.denoms[0].symbol;
      return symbol;
    } else if (
      denom.toLowerCase() === iteratePair.denoms[1].reference.toLowerCase()
    ) {
      //console.log('Denom FOUND: ' + denom + ' Pair[1]ref: ' + iteratePair.denoms[0].reference)
      symbol = iteratePair.denoms[1].symbol;
      return symbol;
    }
  });
  return symbol;
}
function getDecimalsFromDenom(denom: string): number {
  let decimals = 6;

  const finPairs: Record<string, Pair> = PAIRS["kaiyo-1"];
  const keys: string[] = Object.keys(finPairs);
  let iteratePair: Pair;
  keys.forEach((key) => {
    iteratePair = finPairs[key];
    //console.log('Denom: ' + denom + ' Pair[0]ref: ' + iteratePair.denoms[0].reference + ' Pair[1]ref:' + iteratePair.denoms[1].reference)
    if (denom.toLowerCase() === iteratePair.denoms[0].reference.toLowerCase()) {
      //console.log('Denom FOUND: ' + denom + ' Pair[0]ref: ' + iteratePair.denoms[0].reference)
      decimals = iteratePair.denoms[0].decimals;
      return decimals;
    } else if (
      denom.toLowerCase() === iteratePair.denoms[1].reference.toLowerCase()
    ) {
      //console.log('Denom FOUND: ' + denom + ' Pair[1]ref: ' + iteratePair.denoms[0].reference)
      decimals = iteratePair.denoms[1].decimals;
      return decimals;
    }
  });
  return decimals;
}
export { getDenomFromSymbol, getSymbolFromDenom, getDecimalsFromDenom };
