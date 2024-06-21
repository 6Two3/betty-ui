import { PriceData } from "../component/types/ProjectTypes";
function getPrice(denom: string, priceData: PriceData): number {
  let tokenDenom = denom.toLowerCase();
  let prices = priceData.prices as any;
  //console.log('Prices: ' +prices)
  /*if(tokenDenom ==='weth.axl'){
        tokenDenom = 'eth'
    }
    else if(tokenDenom ==='wmatic.axl'){
        tokenDenom = 'matic'
    }
    else if(tokenDenom ==='wftm.axl'){
        tokenDenom = 'ftm'
    }
    else if(tokenDenom.endsWith('.axl')){
        tokenDenom = tokenDenom.substring(0,tokenDenom.length-4)
    }
    else if(tokenDenom.endsWith('.wh')){
        tokenDenom = tokenDenom.substring(0,tokenDenom.length-3)
    }
    else if(tokenDenom.endsWith('.grv')){
        tokenDenom = tokenDenom.substring(0,tokenDenom.length-4)
    }*/
  if (tokenDenom === "usdt.axl") {
    tokenDenom = "usdt";
  } else if (tokenDenom === "wbtc.axl") {
    tokenDenom = "wbtc";
  }

  //console.log('Price ask: ' + tokenDenom + ' '+priceData['usd-'+tokenDenom])
  if (prices["usd-" + tokenDenom] !== undefined) {
    return prices["usd-" + tokenDenom];
  } else {
    return 0;
  }
}

export { getPrice };
