import { useState, useEffect, useRef } from "react";
import BorderedButton from "../BorderedButton";
import {
  Transition,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment } from "react";
import CloseDialogIcon from "../../icons/CloseDialogIcon";

import { BetItem } from "../../types/ProjectTypes";
import { Radio, RadioGroup } from "@headlessui/react";
import SuccesfulIcon from "../../icons/SuccesfulIcon";
import { useWallet } from "@/providers/wallet";
import { useNetwork } from "@/providers/network";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { EncodeObject } from "@cosmjs/proto-signing";
import { betContract } from "../../../utils/utils";
import {
  SubmitType,
  isDeliverTxResponse,
  isError,
} from "../notifications/ToasterTypes";
import { toast, Id } from "react-toastify";
import { bettyRenderDouble } from "../../../utils/numberFormat";
type BetoptionObject = { name: string; id: number };

export default function MakeVoteDialog(props: { bet: BetItem }) {
  const [betAmountText, setBetAmountText] = useState("");
  const [transactionResult, setTransactionResult] = useState<
    "vote-initiated" | DeliverTxResponse | Error | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);
  const [
    { network, rpcs, rpc, setRpc, preferred, query, tmClient },
    setNetwork,
  ] = useNetwork();
  const { account, refreshBalances, signAndBroadcast } = useWallet();
  const toastId = useRef<Id | null>(null);
  let outcomes: BetoptionObject[] = [];
  //console.log('Options: ' + JSON.stringify(props.bet.options))
  //Only did this since the radioButtons didnt work with string array
  props.bet.options.forEach((optionsName: string, i: number) => {
    outcomes.push({ name: atob(optionsName), id: i });
    //outcomes.push({name:optionsName,id:i})
  });
  const [selectedOutcome, setSelectedOutcome] = useState(outcomes[0]);
  const [customValueText, setCustomValueText] = useState("");

  useEffect(() => {
    if (transactionResult === "vote-initiated") {
      toastId.current = toast(
        <SubmitType
          state={`waitingWallet`}
          message={
            `Bet ` + bettyRenderDouble(parseFloat(betAmountText), 2) + ` USK`
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
                `Succesfully placed a bet ` +
                bettyRenderDouble(parseFloat(betAmountText), 2) +
                ` USK`
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
              `Succesfully placed a bet ` +
              bettyRenderDouble(parseFloat(betAmountText), 2) +
              `  USK`
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
    setTransactionResult("vote-initiated");

    signAndBroadcast(data)
      .then(
        async (response: DeliverTxResponse) => {
          // Handle the response here
          setTransactionResult(response);
        }, // You may need to adjust this line based on your actual types
      )
      .catch((error: Error) => {
        // Handle the error here
        console.error("error from sign and broadcast", error);
        setTransactionResult(error);
      });
  };
  const onClickBet = async () => {
    //console.log('Stake clicked: ' + inputStakeValue)
    if (!account) {
      return console.error("Account not found");
    }
    let fundsObj: any[] = [];
    let amountAsString = parseFloat(betAmountText) * 1000000;
    let msgObj = { bond: {} };

    const actionObj = { user: account.address };
    //setStakedAmount(stakedBig.toNumber()/10 ** Denom.from("factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta" || "").decimals)
    let encoder = new TextEncoder();
    let executeMsg: EncodeObject | undefined;
    executeMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: account.address, // Address of the sender executing the contract
        contract: betContract, // Address of the smart contract
        msg: encoder.encode(JSON.stringify(msgObj)),
        funds: fundsObj,
      },
    };

    await submit([executeMsg]);
  };

  const openModal = () => {
    setIsOpen(true);
  };
  function closeModal() {
    setIsOpen(false);
  }

  const betAmountTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let replacedValue = e.currentTarget.value.replace(",", ".").trim();
    let splitByDot: string[] = replacedValue.split(".");
    let parsedValue: number = parseFloat(replacedValue);
    let shouldCallRoute = false;
    //console.log('parsed Value: ' + parsedValue)
    //console.log('input Value: ' + e.currentTarget.value)
    //console.log('Char at last pos: ' +e.currentTarget.value.charAt(e.currentTarget.value.length-1))
    if (splitByDot.length < 3) {
      if (e.currentTarget.value.length === 0) {
        setBetAmountText("");
      } else if (
        (e.currentTarget.value.length > 0 &&
          (replacedValue.charAt(replacedValue.length - 1) === "." ||
            replacedValue.charAt(replacedValue.length - 1) === "0")) ||
        !isNaN(parsedValue)
      ) {
        const split: string[] = replacedValue.toString().split(".");

        //Check if more decimals than token
        if (split.length > 1 && split[1].length > 6) {
          replacedValue =
            "" + Math.floor(parseFloat(replacedValue) * 10 ** 6) / 10 ** 6;
        } else {
          if (replacedValue.charAt(replacedValue.length - 1) === ".") {
            setBetAmountText(replacedValue);
          } else {
            setBetAmountText(parsedValue + "");
          }

          shouldCallRoute = true;
        }
      }
    }
  };
  const onClickSave = () => {
    // props.callback(customValue.toFixed(1))
    // setCustomValue(parseFloat(customValue.toFixed(1)))
    // setCustomValueText(customValue.toFixed(1))
    setIsOpen(false);
  };

  return (
    <>
      <span onClick={() => openModal()}>
        <div className="flex gap-2 items-end">
          <div className=""></div>
          <BorderedButton py={1}>
            <div>Vote on Bet</div>
          </BorderedButton>
        </div>
      </span>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full bg-gray-700 max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-white/50"
                  >
                    <div className="flex w-full">
                      <div className="flex-1 flex text-regular text-white/20">
                        Vote on {props.bet.title}
                      </div>
                      <div
                        className="absolute right-5 top-5 text-white/20 hover:text-white/50 cursor-pointer"
                        onClick={closeModal}
                      >
                        <CloseDialogIcon size={4}></CloseDialogIcon>
                      </div>
                    </div>
                  </DialogTitle>
                  <div className="mt-5">
                    <div className="min-w-16 px-8"></div>

                    <div className="flex gap-5 bg-black/10 rounded p-5 w-full">
                      <div className="text-white/80 rounded-md bg-black/20 ps-4 pe-2 py-2 text-sm font-medium text-white flex items-center">
                        <RadioGroup
                          value={selectedOutcome}
                          onChange={setSelectedOutcome}
                          aria-label="Bet Outcome"
                          className="space-y-2"
                        >
                          {outcomes.map((plan, index) => (
                            <Radio
                              key={index}
                              value={plan}
                              className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                            >
                              <div className="flex w-full">
                                <div className="text-sm/6">
                                  <div className="font-semibold text-white">
                                    {plan.name}
                                  </div>
                                  <div className="flex gap-2 text-white/50 w-full">
                                    <div className="w-72"></div>
                                  </div>
                                </div>
                                {/*<span className="invisible size-4 rounded-full bg-white group-data-[checked]:visible"></span>*/}
                                <div className="w-4 h-4 text-green-500 invisible group-data-[checked]:visible">
                                  <SuccesfulIcon size={8}></SuccesfulIcon>
                                </div>
                              </div>
                            </Radio>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="mt-5">
                      <button
                        onClick={() => onClickSave()}
                        className="bg-lightBlue text-lg py-3 w-full rounded-xl hover:bg-lightBlue/70"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
