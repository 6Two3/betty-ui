"use client";

import { usePasskeys } from "@/providers/passkey";
import ConnectButton from "./ui/ConnectButton";
export default function WelcomeComponent() {
  const { createSigner, selectSigner, signers, signer } = usePasskeys();
  let signupModule = <></>;

  //console.log('Signer: ' +JSON.stringify(signer))
  if (signer === undefined) {
    let signupContent = <></>;
    signupContent = <ConnectButton></ConnectButton>;
    signupModule = (
      <div className="text-center">
        <div>Welcome new user please create a passkey</div>
        <div>{signupContent}</div>
      </div>
    );
  } else {
    signupModule = <></>;
  }

  return <>{signupModule}</>;
}
