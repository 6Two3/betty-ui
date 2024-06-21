function getGlobalCachTimeOut(): number {
  let globalValue = 1;
  if (
    process.env.GLOBAL_CACHE_TIMEOUT_MIN !== undefined &&
    process.env.GLOBAL_CACHE_TIMEOUT_MIN !== null
  ) {
    globalValue = parseInt(process.env.GLOBAL_CACHE_TIMEOUT_MIN);
  }

  return globalValue * 60;
}

function getTokenImageUrlFromDenom(denom: string): string {
  let srcImage = "/images/tokens/" + denom + ".svg";
  let iDenom = denom.toLowerCase();
  //console.log('Denom: ' + denom)
  if (denom === "xusk") {
    iDenom = "usk";
    srcImage = "/images/tokens/" + iDenom + ".svg";
  } else if (denom === "xusdc") {
    iDenom = "usdc";
    srcImage = "/images/tokens/" + iDenom + ".svg";
  } else if (denom === "wmatic.axl") {
    iDenom = "matic";
    srcImage = "/images/tokens/" + iDenom + ".svg";
  } else if (denom === "wftm.axl") {
    iDenom = "ftm";
    srcImage = "/images/tokens/" + iDenom + ".svg";
  } else if (denom === "wtao.grv") {
    iDenom = "tao";
    srcImage = "/images/tokens/" + iDenom + ".svg";
  } else if (denom?.endsWith(".axl")) {
    iDenom = denom.substring(0, denom.length - 4);
    srcImage = "/images/tokens/" + iDenom + ".svg";
  } else if (denom?.endsWith(".wh")) {
    iDenom = denom.substring(0, denom.length - 3);
    //console.log('.wh Denom: ' + iDenom)
    srcImage = "/images/tokens/" + iDenom + ".svg";
  } else if (denom?.endsWith(".grv")) {
    iDenom = denom.substring(0, denom.length - 4);
    //console.log('.wh Denom: ' + iDenom)
    srcImage = "/images/tokens/" + iDenom + ".svg";
  }
  if (
    iDenom === "nami" ||
    iDenom === "sol" ||
    iDenom === "tia" ||
    iDenom === "plnk" ||
    iDenom === "rio" ||
    iDenom === "andr" ||
    iDenom === "astro" ||
    iDenom === "newt" ||
    iDenom === "ampmnta" ||
    iDenom === "usdt" ||
    iDenom === "cro" ||
    iDenom === "cmst" ||
    iDenom === "pepe" ||
    iDenom === "umee" ||
    iDenom === "juno"
  ) {
    srcImage = "/images/tokens/" + iDenom + ".png";
  }
  return srcImage;
}
function getTokenForKujiraDenom(denom: string) {
  let tokenDisplay: TokenDisplay | null = getTokenDisplayObj(denom);
  if (
    denom ===
      "factory/kujira1jelmu9tdmr6hqg0d6qw4g6c9mwrexrzuryh50fwcavcpthp5m0uq20853h/urcpt" ||
    denom.toLowerCase() === "xusdc"
  ) {
    return "usdc";
  } else if (
    denom ===
      "factory/kujira1w4yaama77v53fp0f9343t9w2f932z526vj970n2jv5055a7gt92sxgwypf/urcpt" ||
    denom.toLowerCase() === "xusk"
  ) {
    return "usk";
  } else {
    return denom;
  }
}
function getTokenDisplayDenom(denom: string) {
  let displayDenom = denom;
  let tokenObj: TokenDisplay | null | undefined = getTokenDisplayObj(denom);
  if (tokenObj !== null) {
    displayDenom = tokenObj.displayDenom;
  }
  return displayDenom;
}
function getBaseDenom(denom: string) {
  let baseDenom = denom;
  let tokenObj: TokenDisplay | null | undefined = getTokenDisplayObj(denom);
  if (tokenObj !== null) {
    baseDenom = tokenObj.baseToken;
  }
  return baseDenom;
}
function getDenomDisplayString(denom: string): string {
  let obj: TokenDisplay | null = null;
  let returnString: string = denom.toUpperCase();
  if (denom === "xusdc") {
    return "xUSDC";
  } else if (denom === "xusk") {
    return "xUSK";
  }
  if (denom.endsWith(".axl")) {
    if (denom.startsWith("wst")) {
      returnString =
        "wst" + denom.substring(3, denom.length - 4).toUpperCase() + ".axl";
    } else if (denom.startsWith("w")) {
      returnString =
        "w" + denom.substring(1, denom.length - 4).toUpperCase() + ".axl";
    } else {
      returnString =
        denom.substring(0, denom.length - 4).toUpperCase() + ".axl";
    }
  } else if (denom.endsWith(".wh")) {
    returnString = denom.substring(0, denom.length - 3).toUpperCase() + ".wh";
  } else if (denom.endsWith("wbtc")) {
    returnString = "w" + denom.substring(1, denom.length).toUpperCase();
  } else if (denom.endsWith("qcmnta")) {
    returnString = "qcMNTA";
  } else if (denom.endsWith("qckuji")) {
    returnString = "qcKUJI";
  } else if (denom.endsWith("ampmnta")) {
    returnString = "ampMNTA";
  } else if (denom.endsWith("statom")) {
    returnString = "stATOM";
  } else if (denom.endsWith("stosmo")) {
    returnString = "stOSMO";
  } else if (denom.endsWith("wsteth.axl")) {
    returnString = "wstETH.axl";
  } else if (denom.endsWith("wtao.grv")) {
    returnString = "wTAO.grv";
  } else {
    tokenDisplay.forEach((tObj: TokenDisplay) => {
      if (tObj.denom === denom) {
        obj = tObj;
        returnString = obj.displayDenom;
      }
    });
  }

  return returnString;
}
function getTokenDisplayObj(denom: string): TokenDisplay | null {
  let obj: TokenDisplay | null = null;
  tokenDisplay.forEach((tObj: TokenDisplay) => {
    if (tObj.denom === denom) {
      obj = tObj;
      return;
    }
  });
  return obj;
}
function getAccountAbbreviation(account: string): string {
  if (account.length > 20) {
    return (
      account.substring(0, 6) + "..." + account.substring(account.length - 6)
    );
  } else {
    return account;
  }
}

