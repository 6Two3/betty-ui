import { useEffect, useState, useRef } from "react";
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
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  SubmitType,
  isDeliverTxResponse,
  isError,
} from "../notifications/ToasterTypes";
import { toast, Id } from "react-toastify";
import { useWallet } from "@/providers/wallet";
import { EncodeObject } from "@cosmjs/proto-signing";
import { betContract } from "../../../utils/utils";

export default function CreateBetForm() {
  const [transactionResult, setTransactionResult] = useState<
    "createbet-initiated" | DeliverTxResponse | Error | null
  >(null);
  const [descText, setDescText] = useState("");
  const [betDateEndText, setBetDateEndText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState<string[]>([]);
  const [newOptionText, setNenwOptionText] = useState("");
  const toastId = useRef<Id | null>(null);

  const { account, refreshBalances, signAndBroadcast } = useWallet();

  const addVoteOption = () => {
    if (newOptionText.length > 2) {
      let currentOptions: string[] = JSON.parse(JSON.stringify(selections));
      currentOptions.push(newOptionText);
      setSelections(currentOptions);
      setNenwOptionText("");
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };
  function closeModal() {
    setSelections([]);
    setDescText("");
    setNenwOptionText("");
    setIsOpen(false);
  }

  const descTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescText(e.currentTarget.value);
  };
  const newOptionsTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNenwOptionText(e.currentTarget.value);
  };

  useEffect(() => {
    if (transactionResult === "createbet-initiated") {
      toastId.current = toast(
        <SubmitType
          state={`waitingWallet`}
          message={`Cfreating Bet `}
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
              message={`Succesfully created a bet `}
            ></SubmitType>
          ),
          autoClose: 5000,
        });
      } else {
        toast(
          <SubmitType
            state="succesful"
            tx={transactionResult.transactionHash}
            message={`Succesfully placed a bet `}
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
    setTransactionResult("createbet-initiated");

    signAndBroadcast(data)
      .then(
        async (response: DeliverTxResponse) => {
          // Handle the response here
          console.log("Tx response: " + JSON.stringify(response));
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
    let msgObj = { create_game: {} };

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

  const onClickSave = () => {
    onClickBet();
    setSelections([]);
    setDescText("");
    setNenwOptionText("");
    setIsOpen(false);
  };

  const availableOptionsContent = selections.map((desc, index) => (
    <div key={index} className="bg-black/10 my-1 rounded px-3 py-1">
      {desc}
    </div>
  ));

  let submitButton = (
    <button
      onClick={() => onClickSave()}
      className="bg-lightBlue text-lg py-3 w-full rounded-xl hover:bg-lightBlue/70"
    >
      Submit
    </button>
  );
  if (selections.length < 2) {
    submitButton = (
      <button className="bg-lightBlue text-lg py-3 w-full rounded-xl hover:bg-lightBlue/70 disabled text-white/50">
        At least two options needed
      </button>
    );
  }

  return (
    <>
      <span onClick={() => openModal()}>
        <div className="flex gap-2 items-end">
          <div className=""></div>
          <BorderedButton py={1}>
            <div>Create a new Bet</div>
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
                <DialogPanel className="w-full bg-darkGray max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-white/50"
                  >
                    <div className="flex w-full">
                      <div className="flex-1 flex text-regular text-white/20">
                        Create a Bet
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
                    <div className="gap-5 bg-black/10 rounded p-5">
                      <div className="">Description</div>
                      <div className="text-white/80 rounded-md bg-black/20 ps-2 pe-2 py-2 text-sm font-medium text-white items-center mt-2">
                        <input
                          type="text"
                          className="rounded px-2 w-full bg-transparent outline-none"
                          onChange={descTextChange}
                          value={descText}
                          placeholder="Main Bet Description"
                        ></input>
                      </div>

                      <div className="mt-2">Bet Ending Date</div>
                      <div className="text-white/80 rounded-md bg-black/20 ps-4 pe-2 py-2 text-sm font-medium text-white items-center mt-2">
                        <input
                          type="text"
                          className="rounded px-2 w-full bg-transparent outline-none"
                          onChange={(e) => setBetDateEndText(e.target.value)}
                          value={betDateEndText}
                          placeholder="yyyy-mm-dd hh-mm-ss"
                        ></input>
                      </div>
                    </div>
                    <div className="p-5 bg-black/10 mt-3">
                      <div className="text-white/80 rounded-md bg-black/20 ps-4 pe-2 py-2 mb-2">
                        <input
                          type="text"
                          value={newOptionText}
                          onChange={newOptionsTextChange}
                          className="bg-transparent w-full outline-none"
                          placeholder="Voting description"
                        ></input>
                      </div>
                      <div onClick={() => addVoteOption()}>
                        <BorderedButton px={2} py={1}>
                          Add Selection
                        </BorderedButton>{" "}
                      </div>
                    </div>
                    <div className="mt-3"> Available options</div>
                    <div className="mt-5 bg-black/10">
                      <div>{availableOptionsContent}</div>
                    </div>
                    <div className="mt-5">{submitButton}</div>
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
