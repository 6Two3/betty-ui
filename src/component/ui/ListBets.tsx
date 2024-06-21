"use client";

import { usePasskeys } from "@/providers/passkey";
import ConnectButton from "./ConnectButton";
import WelcomeComponent from "../WelcomeComponent";
import { BetItem } from "../types/ProjectTypes";
import { bettyRenderDate } from "../../utils/numberFormat";
import MakeBetDialog from "./forms/MakeBetForm";
import { useState } from "react";
import CreateBetForm from "./forms/CreateBetForm";
import MakeVoteDialog from "./forms/MakeVoteForm";
import { useEffect } from "react";
import { useNetwork } from "@/providers/network";
import { betContract } from "../../utils/utils";
import BorderedButton from "./BorderedButton";
import BetDetails from "./BetDetails";
import { votingTime } from "../../utils/utils";
import { IconArrowLeft } from "../icons";
export default function ListBetsModule() {
  const [games, setGames] = useState<BetItem[]>([]);
  const [selectedBet, setSelectedBet] = useState<null | BetItem>(null);
  const [{ query }, setNetwork] = useNetwork();
  //const bets:BetItem[]=[{date:Date.now()-10*60*1000,name:'Test Done'},{date:Date.now()+3*60*1000,name:'Test 2'},{date:Date.now()-60*3600*1000,name:'Test 3'}]

  const getBetStatusContent = (bItem: BetItem) => {
    //return <div className="absolute top-0 right-0 bg-green-700 py-1 px-3 rounded">Open</div>
    /**/
    if (Number(bItem.bidding_ends_at) / 10 ** 6 > Date.now()) {
      return (
        <div className="absolute top-0 right-0 bg-green-700 py-1 px-3 rounded">
          Open
        </div>
      );
    } else if (
      Number(bItem.bidding_ends_at) / 10 ** 6 + votingTime >
      Date.now()
    ) {
      return (
        <div className="absolute top-0 right-0 bg-amber-700 py-1 px-3 rounded">
          Voting
        </div>
      );
    } else {
      return (
        <div className="absolute top-0 right-0 bg-lightBlue py-1 px-3 rounded">
          Done
        </div>
      );
    }
  };
  const loadGames = async () => {
    //console.log('Load Games')
    let moreItemsToCheck = true;
    let page = 0;
    let queryString = { games: { limit: 30, reverse: true } };
    // while(moreItemsToCheck){

    //     if(){

    //     }

    // }

    const responseGames = await query?.wasm.queryContractSmart(
      betContract,
      queryString,
    );
    setGames(responseGames);
    //console.log('Games: ' + JSON.stringify(responseGames))
  };
  useEffect(() => {
    //console.log('useEffect in Bet Items Load Games')
    loadGames();
  }, []);
  const getActionButton = (bItem: BetItem) => {
    // return (<div className="mt-5 flex">
    //         <MakeBetDialog bet={bItem} ></MakeBetDialog>
    //         <div className="ms-2" onClick={()=>setSelectedBet(bItem)}><BorderedButton py={1}>Open</BorderedButton></div>
    //     </div>)
    if (Number(bItem.bidding_ends_at) / 10 ** 6 > Date.now()) {
      return (
        <div className="mt-5 flex">
          <MakeBetDialog bet={bItem}></MakeBetDialog>
          <div className="ms-2" onClick={() => setSelectedBet(bItem)}>
            <BorderedButton py={1}>Open</BorderedButton>
          </div>
        </div>
      );
    } else if (
      Number(bItem.bidding_ends_at) / 10 ** 6 + votingTime >
      Date.now()
    ) {
      return (
        <div className="mt-5 flex">
          <MakeVoteDialog bet={bItem}></MakeVoteDialog>
          <div className="ms-2" onClick={() => setSelectedBet(bItem)}>
            <BorderedButton py={1}>Open</BorderedButton>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-5 flex">
          <div className="ms-2" onClick={() => setSelectedBet(bItem)}>
            <BorderedButton py={1}>Open</BorderedButton>
          </div>
        </div>
      );
    }
  };

  const listContent = games.map((bItem, index) => (
    <div key={index} className="bg-darkGray rounded-lg p-5 relative">
      {getBetStatusContent(bItem)}
      <div>{bettyRenderDate(Number(bItem.bidding_ends_at) / 10 ** 6)}</div>
      <div>
        {bItem.title} ({bItem.idx})
      </div>
      {getActionButton(bItem)}
    </div>
  ));
  let mainContent = <></>;
  if (selectedBet === null) {
    mainContent = (
      <>
        <div>
          <CreateBetForm></CreateBetForm>
        </div>
        <div>
          <WelcomeComponent></WelcomeComponent>
        </div>

        <div className="my-5">ListBets</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listContent}
        </div>
      </>
    );
  } else {
    mainContent = (
      <>
        <button
          className="flex items-center gap-3 my-2 select-none hover-animate"
          onClick={() => setSelectedBet(null)}
        >
          <IconArrowLeft className="w-5 h-5" />
          Back
        </button>
        <BetDetails betItem={selectedBet}></BetDetails>
      </>
    );
  }
  return <>{mainContent}</>;
}
