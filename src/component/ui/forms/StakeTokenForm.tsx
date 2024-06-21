"use client";
import TokenImage from "../TokenImage";
import { useState, useEffect } from "react";
import { useWallet } from "@/providers/wallet";
import { useNetwork } from "@/providers/network";
import { EncodeObject } from "@cosmjs/proto-signing";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { stakeContract } from "../../../utils/utils";
import WalletIcon from "../../icons/WalletIcon";
import BorderedButton from "../BorderedButton";
import {
  bettyRenderDouble,
  bettyRenderDate,
  bettyRenderValue,
} from "../../../utils/numberFormat";
import { getDenomDisplayString } from "../../../utils/utils";
import StakeIcon from "../../icons/StakeIcon";
import { useRef } from "react";
import { toast, Id } from "react-toastify";
import {
  SubmitType,
  isError,
  isDeliverTxResponse,
} from "../notifications/ToasterTypes";

export default function StakeTokenForm(props: {
  type: string;
  denom: string;
  walletBalance: number;
  staked: number;
  tokenPrice: number;
}) {
  const [transactionResult, setTransactionResult] = useState<
    "stake-initiated" | "unstake-initiated" | DeliverTxResponse | Error | null
  >(null);
  const { account, refreshBalances, balances, signAndBroadcast } = useWallet();
  const [
    { network, rpcs, rpc, setRpc, preferred, query, tmClient },
    setNetwork,
  ] = useNetwork();
  const [inputStakeValue, setChangeInputStakeValue] = useState("");
  const toastId = useRef<Id | null>(null);

  const setAmountFromWallet = (fraction: number) => {
    if (props.type === "stake") {
      setChangeInputStakeValue((fraction * props.walletBalance).toFixed(6));
    } else if (props.type === "unstake") {
      setChangeInputStakeValue((fraction * props.staked).toFixed(6));
    }
  };

  const getStakeDisplayAmount = () => {
    if (inputStakeValue.length > 0) {
      return parseFloat(inputStakeValue) + props.staked;
    } else {
      return props.staked;
    }
  };
  const getStakeDisplayValue = () => {
    if (inputStakeValue.length > 0) {
      return (parseFloat(inputStakeValue) + props.staked) * props.tokenPrice;
    } else {
      return props.staked * props.tokenPrice;
    }
  };
  useEffect(() => {
    if (transactionResult === "stake-initiated") {
      toastId.current = toast(
        <SubmitType
          state={`waitingWallet`}
          message={
            `Stake ` +
            inputStakeValue +
            ` ` +
            getDenomDisplayString(props.denom)
          }
        ></SubmitType>,
        { autoClose: false },
      );
    } else if (transactionResult === "unstake-initiated") {
      toastId.current = toast(
        <SubmitType
          state={`waitingWallet`}
          message={
            `Unstake ` +
            inputStakeValue +
            ` ` +
            getDenomDisplayString(props.denom)
          }
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
              message={
                `Succesfully ` +
                props.type +
                `d ` +
                bettyRenderDouble(parseFloat(inputStakeValue), 2) +
                ` ` +
                props.denom
              }
            ></SubmitType>
          ),
          autoClose: 5000,
        });
      } else {
        toast(
          <SubmitType
            state="succesful"
            tx={transactionResult.transactionHash}
            message={
              `Succesfully ` +
              props.type +
              `d ` +
              bettyRenderDouble(parseFloat(inputStakeValue), 2) +
              ` ` +
              props.denom
            }
          ></SubmitType>,
          { autoClose: 5000 },
        );
      }
      refreshBalances();
    }
  }, [transactionResult]);
  const submit = (data: any) => {
    if (!data || data.error) return console.error(data.error);
    // if signed, show a process spinner
    if (props.type === "stake") {
      setTransactionResult("stake-initiated");
    } else if (props.type === "unstake") {
      setTransactionResult("unstake-initiated");
    }

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
  const onClickStake = async () => {
    //console.log('Stake clicked: ' + inputStakeValue)
    if (!account) {
      return console.error("Account not found");
    }
    let fundsObj: any[] = [];
    let amountAsString = parseFloat(inputStakeValue) * 1000000;
    let msgObj = {};
    if (props.type === "stake") {
      const fundObj = {
        amount: "" + amountAsString,
        denom: "factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta",
      };
      fundsObj = [fundObj];
      msgObj = { bond: {} };
    } else if (props.type === "unstake") {
      msgObj = { unbond: { tokens: "" + amountAsString } };
    }
    const actionObj = { user: account.address };
    //setStakedAmount(stakedBig.toNumber()/10 ** Denom.from("factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta" || "").decimals)
    let encoder = new TextEncoder();
    let executeMsg: EncodeObject | undefined;
    executeMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: account.address, // Address of the sender executing the contract
        contract: stakeContract, // Address of the smart contract
        msg: encoder.encode(JSON.stringify(msgObj)),
        funds: fundsObj,
      },
    };

    await submit([executeMsg]);
  };

  const onChangeStakeValue = (event: React.FormEvent<HTMLInputElement>) => {
    let replacedValue = event.currentTarget.value.replace(",", ".").trim();
    let splitByDot: string[] = replacedValue.split(".");
    let parsedValue: number = parseFloat(replacedValue);
    let stakeAmount = parseInt(event.currentTarget.value);
    if (
      splitByDot.length < 3 &&
      (splitByDot.length === 0 || splitByDot[splitByDot.length - 1].length <= 6)
    ) {
      if (event.currentTarget.value.length === 0) {
        setChangeInputStakeValue("");
      } else if (
        event.currentTarget.value.length > 0 &&
        (replacedValue.charAt(replacedValue.length - 1) === "." ||
          replacedValue.charAt(replacedValue.length - 1) === "0")
      ) {
        setChangeInputStakeValue(replacedValue);
      } else if (!isNaN(parsedValue)) {
        setChangeInputStakeValue(parsedValue + "");
      }
    } else if (
      splitByDot.length < 3 &&
      splitByDot.length > 0 &&
      splitByDot[splitByDot.length - 1].length <= 6
    ) {
      setChangeInputStakeValue(parsedValue.toFixed(6));
    }
  };
  let stakeButtonContent = (
    <button
      disabled
      className="bg-lightBlue text-lg text-white/30 py-3 w-full rounded-xl"
    >
      Enter Amount
    </button>
  );
  if (!isNaN(parseFloat(inputStakeValue)) && parseFloat(inputStakeValue) > 0) {
    if (
      (props.type === "stake" &&
        parseFloat(inputStakeValue) <= props.walletBalance) ||
      (props.type === "unstake" && parseFloat(inputStakeValue) <= props.staked)
    ) {
      stakeButtonContent = (
        <button
          className="bg-indigo-500/50 text-lg py-3 w-full rounded-xl hover:bg-indigo-500/40 cursor-pointer"
          onClick={() => onClickStake()}
        >
          {props.type === "stake" ? "Stake" : "Unstake"}
        </button>
      );
    } else {
      stakeButtonContent = (
        <button className="bg-indigo-500/20 text-white/30 text-lg py-3 w-full rounded-xl">
          Insufficient funds
        </button>
      );
    }
  }

  return (
    <>
      <div className="flex justify-between text-sm px-2">
        <div></div>
        <div className="flex space-x-2 text-right items-center">
          <div className="text-white/50 flex items-center">
            {props.type === "stake" && (
              <div className="flex items-center">
                <WalletIcon size={3} strokeWidth={1}></WalletIcon>{" "}
                <span className="ms-1">
                  {bettyRenderDouble(props.walletBalance, 2)}{" "}
                  {getDenomDisplayString(props.denom)}
                </span>
              </div>
            )}
            {props.type === "unstake" && (
              <div className="flex items-center">
                <StakeIcon size={3} strokeWidth={1}></StakeIcon>{" "}
                <span className="ms-1">
                  {bettyRenderDouble(props.staked, 2)}{" "}
                  {getDenomDisplayString(props.denom)}
                </span>
              </div>
            )}
          </div>
          <button onClick={() => setAmountFromWallet(0.5)}>
            <BorderedButton py={0}>Half</BorderedButton>{" "}
          </button>
          <button onClick={() => setAmountFromWallet(1)}>
            <BorderedButton py={0}>Max</BorderedButton>
          </button>
        </div>
      </div>
      <div className="mt-3 rounded-2xl p-5 bg-black/20 ">
        <div className="flex items-center ">
          <div className="flex justify-between items-center group/select">
            <TokenImage denom={props.denom}></TokenImage>
          </div>
          <div className="flex-1 text-right">
            <div className="text-white/80">
              <input
                type="text"
                inputMode="decimal"
                className="font-bold bg-transparent text-right w-full h-full outline-none text-xl"
                placeholder="0.0"
                value={inputStakeValue}
                onChange={onChangeStakeValue}
              ></input>
            </div>
            <div className="text-white/50 text-xs">
              {bettyRenderValue(getStakeDisplayValue())}
            </div>
          </div>
        </div>
      </div>

      {props.type === "unstake" && (
        <div className="bg-black/30 my-5 px-5 py-3 rounded">
          <div className="text-white/50 text-sm">Unbonding period</div>
          <div className="text-2xl font-bold mt-2">21 days</div>
          <div className="text-xs text-white/50 mt-2">
            Once this period has elapsed you are able to claim your tokens
          </div>
        </div>
      )}

      <div className="mt-5">{stakeButtonContent}</div>
    </>
  );
}
