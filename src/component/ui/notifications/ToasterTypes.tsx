import SuccesfulIcon from "../../icons/SuccesfulIcon";
import UpdateIcon from "../../icons/UpdateIcon";
import UnsuccesfulIcon from "../../icons/UnsuccesfulIcon";
import { DeliverTxResponse } from "@cosmjs/stargate";

export function isError(arg: any): arg is Error {
  return (
    arg &&
    ((arg.code && typeof arg.code == "number") ||
      (arg.message && typeof arg.message == "string"))
  );
}
export function isDeliverTxResponse(arg: any): arg is DeliverTxResponse {
  return arg && arg.transactionHash && typeof arg.transactionHash == "string";
}

export const SubmitType = ({
  state,
  tx,
  title,
  message,
}: {
  state: string;
  tx?: string;
  title?: string;
  message?: string;
}) => {
  if (state === "waitingWallet") {
    return (
      <>
        <div className="p-3">
          <div className="text-base font-normal text-white/50">
            Pending Wallet To Sign
          </div>
          <div className="text-base font-normal text-white/50">{message}</div>
          <div className="flex gap-3 mt-3 items-center">
            <UpdateIcon size={4} animate={true}></UpdateIcon> Pending Wallet
          </div>
          <div></div>
          {/*<a href={`https://finder.kujira.network/kaiyo-1/tx/5710392AC1435A6EF374B94257FDD88A76BF0DFA4191823879DBD407E5813AFE`} target="finder">Tx</a>*/}
        </div>
      </>
    );
  } else if (state === "error") {
    return (
      <>
        <div className="p-3">
          <div className="text-base font-normal text-white/50">Error</div>
          <div className="flex gap-3 mt-3 items-center">
            <div className="text-red-500">
              <UnsuccesfulIcon size={4}></UnsuccesfulIcon>{" "}
            </div>
            <div>{message}</div>
          </div>
        </div>
      </>
    );
  } else if (state === "succesful") {
    return (
      <>
        <div className="p-3">
          <div className="text-base font-normal text-white/50">
            Swap Succesful
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-green-500">
              <SuccesfulIcon size={6}></SuccesfulIcon>
            </div>
            <div>{message}</div>
          </div>
          <div>
            <a
              href={`https://finder.kujira.network/kaiyo-1/tx/` + tx}
              target="finder"
            >
              Tx
            </a>
          </div>
        </div>
      </>
    );
  } else if (state === "success") {
    return (
      <>
        <div className="p-3">
          <div className="text-xl fron-normal text-white/50">
            Updating Route
          </div>
          <div>{tx}</div>
          {/*<a href={`https://finder.kujira.network/kaiyo-1/tx/5710392AC1435A6EF374B94257FDD88A76BF0DFA4191823879DBD407E5813AFE`} target="finder">Tx</a>*/}
        </div>
      </>
    );
  } else if (state === "error") {
    return (
      <>
        <div className="p-3">
          <div className="text-xl fron-normal text-white/50">
            Updating Route
          </div>
          <div>{tx}</div>
          {/*<a href={`https://finder.kujira.network/kaiyo-1/tx/5710392AC1435A6EF374B94257FDD88A76BF0DFA4191823879DBD407E5813AFE`} target="finder">Tx</a>*/}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="p-3">
        <div className="text-xl fron-normal text-white/50"></div>
        <div>{tx}</div>
        {/*<a href={`https://finder.kujira.network/kaiyo-1/tx/5710392AC1435A6EF374B94257FDD88A76BF0DFA4191823879DBD407E5813AFE`} target="finder">Tx</a>*/}
      </div>
    </>
  );
};
