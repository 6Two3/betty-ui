"use client";

import { useNetwork } from "@/providers/network";
import { useWallet } from "@/providers/wallet";
import { Coin } from "kujira.js/lib/cjs/fin";
import { useEffect, useState } from "react";
import { Denom } from "kujira.js";
import { EncodeObject } from "@cosmjs/proto-signing";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { BigNumber } from "ethers";
import { ToastContainer, toast, Id } from "react-toastify";
import { useRef } from "react";
import {
  SubmitType,
  isError,
  isDeliverTxResponse,
} from "@/component/ui/notifications/ToasterTypes";
import { PriceData, TokenBalance } from "@/component/types/ProjectTypes";
import { getPrice } from "@/utils/PriceManager";
import TokenListRow from "@/component/ui/TokenListRow";
import { bettyRenderValue } from "@/utils/numberFormat";
import StakeTokenForm from "@/component/ui/forms/StakeTokenForm";
import { stakeItems } from "@/constant";

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-800",
  info: "bg-indigo-600",
  warning: "bg-orange-400",
  default: "bg-purple-950",
  dark: "bg-white-600 font-gray-300",
};

export default function StakeView(props: { priceData: PriceData }) {
  const [transactionResult, setTransactionResult] = useState<
    "claim-rewards-initiated" | DeliverTxResponse | Error | null
  >(null);
  const [claimableRewards, setClaimableRewards] = useState<TokenBalance[]>([]);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [selectedStakeContent, setSelectedStakeContent] = useState(
    stakeItems[0].value,
  );
  const [fetchedRewards, setFetchedRewards] = useState(false);
  const [fetchingRewards, setFetchingRewards] = useState(false);
  const mntaStakingRewardsContract =
    "kujira1lrd5lpuwym3hhv7y590yulnmqyw6j807p92ptmy3wk8836z9kscq0txr5r";
  const mntaStakingContract =
    "kujira12y9ltc6a0vnlce6dkdmkv23jm6euu3zgvnwcwlggd42wgexyvh2srr8r5q";
  const { account, refreshBalances, balances, signAndBroadcast, feeDenom } =
    useWallet();
  const toastId = useRef<Id | null>(null);

  //console.log('selected fee denom ' + feeDenom)
  const [
    { network, rpcs, rpc, setRpc, preferred, query, tmClient },
    setNetwork,
  ] = useNetwork();
  const fetchStakingRewards = async (adr: string) => {
    //const status1 = tmClient.queryContractSmart(BOW_CONTRACT_KUJI_AXLUSDC, { pool: {} });
    if (!fetchedRewards && !fetchingRewards) {
      setFetchingRewards(true);
      const queryString = { user_rewards: { user: adr } };
      const responseRewards = await query?.wasm.queryContractSmart(
        mntaStakingRewardsContract,
        queryString,
      );
      //console.log('Rewards: ' + JSON.stringify(responseRewards))
      let rewards: TokenBalance[] = [];
      let parsedAmount: number;
      let price: number;
      let denom: string;
      responseRewards.native_rewards.forEach((cObj: Coin) => {
        denom = Denom.from(cObj.denom || "").symbol.toLowerCase();
        //console.log('Staking rewards ' + JSON.stringify(cObj) + ' Price ask: ' +Denom.from(cObj.denom || "").symbol.toLowerCase())
        parsedAmount =
          parseInt(cObj.amount) / 10 ** Denom.from(cObj.denom || "").decimals;
        price = getPrice(
          Denom.from(cObj.denom || "").symbol.toLowerCase(),
          props.priceData,
        );
        //console.log()
        if (parsedAmount > 0.000000001) {
          rewards.push({
            amount: parsedAmount,
            denom: denom,
            usdValue: parsedAmount * price,
          });
        }
      });
      rewards.sort(function (a: TokenBalance, b: TokenBalance) {
        return b.usdValue - a.usdValue;
      });
      const queryStakingString = { staked: { address: adr } };
      const responseStaking = await query?.wasm.queryContractSmart(
        mntaStakingContract,
        queryStakingString,
      );
      //console.log('Staking response: ' +JSON.stringify(responseStaking))
      const stakedBig = BigNumber.from(responseStaking?.stake || 0);
      stakedBig.toNumber();
      setStakedAmount(
        stakedBig.toNumber() /
          10 **
            Denom.from(
              "factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta" ||
                "",
            ).decimals,
      );

      setClaimableRewards(rewards);
      //console.log( JSON.stringify(JSON.stringify(rewards)));
      setFetchingRewards(false);
      setFetchedRewards(true);
    }
  };
  const getStakeTabStyle = (tab: string) => {
    if (tab === selectedStakeContent) {
      return " bg-darkGray";
    } else {
      return "";
    }
  };

  useEffect(() => {
    setFetchedRewards(false);
    if (account && !fetchedRewards && !fetchingRewards) {
      fetchStakingRewards(account.address);
    }
  }, [account]);

  useEffect(() => {
    if (transactionResult === "claim-rewards-initiated") {
      toastId.current = toast(
        <SubmitType
          state={`waitingWallet`}
          message={`Claim Staking rewards `}
        ></SubmitType>,
        { autoClose: false },
      );
    } else if (isError(transactionResult)) {
      //toast.update(signTxId,'Error ' + transactionResult.message)
      if (toastId.current != undefined) {
        toast.update(toastId.current, {
          render: (
            <SubmitType
              state="error"
              message={transactionResult.message}
            ></SubmitType>
          ),
          autoClose: 5000,
        });
      }
    } else if (isDeliverTxResponse(transactionResult)) {
      //console.log('DeliveryResponse')
      let correctEvent: boolean = false;
      let receivedAmountString = "";
      let confirmedReceivedAmountString = "";

      if (toastId.current != undefined) {
        toast.update(toastId.current, {
          render: (
            <SubmitType
              state="succesful"
              tx={transactionResult.transactionHash}
              message={`Succesfully claimed Rewards`}
            ></SubmitType>
          ),
          autoClose: 5000,
        });
      } else {
        toast(
          <SubmitType
            state="succesful"
            tx={transactionResult.transactionHash}
            message={`Succesfully claimed Rewards`}
          ></SubmitType>,
          { autoClose: 5000 },
        );
      }
      refreshBalances();
      setClaimableRewards([]);
    }
  }, [transactionResult]);

  const getTokenBalance = (bObj: Coin) => {
    let tokenAmount: number =
      parseInt(bObj.amount) / 10 ** Denom.from(bObj.denom || "").decimals;
    let denom = Denom.from(bObj.denom || "").symbol.toLowerCase();
    let usdValue = tokenAmount * getPrice(denom, props.priceData);
    let tokenB: TokenBalance = {
      amount: tokenAmount,
      denom: denom,
      usdValue: usdValue,
    };
    return tokenB;
  };
  let totalClaimableUsd = 0;
  claimableRewards.forEach((bObj) => {
    totalClaimableUsd += bObj.usdValue;
  });
  let rewardsContent = <></>;
  {
    /*<div key={bObj.denom} className=" rounded p-2 bg-white/5 my-1"> 
                <div>{parseInt(bObj.amount)/
                10 ** Denom.from(bObj.denom || "").decimals} {Denom.from(bObj.denom||"").symbol} @ {getPrice(Denom.from(bObj.denom||"").symbol,props.tokenPrice)}</div>
                <div>{mantafiRenderValue(parseInt(bObj.amount)/
                10 ** Denom.from(bObj.denom || "").decimals*getPrice(Denom.from(bObj.denom||"").symbol,props.tokenPrice),'usd')}</div>
    </div>*/
  }
  const claimBalances = claimableRewards.map((bObj: TokenBalance, index) => (
    <div key={index}>
      <TokenListRow
        tBal={bObj}
        totalValue={totalClaimableUsd}
        valueDisplay="usd"
        detailedRow={true}
      ></TokenListRow>
    </div>
  ));
  const claimRewards = async () => {
    //console.log('Claim Rewards')
    if (!account) {
      return console.error("Account not found");
    }
    const actionObj = { user: account.address };
    let encoder = new TextEncoder();
    let executeMsg: EncodeObject | undefined;
    executeMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: account.address, // Address of the sender executing the contract
        contract:
          "kujira1lrd5lpuwym3hhv7y590yulnmqyw6j807p92ptmy3wk8836z9kscq0txr5r", // Address of the smart contract
        msg: encoder.encode(
          JSON.stringify({
            // Message payload for the contract execution
            // This is where you define the action and parameters for the contract
            // For example, to vote in a poll, you might have:
            claim_rewards: actionObj,
          }),
        ),
        funds: [],
      },
    };

    await submit([executeMsg]);
  };

  const submit = (data: any) => {
    if (!data || data.error) return console.error(data.error);
    // if signed, show a process spinner
    setTransactionResult("claim-rewards-initiated");
    signAndBroadcast(data)
      .then(
        async (response: DeliverTxResponse) => {
          // Handle the response here
          //console.log('Tx response: ' + JSON.stringify(response))
          setTransactionResult(response);
        }, // You may need to adjust this line based on your actual types
      )
      .catch((error: Error) => {
        // Handle the error here
        console.error("error from sign and broadcast", error);
        setTransactionResult(error);
      });
  };
  if (fetchingRewards) {
    rewardsContent = (
      <>
        {" "}
        <div className="mt-10">
          <div className="absolute bottom-5 left-5 right-5">
            <div>
              <button
                disabled
                className="bg-lightBlue text-lg text-white/30 py-3 w-full rounded-xl"
              >
                Checking Rewards
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else if (claimableRewards.length > 0) {
    rewardsContent = (
      <>
        {" "}
        <div className="mt-5 mb-20">
          <div className="grid grid-cols-2 my-3 align-text-bottom">
            <div className="ps-10 align-text-bottom">Total</div>
            <div className="text-2xl font-bold text-right">
              {bettyRenderValue(totalClaimableUsd)}
            </div>
          </div>

          <div className="max-h-96 overflow-scroll no-scrollbar">
            {claimBalances}
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <button
              className="bg-indigo-500/50 text-lg py-3 w-full rounded-xl hover:bg-indigo-500/40 cursor-pointer"
              onClick={() => claimRewards()}
            >
              Claim ({bettyRenderValue(totalClaimableUsd)})
            </button>
          </div>
        </div>
      </>
    );
  } else {
    rewardsContent = (
      <>
        {" "}
        <div className="mt-10 mb-20">
          <div className="grid grid-cols-2 my-3 px-5">
            <div className="">Total</div>
            <div className="text-2xl font-bold text-right">
              {bettyRenderValue(totalClaimableUsd)}
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <div>
              <button
                disabled
                className="bg-lightBlue text-lg text-white/30 py-3 w-full rounded-xl"
              >
                Nothing to claim
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const getCoin = (denom: string) => {
    let amount = 0;
    balances.forEach((coin) => {
      if (denom === coin.denom) {
        amount =
          parseInt(coin.amount) / 10 ** Denom.from(coin.denom || "").decimals;
      }
      {
        Denom.from(coin.denom || "").symbol;
      }
    });
    return amount;
  };

  return (
    <>
      <ToastContainer
        position="bottom-left"
        toastClassName={(context) =>
          contextClass[context?.type || "default"] +
          " relative flex p-1 min-h-24 rounded-md justify-between overflow-hidden cursor-pointer"
        }
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="my-5 ">
        <div className="text-2xl font-bold ms-5">Betty</div>
        <div className="grid md:grid-cols-2 gap-5 mt-2">
          <div className="flex flex-col p-5 bg-darkGray rounded gap-4">
            <div className="text-white/50 text-center text-xl font-bold">
              Stake xUSK
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center w-full bg-darkGray2 rounded-full p-1 gap-1">
                {stakeItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full rounded-full py-3 text-center hover:bg-darkGray transition duration-500 ease-in-out ${selectedStakeContent === item.value ? "bg-darkGray" : ""}`}
                    onClick={() => setSelectedStakeContent(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <StakeTokenForm
                denom="xusk"
                type={selectedStakeContent === "stake" ? "stake" : "unstake"}
                walletBalance={getCoin(
                  "factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta",
                )}
                staked={stakedAmount}
                tokenPrice={getPrice("mnta", props.priceData)}
              ></StakeTokenForm>
            </div>
          </div>
          <div className="p-5 bg-darkGray rounded relative h-full">
            <div className="text-white/50 text-xl text-center font-bold">
              Dao Staking Rewards
            </div>
            <div className="">{rewardsContent}</div>
          </div>
        </div>
        <div className="text-xs text-white/50 text-right mt-1 pe-5">
          Prices updated:{" "}
          {new Date(props.priceData.updated).toISOString().substring(0, 10)}{" "}
          {new Date(props.priceData.updated).toISOString().substring(11, 19)}
        </div>
      </div>
    </>
  );
}