const tokenColors: Map = {
  mnta: "rgb(180,14,247)",
  wbtc: "rgb(255,163,23)",
  kuji: "rgb(230,57,53)",
  stars: "rgb(238,52,120)",
  usdc: "rgb(37,117,201)",
  axlusdc: "rgb(37,117,201)",
  usk: "rgb(96,252,209)",
  atom: "rgb(0,0,0)",
};
interface Map {
  [key: string]: string;
}
const stakeContract =
  "kujira12y9ltc6a0vnlce6dkdmkv23jm6euu3zgvnwcwlggd42wgexyvh2srr8r5q";
const betContract =
  "kujira174dfp0mfxqa4rl7sz9g435v4k35fmmprkrygn9n9538mpwka9wlsnvknpz";
const uskDenom =
  "factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk";
const xUskDenom =
  "factory/kujira19r7998wj50nss7r4f6dpqwmyetevw0udl5udlrt8jtswa65nplvsflv7we/ghostUSK";
const votingTime = 24 * 60 * 60 * 1000;
const tokenDisplay = [
  {
    denom:
      "factory/kujira1w4yaama77v53fp0f9343t9w2f932z526vj970n2jv5055a7gt92sxgwypf/urcpt",
    displayDenom: "xUSK",
    baseToken: "usk",
  },
  {
    denom:
      "factory/kujira1ya42knfcsvy6eztegsn3hz7zpjvhzn05ge85xa2dy2zrjeul9hnspp3c06/urcpt",
    displayDenom: "xMNTA",
    baseToken: "mnta",
  },
  {
    denom:
      "factory/kujira1jelmu9tdmr6hqg0d6qw4g6c9mwrexrzuryh50fwcavcpthp5m0uq20853h/urcpt",
    displayDenom: "xUSDC",
    baseToken: "usdc",
  },
];

type TokenDisplay = { denom: string; displayDenom: string; baseToken: string };

import { Coin } from "@cosmjs/stargate";
import { Denom } from "kujira.js";

export const coinSort = (a: Coin, b: Coin): number =>
  parseInt(b.amount || "") / 10 ** Denom.from(b.denom || "").decimals -
  parseInt(a.amount || "") / 10 ** Denom.from(a.denom || "").decimals;
export const appLink = (app: string): string => {
  const domain = window.location.host.split(".").slice(-2).join(".");
  return "https://" + app + (app === "" ? "" : ".") + domain;
};

export const defaultReplacer = (key: string, value: any) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

/*
truncates the value to `places` significant figures
*/
export const priceFormatter = (num: number): string => {
  const places =
    num > 10000 ? 7 : num > 1000 ? 6 : num > 100 ? 5 : num > 10 ? 4 : 3;

  if (num === 0) return "0";

  const multiplier = Math.pow(
    10,
    places - Math.floor(Math.log10(Math.abs(num))) - 1,
  );
  const truncated = Math.floor(num * multiplier) / multiplier;

  const units = truncated.toString().split(".").at(0)?.length || 0;
  const decimals = truncated.toString().split(".").at(1)?.length || 0;
  // we need _at least_ the total number of chars as sig figs displayed
  const dp = Math.max(places - units, decimals);
  const str = truncated.toFixed(dp);
  let [x, y] = str.split(".");
  const meme = y?.match(/^(0{3,})([0-9]+)/);
  x = parseInt(x).toLocaleString().split(".").at(0) || x;
  if (meme) {
    const len = meme.at(1)?.length || 0;
    const val = meme.at(2) || "";
    y =
      "\u0030" +
      {
        "0": "\u2080",
        "1": "\u2081",
        "2": "\u2082",
        "3": "\u2083",
        "4": "\u2084",
        "5": "\u2085",
        "6": "\u2086",
        "7": "\u2087",
        "8": "\u2088",
        "9": "\u2089",
      }[len] +
      val;
  }
  return y ? `${x}.${y}` : x;
};

export {
  getTokenForKujiraDenom,
  getGlobalCachTimeOut,
  getTokenDisplayDenom,
  getBaseDenom,
  getTokenDisplayObj,
};
export {
  getTokenImageUrlFromDenom,
  getDenomDisplayString,
  getAccountAbbreviation,
};
export {
  betContract,
  stakeContract,
  uskDenom,
  xUskDenom,
  tokenColors,
  votingTime,
};
export type { TokenDisplay };
