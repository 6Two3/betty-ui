import { VotingOption, Voter } from "../types/ProjectTypes";
import { bettyRenderDouble } from "../../utils/numberFormat";
import { getAccountAbbreviation } from "../../utils/utils";
import { useState } from "react";
export default function BettingOptionCard(props: {
  votingOption: VotingOption;
}) {
  const sortedList: Voter[] = JSON.parse(
    JSON.stringify(props.votingOption.voters),
  );

  sortedList.sort(function (a: Voter, b: Voter) {
    return Number(a.amount) - Number(b.amount);
  });
  const getTotalVotes = () => {
    let totalBets = 0;
    sortedList.forEach((v) => {
      totalBets += Number(v.amount) / 10 ** 6;
    });
    return totalBets;
  };
  const votersContent = sortedList.map((voter, index) => (
    <div key={index}>
      <div className="flex px-5">
        {bettyRenderDouble(Number(voter.amount) / 10 ** 6, 6)} USK voted by{" "}
        {getAccountAbbreviation(voter.bidder)}
      </div>
    </div>
  ));
  return (
    <>
      <div className="bg-black/20 p-5 rounded">
        <div>{props.votingOption.name}</div>
        <div className="text-xl font-bold">
          {bettyRenderDouble(getTotalVotes(), 2)} USK{" "}
          <span className="text-sm font-regular"> Total Bets</span>
        </div>
        <div>{votersContent}</div>
      </div>
    </>
  );
}
