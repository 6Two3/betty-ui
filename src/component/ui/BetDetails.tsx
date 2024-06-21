import { BetItem } from "../types/ProjectTypes";
import { votingTime } from "../../utils/utils";

import { useState, useEffect } from "react";
import { useNetwork } from "@/providers/network";
import { betContract } from "../../utils/utils";
import { Voter, VotingOption } from "../types/ProjectTypes";
import BettingOptionCard from "./BettingOptionCard";
export default function BetDetails(props: { betItem: BetItem }) {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votingOptions, setVotingOptions] = useState<VotingOption[]>([]);
  let statusContent = <>{JSON.stringify(props.betItem)}</>;
  const [{ query }, setNetwork] = useNetwork();

  const getTotalVotes = (vOption: VotingOption) => {
    let totalBets = 0;
    vOption.voters.forEach((v) => {
      totalBets += Number(v.amount) / 10 ** 6;
    });
    return totalBets;
  };
  const loadBets = async () => {
    const queryString = { bids: { game_idx: props.betItem.idx, limit: 30 } };
    const responseVoters = await query?.wasm.queryContractSmart(
      betContract,
      queryString,
    );
    setVoters(responseVoters);
    let newVotingOptions: VotingOption[] = [];
    props.betItem.options.forEach((encOption) => {
      newVotingOptions.push({ name: atob(encOption), voters: [] });
    });
    responseVoters.forEach((voter: Voter) => {
      newVotingOptions.forEach((vOption) => {
        if (vOption.name === atob(voter.option)) {
          vOption.voters.push(voter);
        }
      });
    });
    votingOptions.sort(function (a, b) {
      return getTotalVotes(a) - getTotalVotes(b);
    });
    setVotingOptions(newVotingOptions);
  };
  useEffect(() => {
    loadBets();
  }, []);
  if (Number(props.betItem.bidding_ends_at) / 10 ** 6 > Date.now()) {
    statusContent = (
      <span className="bg-green-700 py-1 px-3 rounded">Open</span>
    );
  } else if (
    Number(props.betItem.bidding_ends_at) / 10 ** 6 + votingTime >
    Date.now()
  ) {
    statusContent = (
      <span className="bg-amber-700 py-1 px-3 rounded">Voting</span>
    );
  } else {
    statusContent = (
      <span className="bg-lightBlue py-1 px-3 rounded text-white">Done</span>
    );
  }
  const optionsContent = votingOptions.map((vOptionsItem, index) => (
    <BettingOptionCard
      votingOption={vOptionsItem}
      key={index}
    ></BettingOptionCard>
  ));

  return (
    <>
      <div className="text-white/50 mt-10">
        <div className="text-3xl text-white/80 font-bold">
          {props.betItem.title}
        </div>

        <div className="sm text-white/50"></div>
        <div className="my-2">{statusContent}</div>
        <div>{props.betItem.description}</div>
        <div className="my-5">
          <div>Current Winner is</div>
          <div className="text-3xl font-bold text-white">
            {votingOptions.length > 0 ? votingOptions[0].name : ""}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {optionsContent}
        </div>
      </div>
    </>
  );
}
