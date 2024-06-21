"use client";
import { useNetwork } from "@/providers/network";
import { PassKeyObject } from "../types/ProjectTypes";
import { usePasskeys } from "@/providers/passkey";
import { useWallet } from "@/providers/wallet";
import { useEffect, useState } from "react";
import { getAccountAbbreviation } from "../../utils/utils";
import BorderedButton from "./BorderedButton";

export default function ConnectButton() {
  const [{ network, rpcs, rpc, setRpc, preferred, tmClient }, setNetwork] =
    useNetwork();
  const { createSigner, selectSigner, signers, signer } = usePasskeys();

  const { kujiraAccount, account, balance } = useWallet();
  //console.log('adapter selected: ' + walletAdapter)
  const createSignerClicked = async () => {
    try {
      await createSigner("Betty");
    } catch (error) {
      console.error("Failed to create signer:", error);
    }
  };
  let passkeys: PassKeyObject[] = [];
  Object.keys(signers).forEach(function (key) {
    passkeys.push(signers[key]);
  });
  const [selectedPassKey, setSelectedPassKey] = useState<PassKeyObject | "">(
    passkeys.length === 1 ? passkeys[0] : "",
  );

  const clickedSelectSigner = (passKeyObj: PassKeyObject) => {
    selectSigner(passKeyObj.credential.id);
    //setSelectedPassKey(passKeyObj)
    //console.log('selected signer: ' +signer)
  };

  let connectContent = <></>;
  useEffect(() => {
    let passkeys: PassKeyObject[] = [];
    Object.keys(signers).forEach(function (key) {
      passkeys.push(signers[key]);
    });
    if (passkeys.length === 1) {
      setSelectedPassKey(passkeys[0]);
    }
  }, [signers]);

  if (signer !== undefined) {
    connectContent = <div></div>;
    let walletContent = <>{balance}</>;
    connectContent = (
      <>
        <div>
          <BorderedButton px={3} py={1}>
            {getAccountAbbreviation(signer.credential.address)}
          </BorderedButton>
        </div>
        <div>{walletContent}</div>
      </>
    );
  } else if (passkeys.length > 0 && signer === undefined) {
    const keysSelectContent = passkeys.map((passKey, index) => (
      <div
        key={index}
        onClick={() => clickedSelectSigner(passKey)}
        className="bg-blue-500 p-2"
      >
        Select {passKey.credential.address}
      </div>
    ));
    connectContent = <div>Dummy{keysSelectContent}</div>;
  } else {
    connectContent = (
      <>
        <div className="flex items-center justify-center">
          <div
            onClick={() => createSignerClicked()}
            className="bg-lightBlue p-3 rounded cursor-pointer"
          >
            Create a new key
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-start">
        <div className="flex mt-5"></div>
        {connectContent}
      </div>
    </>
  );
}
