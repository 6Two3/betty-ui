import { usePasskeys } from "@/providers/passkey";
import { getAccountAbbreviation } from "../../../utils/utils";
import BorderedButton from "../BorderedButton";
import {
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
} from "@headlessui/react";
import {
  bettyRenderValue,
  bettyRenderDouble,
  bettyRenderPrice,
} from "../../../utils/numberFormat";
import { Adapter, useWallet } from "@/providers/wallet";
import { useEffect, useState } from "react";
import { Coin } from "kujira.js/lib/cjs/fin";
import { PriceData, TokenBalance } from "../../types/ProjectTypes";

import { Denom } from "kujira.js";
import { getPrice } from "../../../utils/PriceManager";
import UpdateIcon from "../../icons/UpdateIcon";
import TokenImage from "../TokenImage";
import { getDenomDisplayString } from "../../../utils/utils";
import ExternalLinkIcon from "../../icons/ExternalLinkIcon";
import CopyIcon from "../../icons/CopyIcon";

export default function WalletConnected(props: { priceData: PriceData }) {
  const defaultTokenBalance: TokenBalance[] = [];
  const { signer, client } = usePasskeys();
  const { balances, account, refreshBalances, connect } = useWallet();
  const baseAddressUrl = "https://finder.kujira.network/harpoon-4/";

  const [tokenBalances, setTokenBalances] = useState(defaultTokenBalance);
  const [walletValue, setWalletValue] = useState(0);

  const [walletBalanceUpdating, setWalletBalanceUpdating] = useState(false);
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account.address);
    }
  };
  const updateBalances = async () => {
    //console.log('Clicked update: ' + walletBalanceUpdating)
    setWalletBalanceUpdating(true);

    await refreshBalances();

    /*
        console.log('Clicked update: ' + walletBalanceUpdating)
        let newWalletValue = 0;
        let newTokenBalances:TokenBalance[]=[];
        let tokenB:TokenBalance;
        balances.forEach(bObj=>{
            newWalletValue+=parseInt(bObj.amount)/
            10 ** Denom.from(bObj.denom || "").decimals*getPrice(Denom.from(bObj.denom||"").symbol,props.priceData)
            //console.log('updateBalances: ' + Denom.from(bObj.denom||"").symbol + ' ' + getPrice(Denom.from(bObj.denom||"").symbol,props.priceData))
            tokenB = {amount:parseInt(bObj.amount)/
            10 ** Denom.from(bObj.denom || "").decimals,denom:Denom.from(bObj.denom||"").symbol.toLowerCase(),usdValue:parseInt(bObj.amount)/
            10 ** Denom.from(bObj.denom || "").decimals*getPrice(Denom.from(bObj.denom||"").symbol,props.priceData)}

            newTokenBalances.push(tokenB)
        })
        setWalletValue(newWalletValue)
        newTokenBalances.sort(function(a,b){
            return b.usdValue-a.usdValue
        })
        setTokenBalances(newTokenBalances)*/
    setTimeout(() => setWalletBalanceUpdating(false), 1000);
  };
  useEffect(() => {
    if (connect !== null) {
      connect(Adapter.Passkey);
    }

    //updateBalances()
  }, []);
  let address = "";
  if (signer !== undefined) {
    address = signer?.credential.address;
  }
  useEffect(() => {
    let newWalletValue = 0;
    let newTokenBalances: TokenBalance[] = [];
    let tokenB: TokenBalance;
    balances.forEach((bObj) => {
      newWalletValue +=
        (parseInt(bObj.amount) / 10 ** Denom.from(bObj.denom || "").decimals) *
        getPrice(Denom.from(bObj.denom || "").symbol, props.priceData);
      tokenB = {
        amount:
          parseInt(bObj.amount) / 10 ** Denom.from(bObj.denom || "").decimals,
        denom: Denom.from(bObj.denom || "").symbol.toLowerCase(),
        usdValue:
          (parseInt(bObj.amount) /
            10 ** Denom.from(bObj.denom || "").decimals) *
          getPrice(Denom.from(bObj.denom || "").symbol, props.priceData),
      };

      newTokenBalances.push(tokenB);
    });
    setWalletValue(newWalletValue);
    newTokenBalances.sort(function (a, b) {
      return b.usdValue - a.usdValue;
    });
    setTokenBalances(newTokenBalances);
  }, [balances]);

  const tokenBalancesContent = tokenBalances.map((tObj, index) => (
    //<div key={tObj.denom} className="grid grid-cols-2 border-b border-b-white/5 px-5 py-3 hover:bg-white/5">
    <div
      key={index}
      className="flex items-center justify-center border-b border-b-white/5 px-5 py-3 hover:bg-white/5"
    >
      <div>
        <TokenImage denom={tObj.denom} size={26}></TokenImage>
      </div>
      <div className="mx-4">
        <div>
          {" "}
          <span>{getDenomDisplayString(tObj.denom)}</span>
        </div>
        <div className="text-xs text-white/50">
          {bettyRenderPrice(getPrice(tObj.denom, props.priceData))}
        </div>
      </div>
      <div className="text-right pe-3 ml-auto">
        <div>{bettyRenderDouble(tObj.amount, 2)}</div>
        <div className="text-white/50">{bettyRenderValue(tObj.usdValue)}</div>
      </div>
    </div>
  ));
  return (
    <>
      <Popover className="relative min-w-36">
        <PopoverButton className="">
          <BorderedButton px={3} py={1}>
            <div className="ps-2 text-sm">
              {getAccountAbbreviation(address)}
            </div>
          </BorderedButton>
        </PopoverButton>
        <PopoverOverlay className="fixed inset-0 bg-black opacity-50 z-20" />

        <PopoverPanel className="fixed z-50 right-2 sm:right-5 sm:clear-left    top-20 h-[calc(100vh-100px)] ">
          <div className="relative border border-blue-500/20 w-96 h-full rounded bg-gray-900 overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="border-b border-b-white/10 pb-2 mb-2">
                <div className="flex items-centered gap-3 px-5 pt-5">
                  <div>
                    <div className="text-sm text-white/50"> Wallet Value</div>
                    <div className="text-2xl font-bold">
                      {" "}
                      {bettyRenderValue(walletValue)}
                    </div>
                    <div>{getAccountAbbreviation(address)}</div>
                  </div>
                </div>
                <div className="flex ml-auto text-right ps-5 pt-2 items-centered">
                  <div onClick={() => updateBalances()} className="me-2">
                    <BorderedButton>
                      <UpdateIcon
                        size={4}
                        animate={walletBalanceUpdating}
                      ></UpdateIcon>
                    </BorderedButton>
                  </div>
                  <div className="me-2">
                    <BorderedButton>
                      <a
                        target="finder"
                        href={baseAddressUrl + "address/" + account?.address}
                      >
                        <ExternalLinkIcon size={4}></ExternalLinkIcon>
                      </a>
                    </BorderedButton>
                  </div>

                  <div onClick={() => copyAddress()} className="me-2">
                    <BorderedButton>
                      <CopyIcon size={4}></CopyIcon>
                    </BorderedButton>
                  </div>
                </div>
              </div>
              <div className="flex ml-auto text-right ps-5 pt-2 items-centered"></div>
              <div className="px-3">{tokenBalancesContent}</div>
              {/**/}
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    </>
  );
}
